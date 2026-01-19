import { Metadata } from "next"


export const metadata: Metadata = {
  title: {
    default: 'Buttr.io | AI & GEO Made Smooth',
    template: '%s | Coming Soon',
  },
  description: 'The future of X',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>  
  )
}
