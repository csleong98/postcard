'use client'

import Link from 'next/link'
import Image from 'next/image'
import { InstagramLogo, LinkedinLogo, TwitterLogo, EnvelopeSimple, Smiley, ChatCircle } from '@phosphor-icons/react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF6E9]">
      {/* Header - Matching the main page header */}
      <header className="bg-[#222222] text-white py-4 px-6 flex justify-between items-center sticky top-0 z-20">
        <Link href="/" className="text-3xl font-light italic font-['PP_Editorial_New'] mx-auto hover:text-gray-300">
          Postcards
        </Link>
        <div className="flex items-center gap-4 absolute right-6">
          <button className="flex items-center gap-1 hover:text-gray-300">
            <ChatCircle size={24} weight="fill" />
            <span className="hidden md:inline">Give feedback</span>
          </button>
          <Link href="/about" className="flex items-center gap-1 hover:text-gray-300">
            <Smiley size={24} weight="fill" />
            <span className="hidden md:inline">About Postcards.my</span>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Illustration - First on mobile, fixed on desktop */}
          <div className="md:col-span-6 order-1 md:order-2">
            <div className="md:sticky md:top-24">
              <Image 
                src="/images/illustration/feedback.png" 
                alt="Feedback illustration" 
                width={600} 
                height={600} 
                className="w-full h-auto"
              />
            </div>
          </div>
          
          {/* Content - Second on mobile */}
          <div className="md:col-span-6 order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-medium text-[#222222] font-['PP_Editorial_New'] mb-8">
              About Postcards.my
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="leading-[150%]">
                I love receiving postcards and I have been collecting them since young. I wanted to create the same feeling of receiving 
                the postcards for the digital world so that's why I created this site for anyone from anywhere to create, download and send 
                digital postcards with their own photos and stickers.
              </p>
              
              <p className="leading-[150%]">
                I hope you will love it and if you have any feature request or wanted to say hello feel free to reach out to me via the links below.
              </p>
              
              <h2 className="text-2xl font-medium mt-8 mb-4 font-['PP_Editorial_New']">Stack</h2>
              <ul className="list-disc pl-5 leading-[150%]">
                <li>Next.js</li>
                <li>Tailwind CSS</li>
                <li>HTML Canvas</li>
                <li>Cursor.ai</li>
              </ul>
              
              <h2 className="text-2xl font-medium mt-8 mb-4 font-['PP_Editorial_New']">Hosting</h2>
              <ul className="list-disc pl-5 leading-[150%]">
                <li>Vercel</li>
              </ul>
              
              <h2 className="text-2xl font-medium mt-8 mb-4 font-['PP_Editorial_New']">Typography</h2>
              <ul className="list-disc pl-5 leading-[150%]">
                <li>PP Editorial New for Headings</li>
                <li>Plus Jakarta Sans for body text</li>
              </ul>
              
              <h2 className="text-2xl font-medium mt-8 mb-4 font-['PP_Editorial_New']">Say hello</h2>
              <div className="flex space-x-4 mt-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <InstagramLogo size={24} weight="fill" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <LinkedinLogo size={24} weight="fill" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <TwitterLogo size={24} weight="fill" />
                </a>
                <a href="mailto:hello@postcards.my" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <EnvelopeSimple size={24} weight="fill" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#FFF6E9] py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">Created with ❤️ by Chee Seng Leong • 2023</p>
        </div>
      </footer>
    </div>
  )
} 