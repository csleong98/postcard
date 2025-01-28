import './globals.css'

export const metadata = {
  title: 'Postcard - Create and send digital postcards to your loved ones',
  description: 'Create beautiful digital postcards with your own photos and messages. Draw, write, and customize your postcards online without any sign up required.',
  openGraph: {
    title: 'Postcard - Create and send digital postcards to your loved ones',
    description: 'Create beautiful digital postcards with your own photos and messages. Draw, write, and customize your postcards online without any sign up required.',
    images: [
      {
        url: '/images/OG-thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Postcard Builder Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Postcard - Create and send digital postcards to your loved ones',
    description: 'Create beautiful digital postcards with your own photos and messages. Draw, write, and customize your postcards online without any sign up required.',
    images: ['/images/OG-thumbnail.png'],
    creator: '@csleong98',
  },
  metadataBase: new URL('https://postcard.cheeseng.dev'),
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
