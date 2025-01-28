import './globals.css'

export const metadata = {
  title: 'Postcard - Create and send digital postcards to your loved ones',
  description: 'Create beautiful digital postcards with your own photos and messages. Draw, write, and customize your postcards online without any sign up required.',
  keywords: ['postcard', 'digital postcard', 'online postcard maker', 'postcard creator', 'custom postcards'],
  authors: [{ name: 'Chee Seng Leong'}],
  creator: 'Chee Seng Leong',
  publisher: 'Chee Seng Leong',
  openGraph: {
    title: 'Postcard - Create and send digital postcards to your loved ones',
    description: 'Create beautiful digital postcards with your own photos and messages. Draw, write, and customize your postcards online without any sign up required.',
    url: 'https://postcards.my',
    siteName: 'Postcard',
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
    creator: '@csleong98',
    images: ['/images/OG-thumbnail.png'],
  },
  other: {
    'facebook-domain-verification': 'your-domain-verification-code',
    'og:site_name': 'Postcard',
    'og:email': 'macintoshleong@email.com',
    'og:region': 'MY',
    'linkedin:author': 'https://linkedin.com/in/csleong98',
    'article:author': 'https://instagram.com/csleong98',
  },
  metadataBase: new URL('https://postcards.my'),
  alternates: {
    canonical: 'https://postcards.my',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
