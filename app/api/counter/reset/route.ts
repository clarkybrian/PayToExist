import { NextResponse } from 'next/server';

// Stockage en mémoire de secours
let memoryCounter = 1;

export async function POST() {
  try {
    console.log('🔄 Réinitialisation du compteur à 1');
    
    // Réinitialiser le stockage en mémoire
    memoryCounter = 1;
    
    // TODO: Quand Supabase sera configuré, réinitialiser aussi la base
    // await updateLiveCounter(1);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Compteur réinitialisé à 1',
      value: 1
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du compteur:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la réinitialisation' },
      { status: 500 }
    );
  }
}
