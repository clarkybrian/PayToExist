import { NextResponse } from 'next/server'
import { getTotalPayments, getAllPayments } from '@/lib/supabase'

export async function GET() {
  try {
    const [totalPayments, allPayments] = await Promise.all([
      getTotalPayments(),
      getAllPayments()
    ])

    return NextResponse.json({
      totalPayments,
      payments: allPayments
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    )
  }
}
