import './globals.css'

export const metadata = {
  title: 'Postcard Creator',
  description: 'Create and customize your own postcards',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
