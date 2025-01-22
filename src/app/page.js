'use client'

import Image from "next/image";
import PostcardCustomizer from "./components/PostcardCustomizer";
import { InstagramLogo, LinkedinLogo, TwitterLogo, EnvelopeSimple } from "@phosphor-icons/react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1
          className="h1 mb-4 text-slate-900"
        >
          Recreating the joy of sending<br />postcards to your loved ones online
        </h1>
        <p className="body-large text-[#252525] max-w-2xl">
          Still remember the feeling of love and warm when you receive postcards from your friends or family? Well now you can send that feeling whenever they are in the world.
        </p>
      </div>

      <section className="relative w-full">
        <Image
          src="/images/illustration/hero-img.png"
          alt="Hero Image"
          width={1920}
          height={1080}
          className="w-full h-auto"
          priority
        />
      </section>

      {/* How to Send Section */}
      <section className="py-16 md:py-24">
        <h2
          className="h2 text-center mb-12 text-slate-900 px-4"
        >
          How to send?
        </h2>
        <div className="overflow-x-auto no-scrollbar md:px-4">
          <div className="flex gap-8 md:gap-12 md:justify-center min-w-max md:min-w-0 px-4 md:px-0">
            <div className="flex flex-col items-center gap-4 w-[280px] md:w-48">
              <h3 className="title-medium text-slate-900">Upload a picture</h3>
              <Image
                src="/images/illustration/step 1.png"
                alt="Upload a picture"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <p className="body-medium text-center text-[#252525]">Upload your favorite landscape photo to the front of the card</p>
            </div>
            <div className="flex flex-col items-center gap-4 w-[280px] md:w-48">
              <h3 className="title-medium text-slate-900">Draw something</h3>
              <Image
                src="/images/illustration/step 2.png"
                alt="Draw something"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <p className="body-medium text-center text-[#252525]">You can also draw on top of your uploaded photo to add more spice</p>
            </div>
            <div className="flex flex-col items-center gap-4 w-[280px] md:w-48">
              <h3 className="title-medium text-slate-900">Write your message</h3>
              <Image
                src="/images/illustration/step 3.png"
                alt="Write your message"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <p className="body-medium text-center text-[#252525]">Flip the card around and write your message. Style it or add some color to it!</p>
            </div>
            <div className="flex flex-col items-center gap-4 w-[280px] md:w-48">
              <h3 className="title-medium text-slate-900">Export and send it</h3>
              <Image
                src="/images/illustration/step 4.png"
                alt="Export and send it"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <p className="body-medium text-center text-[#252525]">Finally, preview the end result and download it to send it to anyone!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Craft Section */}
      <section className="py-16 md:py-24 px-4 bg-[#FFF5E3]">
        <h2
          className="h2 text-center mb-4 text-slate-900"
        >
          Craft your postcard and send it
        </h2>
        <p className="body-large text-center text-[#252525] mb-12">
          No sign ups and logins. You just dive straight right in to making your postcard
        </p>
        <div className="max-w-[879px] mx-auto">
          <PostcardCustomizer />
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1">
            <h2
              className="h2 mb-4 text-slate-900"
            >
              Wanted to<br />provide feedback?
            </h2>
            <p className="body-large text-[#252525] mb-8">
              This is the first version of Postcards and I understand it might be lacking a lot of things. If you have feedback towards it. Please don't hesitate to send me an email or message me on these social media platforms.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-slate-900">
                <InstagramLogo size={24} weight="fill" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-slate-900">
                <LinkedinLogo size={24} weight="fill" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-slate-900">
                <TwitterLogo size={24} weight="fill" />
              </a>
              <a href="mailto:example@email.com" className="text-slate-700 hover:text-slate-900">
                <EnvelopeSimple size={24} weight="fill" />
              </a>
            </div>
          </div>
          <div className="flex-1">
            <Image
              src="/images/illustration/feedback.png"
              alt="Feedback"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center body-medium text-[#252525]">
        Created with ❤️ by Chee Seng Leong • 2025
      </footer>
    </main>
  );
}
