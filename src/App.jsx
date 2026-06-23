/**
 * הלל ועדי – portrait paper/floral invitation.
 * Each section is a texture-framed card: its content sits inside a border that
 * is inset from the section edges, and that frame shows the paper texture
 * (background.png).
 *  1. Hero    – video background with a button into the invitation.
 *  2. Details – full image, text baked in.
 *  3. RSVP    – image backdrop; the live form flows below the baked-in title.
 */

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { translations, defaultLang } from './config'

// RSVP pulls in Supabase + EmailJS + confetti; load it as a separate chunk so
// the cover/hero render fast on a cold load instead of waiting on those libs.
const RSVP = lazy(() => import('./components/RSVP'))

const frameBorder = 'border-2 border-[#9C7C3C]/40'

// Open in Hebrew for Hebrew-locale browsers, English for everyone else.
const detectLang = () => {
  if (typeof navigator === 'undefined') return defaultLang
  const langs = navigator.languages || [navigator.language || '']
  return langs.some((l) => l.toLowerCase().startsWith('he')) ? 'he' : 'en'
}

export default function App() {
  const [lang, setLang] = useState(detectLang)
  const [switching, setSwitching] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [rsvpVisible, setRsvpVisible] = useState(false)
  const rsvpRef = useRef(null)
  const rootRef = useRef(null)

  const config = translations[lang]
  const t = config.ui

  // Cross-fade on language switch: fade the content out, swap language at
  // opacity 0 (so the RTL/LTR flip + image change isn't jarring), fade back in.
  const toggleLang = () => {
    setSwitching(true)
    setTimeout(() => {
      setLang((l) => (l === 'he' ? 'en' : 'he'))
      setSwitching(false)
    }, 260)
  }

  // Paper-texture frame shown around (outside) each section's border.
  const frameBg = {
    backgroundColor: config.paperBg,
    backgroundImage: `url(${config.images.bgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  // Keep the document title in sync with the active language.
  useEffect(() => {
    document.title = config.title
  }, [config.title])

  // Preload every section image (both languages) up front so they're cached
  // before the guest taps the entrance button or flips the toggle.
  useEffect(() => {
    Object.values(translations).forEach((c) =>
      Object.values(c.images).forEach((src) => {
        const img = new Image()
        img.src = src
      }),
    )
  }, [])

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

  // Custom slow smooth-scroll (native `smooth` speed isn't controllable).
  const slowScrollTo = (targetTop, duration = 1400) => {
    const container = rootRef.current
    if (!container) return
    const start = container.scrollTop
    const change = targetTop - start
    const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t) // easeInOutQuad
    let startTime = null
    const step = (now) => {
      if (startTime === null) startTime = now
      const progress = Math.min((now - startTime) / duration, 1)
      container.scrollTop = start + change * ease(progress)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  

  // Advance one section per press, in document order.
  const scrollToNextSection = () => {
    const container = rootRef.current
    if (!container) return
    const ids = ['intro', 'details', 'rsvp']
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top > 8) {
        const targetTop =
          container.scrollTop + el.getBoundingClientRect().top - container.getBoundingClientRect().top
        slowScrollTo(targetTop, 1400)
        return
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className="design7-root fixed inset-0 overflow-y-auto overscroll-contain bg-cover bg-top"
      style={{
        backgroundColor: config.paperBg,
        backgroundImage: `url(${config.images.bgImg})`,
        WebkitOverflowScrolling: 'touch',
      }}
      dir={config.dir}
      lang={config.lang}
    >
      {/* Language toggle – bare flag icon, fixed top-left on every section. */}
      <button
        type="button"
        onClick={toggleLang}
        aria-label={t.langToggleAria}
        className="fixed top-4 left-4 z-40 text-2xl leading-none drop-shadow-[0_2px_4px_rgba(124,99,46,0.35)] transition-transform hover:scale-110"
      >
        {t.langToggle}
      </button>

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
          animation: design7-enter 1.6s ease-out forwards;
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

      <div
        className="mx-auto w-full max-w-[480px]"
        style={{ opacity: switching ? 0 : 1, transition: 'opacity 260ms ease' }}
      >
        {!showDetails ? (
          <section className="py-6 px-2.5" style={frameBg}>
            <div className={`relative w-full aspect-[1170/2532] overflow-hidden ${frameBorder}`}>
              <img src={config.images.heroImg} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-x-0 top-[44%] z-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="group flex items-center gap-2 rounded-none border-2 border-[#9C7C3C]/40 bg-[#FCFCFC] px-7 py-3 font-serif text-base tracking-wide text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-[#F2ECDD]"
                >
                  {t.enter}
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
                <div className="absolute inset-x-0 top-[62%] z-10 flex items-center justify-center gap-3">
                  <a
                    href={config.navigationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.navAria}
                    className="flex items-center justify-center w-11 h-11 rounded-full border-[3px] border-solid border-[#B1CAA7] bg-white/60 backdrop-blur-md text-[#7E632E] shadow-[0_8px_22px_rgba(124,99,46,0.14)] transition-colors hover:bg-white/85"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
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
                  // rsvpImg (title) anchored to the top; paper texture fills
                  // behind as the card grows with added guests.
                  backgroundImage: `url(${config.images.rsvpImg}), url(${config.images.bgImg})`,
                  backgroundSize: '100% auto, cover',
                  backgroundPosition: 'top center, top center',
                  backgroundRepeat: 'no-repeat, no-repeat',
                }}
              >
                {/* pt clears the baked-in title; relative to card width. */}
                <div className="pt-[34%] pb-10 px-5">
                  <Suspense fallback={null}>
                    <RSVP config={{ ...config.rsvp }} />
                  </Suspense>
                </div>
              </div>
            </section>

            {/* Credit footer */}
            <footer className="px-2.5 pb-6 pt-2 text-center" style={frameBg}>
              <p className="font-serif text-xs text-[#7E632E]/70" dir="ltr">
                © {config.targetDate.getFullYear()}{' '}
                <a
                  href="https://tsityat.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[#9C7C3C]/40 underline-offset-2 transition-colors hover:text-[#7E632E]"
                >
                  TSITYAT - AI Boutique Agency
                </a>
              </p>
            </footer>
          </>
        ) : null}
      </div>

      {/* Scroll cue – nudges guests toward the RSVP until it's on screen. */}
      {showDetails && !rsvpVisible && (
        <button
          type="button"
          onClick={scrollToNextSection}
          aria-label={t.nextAria}
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
