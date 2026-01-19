import './globals.css'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    // <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Buttr.io | AI & GEO Made Smooth</title>
        <script src="https://cdn.tailwindcss.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono&display=swap"
          rel="stylesheet" />
      </head>
      <body>
        <div id="root"></div>
        {/* <script type="module" src="/index.tsx"></script> */}
        {children}
      </body>
    </html>
  )
}
