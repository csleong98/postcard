'use client'

import Image from "next/image";
import PostcardCustomizer from "./components/PostcardCustomizer";
import { InstagramLogo, LinkedinLogo, TwitterLogo, EnvelopeSimple } from "@phosphor-icons/react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="section-spacing">
        {/* Text Container */}
        <div className="container-custom flex flex-col items-center justify-center text-center mb-10">
          <h1 className="h1 mb-4 text-slate-900">
            Recreating the joy of sending<br />postcards to your loved ones online
          </h1>
          <p className="body-large text-[#252525] max-w-2xl">
            Still remember the feeling of love and warm when you receive postcards from your friends or family? Well now you can send that feeling whenever they are in the world.
          </p>
        </div>
        {/* Full Width Image */}
        <div className="w-full">
          <Image
            src="/images/illustration/hero-img.png"
            alt="Hero Image"
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* How to Send Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <h2 className="h2 text-center mb-6 text-slate-900">
            How to send?
          </h2>
          <div className="overflow-x-auto no-scrollbar -mx-4 md:-mx-6 lg:mx-0">
            <div className="flex gap-4 px-4 md:px-6 lg:px-0 md:justify-center min-w-max">
              <div className="flex flex-col items-center w-[280px] md:w-64">
                <Image
                  src="/images/illustration/step 1.png"
                  alt="Upload a picture"
                  width={200}
                  height={200}
                  className="w-full h-auto mb-4"
                />
                <h3 className="title-medium text-slate-900 mb-1.5">Upload a picture</h3>
                <p className="body-medium text-center text-[#252525]">Upload your favorite landscape photo to the front of the card</p>
              </div>
              <div className="flex flex-col items-center w-[280px] md:w-64">
                <Image
                  src="/images/illustration/step 2.png"
                  alt="Draw something"
                  width={200}
                  height={200}
                  className="w-full h-auto mb-4"
                />
                <h3 className="title-medium text-slate-900 mb-1.5">Draw something</h3>
                <p className="body-medium text-center text-[#252525]">You can also draw on top of your uploaded photo to add more spice</p>
              </div>
              <div className="flex flex-col items-center w-[280px] md:w-64">
                <Image
                  src="/images/illustration/step 3.png"
                  alt="Write your message"
                  width={200}
                  height={200}
                  className="w-full h-auto mb-4"
                />
                <h3 className="title-medium text-slate-900 mb-1.5">Write your message</h3>
                <p className="body-medium text-center text-[#252525]">Flip the card around and write your message. Style it or add some color to it!</p>
              </div>
              <div className="flex flex-col items-center w-[280px] md:w-64">
                <Image
                  src="/images/illustration/step 4.png"
                  alt="Export and send it"
                  width={200}
                  height={200}
                  className="w-full h-auto mb-4"
                />
                <h3 className="title-medium text-slate-900 mb-1.5">Export and send it</h3>
                <p className="body-medium text-center text-[#252525]">Finally, preview the end result and download it to send it to anyone!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craft Section */}
      <section className="section-spacing bg-[#FFF5E3]">
        <div className="container-custom">
          <div className="text-center mb-6">
            <h2 className="h2 mb-4 text-slate-900">
              Craft your postcard and send it
            </h2>
            <p className="body-large text-[#252525]">
              No sign ups and logins. You just dive straight right in to making your postcard
            </p>
          </div>
          <div className="hidden md:block rounded-[48px] bg-[#F4E7CF] p-8 md:p-12">
            <div className="max-w-[879px] mx-auto">
              <PostcardCustomizer />
            </div>
          </div>
          <div className="md:hidden">
            <PostcardCustomizer />
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto flex flex-col-reverse md:flex-row items-center gap-6 md:gap-16">
            <div className="flex-1">
              <h2 className="h2 mb-4 text-slate-900">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center body-medium text-[#252525]">
        Created with ❤️ by Chee Seng Leong • 2025
      </footer>
    </main>
  );
}
