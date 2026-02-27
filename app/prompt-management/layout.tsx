export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
    // TODO: Check for permissions on this page

    return (
        <>
          {children}
        </>  
    )
}