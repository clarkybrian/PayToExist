import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pay To Exist',
  description: 'Confirmez votre existence en payant',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-white text-black min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
