import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pay To Exist',
  description: 'Confirmez votre existence en payant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-white text-black">{children}</body>
    </html>
  )
}
