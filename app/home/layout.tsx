import { Metadata } from "next"


export const metadata: Metadata = {
  title: {
    default: 'Buttr.io | Smooth Market Intelligence for the LLM Era',
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
