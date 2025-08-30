import { NextRequest, NextResponse } from 'next/server';
import { incrementLiveCounter, getLiveCounter, updateLiveCounter } from '@/lib/supabase';

// Stockage en mémoire de secours
let memoryCounter = 1; // Commence à 1 comme demandé

// Fonction pour vérifier si Supabase est configuré
function isSupabaseConfigured() {
  // Temporairement, on force l'utilisation de la mémoire jusqu'à ce que les vraies clés soient configurées
  const hasValidConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here';
  
  return hasValidConfig;
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const counter = await getLiveCounter();
      return NextResponse.json({ 
        success: true, 
        value: counter || 1,
        source: 'supabase'
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        value: memoryCounter,
        source: 'memory'
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: true, 
      value: memoryCounter,
      source: 'memory_fallback'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { increment } = body;

    if (increment && typeof increment === 'number') {
      if (isSupabaseConfigured()) {
        // Utiliser Supabase
        const newValue = await incrementLiveCounter(increment);
        return NextResponse.json({ 
          success: true, 
          value: newValue,
          source: 'supabase'
        });
      } else {
        // Mode développement avec stockage en mémoire
        memoryCounter += increment;
        return NextResponse.json({ 
          success: true, 
          value: memoryCounter,
          source: 'memory'
        });
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Paramètre increment requis' },
        { status: 400 }
      );
    }
  } catch (error) {
    // Fallback vers le stockage en mémoire
    const body = await request.json();
    const { increment } = body;
    if (increment && typeof increment === 'number') {
      memoryCounter += increment;
      return NextResponse.json({ 
        success: true, 
        value: memoryCounter,
        source: 'memory_fallback'
      });
    }
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'incrémentation du compteur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { value } = body;

    if (typeof value === 'number') {
      if (isSupabaseConfigured()) {
        // Utiliser Supabase
        const success = await updateLiveCounter(value);
        if (success) {
          return NextResponse.json({ 
            success: true, 
            value: value 
          });
        } else {
          return NextResponse.json(
            { success: false, error: 'Échec de la mise à jour' },
            { status: 500 }
          );
        }
      } else {
        // Mode développement avec stockage en mémoire
        memoryCounter = value;
        return NextResponse.json({ 
          success: true, 
          value: memoryCounter 
        });
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Paramètre value requis' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour du compteur' },
      { status: 500 }
    );
  }
}
