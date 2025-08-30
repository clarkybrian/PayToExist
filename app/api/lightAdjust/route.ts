import { NextResponse } from 'next/server'

// Cette API permet d'ajuster la luminosité de la texture terrestre si nécessaire
// et peut être utilisée pour d'autres ajustements visuels à l'avenir
export async function POST(request: Request) {
  try {
    const { brightness } = await request.json()
    
    // Simuler un traitement de luminosité
    const newSettings = {
      brightness: brightness || 1.2,
      contrast: 1.1,
      success: true
    }
    
    return NextResponse.json(newSettings)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'ajustement de la luminosité' }, { status: 500 })
  }
}
