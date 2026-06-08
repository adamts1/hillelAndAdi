/**
 * הלל ועדי – portrait paper/floral invitation.
 * Each section is a texture-framed card: its content sits inside a border that
 * is inset from the section edges, and that frame shows the paper texture
 * (background.png).
 *  1. Hero    – video background with a button into the invitation.
 *  2. Details – full image, text baked in.
 *  3. RSVP    – image backdrop; the live form flows below the baked-in title.
 */

import { useState, useEffect, useRef } from 'react'
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
  const [rsvpVisible, setRsvpVisible] = useState(false)
  const rsvpRef = useRef(null)

  // Watch the RSVP section: hide the "scroll down" arrows once it comes into view.
  useEffect(() => {
    if (!showDetails) return
    const el = rsvpRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setRsvpVisible(entry.isIntersecting),
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [showDetails])

  // Google Calendar "add event" link, built from the config date/venue (Israel time).
  const calPad = (n) => String(n).padStart(2, '0')
  const calFmt = (d) =>
    `${d.getFullYear()}${calPad(d.getMonth() + 1)}${calPad(d.getDate())}T${calPad(d.getHours())}${calPad(d.getMinutes())}00`
  const calEnd = new Date(config.targetDate.getTime() + 5 * 60 * 60 * 1000)
  const googleCalUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent('החתונה של הלל ועדי')}` +
    `&dates=${calFmt(config.targetDate)}/${calFmt(calEnd)}` +
    `&location=${encodeURIComponent('אולם אדמה, הבושם 16, אשדוד')}` +
    '&ctz=Asia/Jerusalem'

  // Advance one section per press, in document order.
  const scrollToNextSection = () => {
    const ids = ['intro', 'details', 'rsvp']
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top > 8) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
  }

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
        @keyframes design7-bob {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, 7px, 0); }
        }
        .design7-arrows {
          display: flex;
          animation: design7-bob 1.4s ease-in-out infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        @keyframes design7-arrow-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .design7-arrow-cue { animation: design7-arrow-fade 0.4s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .design7-arrows { animation: none; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[480px]">
        {!showDetails ? (
          <section className="py-6 px-2.5" style={frameBg}>
            <div className={`relative w-full aspect-[1170/2532] overflow-hidden ${frameBorder}`}>
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
            {/* 2. Intro – floral wreath blessing, shown before the details. */}
            <section id="intro" className="design7-enter py-6 px-2.5" style={frameBg}>
              <div className={`relative w-full aspect-[1170/2532] overflow-hidden ${frameBorder}`}>
                <img src={config.images.introImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </section>

            {/* 3. Details – navigation button overlaid below the venue address */}
            <section id="details" className="design7-enter py-6 px-2.5" style={{ ...frameBg, animationDelay: '0.15s' }}>
              <div className={`relative w-full aspect-[1170/2532] overflow-hidden ${frameBorder}`}>
                <img src={config.images.detailsImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-x-0 top-[56%] z-10 flex items-center justify-center gap-3">
                  <a
                    href={config.navigationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="ניווט לאולם"
                    className="flex items-center justify-center w-11 h-11 rounded-full border-[3px] border-solid border-[#B1CAA7] bg-white/60 backdrop-blur-md text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-white/85"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                    </svg>
                  </a>
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="הוספה ליומן"
                    className="flex items-center justify-center w-11 h-11 rounded-full border-[3px] border-solid border-[#B1CAA7] bg-white/60 backdrop-blur-md text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-white/85"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>

            {/* 4. RSVP – image backdrop with the live form below the baked-in title */}
            <section ref={rsvpRef} id="rsvp" className="design7-enter py-6 px-2.5" style={{ ...frameBg, animationDelay: '0.3s' }}>
              <div
                className={`design7-rsvp overflow-hidden ${frameBorder}`}
                style={{
                  backgroundColor: config.paperBg,
                  // Layers top→bottom: rsvpImg (title) anchored to the top,
                  // rsvpImg2 (flower) anchored to the bottom so it stays visible
                  // as the card grows with added guests, paper texture filling behind.
                  backgroundImage: `url(${config.images.rsvpImg}), url(${config.images.rsvpImg2}), url(${config.images.bgImg})`,
                  backgroundSize: '100% auto, 100% auto, cover',
                  backgroundPosition: 'top center, bottom center, top center',
                  backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
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

      {/* Scroll cue – nudges guests toward the RSVP until it's on screen. */}
      {showDetails && !rsvpVisible && (
        <button
          type="button"
          onClick={scrollToNextSection}
          aria-label="לקטע הבא"
          className="design7-arrow-cue fixed bottom-6 left-1/2 -translate-x-1/2 z-30 text-[#75511E]"
        >
          <span className="design7-arrows flex flex-col items-center -space-y-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
