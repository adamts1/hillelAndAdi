/**
 * הלל ועדי – portrait paper/floral invitation.
 * Each section is a texture-framed card: its content sits inside a border that
 * is inset from the section edges, and that frame shows the paper texture
 * (background.png).
 *  1. Hero    – video background with a button into the invitation.
 *  2. Details – full image, text baked in.
 *  3. RSVP    – image backdrop; the live form flows below the baked-in title.
 */

import { useState } from 'react'
import RSVP from './components/RSVP'
import config from './config'

// Paper-texture frame shown around (outside) each section's border.
const frameBg = {
  backgroundColor: config.paperBg,
  backgroundImage: `url(${config.images.bgImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}
const frameBorder = 'border-2 border-[#9C7C3C]/40'

export default function App() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div
      className="design7-root fixed inset-0 overflow-y-auto overscroll-contain bg-cover bg-top"
      style={{
        backgroundColor: config.paperBg,
        backgroundImage: `url(${config.images.bgImg})`,
        WebkitOverflowScrolling: 'touch',
      }}
      dir={config.dir}
      lang={config.lang}
    >
      <style>{`
        html, body { overflow: hidden; height: 100%; overscroll-behavior: none; }
        .design7-root .text-olive,
        .design7-root .text-olive-light { color: #7E632E !important; }
        .design7-rsvp input, .design7-rsvp textarea {
          background-color: rgba(255,255,255,0.5) !important;
          border-color: rgba(156,124,60,0.4) !important;
          caret-color: #9C7C3C !important;
        }
        .design7-rsvp input::placeholder,
        .design7-rsvp textarea::placeholder { color: rgba(126,99,46,0.5) !important; }
        .design7-rsvp button[type="submit"] {
          border-width: 1px !important;
          backdrop-filter: blur(12px);
        }
        @keyframes design7-enter {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .design7-enter {
          opacity: 0;
          animation: design7-enter 0.8s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .design7-enter { animation: none; opacity: 1; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[480px]">
        {!showDetails ? (
          <section className="flex justify-center h-[100dvh] py-6 px-2.5" style={frameBg}>
            <div className={`relative h-full aspect-[1170/2532] max-w-full overflow-hidden ${frameBorder}`}>
              <video
                src={config.videos.heroVideo}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 top-[44%] z-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="group flex items-center gap-2 rounded-none border-2 border-[#9C7C3C]/40 bg-[#FCFCFC] px-7 py-3 font-serif text-base tracking-wide text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-[#F2ECDD]"
                >
                  כניסה
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {showDetails ? (
          <>
            {/* 2. Details – navigation button overlaid below the venue address */}
            <section id="details" className="design7-enter flex justify-center h-[100dvh] py-6 px-2.5" style={frameBg}>
              <div className={`relative h-full aspect-[1170/2532] max-w-full overflow-hidden ${frameBorder}`}>
                <img src={config.images.detailsImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-x-0 top-[53%] z-10 flex justify-center">
                  <a
                    href={config.navigationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="ניווט לאולם"
                    className="flex items-center justify-center w-11 h-11 rounded-full border border-[#9C7C3C]/40 bg-white/60 backdrop-blur-md text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-white/85"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>

            {/* 3. RSVP – image backdrop with the live form below the baked-in title */}
            <section id="rsvp" className="design7-enter py-6 px-2.5" style={{ ...frameBg, animationDelay: '0.15s' }}>
              <div
                className={`design7-rsvp overflow-hidden ${frameBorder}`}
                style={{
                  backgroundColor: config.paperBg,
                  // rsvpImg (title) on top; the paper texture fills everything below,
                  // so adding guests reveals paper instead of flat colour.
                  backgroundImage: `url(${config.images.rsvpImg}), url(${config.images.bgImg})`,
                  backgroundSize: '100% auto, cover',
                  backgroundPosition: 'top center, top center',
                  backgroundRepeat: 'no-repeat, no-repeat',
                }}
              >
                {/* pt clears the baked-in title; relative to card width. */}
                <div className="pt-[34%] pb-10 px-5">
                  <RSVP config={{ ...config.rsvp }} />
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  )
}
