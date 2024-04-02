import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "CONNECT",
  description: "Video Calling App",
  icons:{
    icon: '/icons/appLogo.png'
  }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>

        {children}

      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout