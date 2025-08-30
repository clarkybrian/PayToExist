import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { addPayment } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    if (!sig || !endpointSecret) {
      throw new Error('Missing signature or endpoint secret')
    }
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Gérer l'événement de paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Récupérer les métadonnées de géolocalisation depuis la session
      const metadata = session.metadata
      const city = metadata?.city || 'Unknown'
      const country = metadata?.country || 'Unknown'
      const latitude = metadata?.latitude ? parseFloat(metadata.latitude) : undefined
      const longitude = metadata?.longitude ? parseFloat(metadata.longitude) : undefined

      // Ajouter le paiement à la base de données
      await addPayment(city, country, latitude, longitude)
      
      console.log('Paiement enregistré:', { city, country, latitude, longitude })
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error)
    }
  }

  return NextResponse.json({ received: true })
}
