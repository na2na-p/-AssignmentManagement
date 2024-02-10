import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { NextUIProvider } from '@nextui-org/react'
import { ReactNode } from 'react'

const noto = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-notojp',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className={`${noto.className}`}>
      <NextUIProvider>{children}</NextUIProvider>
    </div>
  )
}
