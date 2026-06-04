/**
 * Shared RSVP form with celebration effects.
 * Receives all text labels, colors, and contact info via `config` prop.
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import emailjs from '@emailjs/browser'

const defaultLabels = {
  rsvp: 'אישור הגעה',
  intro: 'נשמח לראותכם חוגגים איתנו!',
  contactTitle: 'צרו קשר',
  adults: 'מספר אורחים',
  guestLabel: (i) => `אורח/ת ${i + 1}`,
  nameLabel: 'שם מלא *',
  phoneLabel: 'מספר טלפון *',
  messageLabel: 'הודעה לזוג',
  submit: 'שליחה',
  submitting: 'שולח...',
  ariaMinus: 'הפחת',
  ariaPlus: 'הוסף',
  thankYou: 'תודה על האישור!',
  successMsg: 'האישור התקבל בהצלחה. נתראה בשמחה!',
  errName: 'נא להזין שם מלא',
  errNameShort: 'השם חייב להכיל לפחות 2 תווים',
  errPhone: 'נא להזין מספר טלפון',
  errPhoneInvalid: 'מספר טלפון לא תקין',
  errMinGuests: 'נא להוסיף לפחות אורח אחד',
  errSubmit: 'שגיאה בשליחה, נא לנסות שוב',
}

function validateGuests(guests, phone, labels) {
  const phoneError = !phone.trim() ? labels.errPhone : !/^[\d\s\-+()]{9,20}$/.test(phone.trim()) ? labels.errPhoneInvalid : ''
  const nameErrors = guests.map((g) => {
    if (!g.name.trim()) return labels.errName
    if (g.name.trim().length < 2) return labels.errNameShort
    return ''
  })
  return { nameErrors, phoneError }
}

const CONFETTI_SHAPES = ['circle', 'square', 'heart', 'leaf']

function makePieces(count, direction, wave = 0, colors) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${direction}-w${wave}-${i}`,
    left: Math.random() * 100,
    delay: wave * 1.5 + Math.random() * 2,
    duration: 2.5 + Math.random() * 2.5,
    size: 5 + Math.random() * 14,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
    rotation: Math.random() * 360,
    drift: -50 + Math.random() * 100,
    direction,
  }))
}

function Confetti({ colors }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    setPieces([
      ...makePieces(60, 'down', 0, colors),
      ...makePieces(60, 'up', 0, colors),
      ...makePieces(50, 'down', 1, colors),
      ...makePieces(50, 'up', 1, colors),
      ...makePieces(40, 'down', 2, colors),
      ...makePieces(40, 'up', 2, colors),
    ])
    const timer = setTimeout(() => setPieces([]), 10000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            ...(p.direction === 'down' ? { top: '-5%' } : { bottom: '-5%' }),
            animation: `${p.direction === 'down' ? 'confettiFall' : 'confettiRise'} ${p.duration}s ease-out ${p.delay}s forwards`,
            '--drift': `${p.drift}px`,
          }}
        >
          {p.shape === 'heart' ? (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : p.shape === 'leaf' ? (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color} style={{ transform: `rotate(${p.rotation}deg)` }}>
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L7 19c2-2 4-4 8-5 3.5-1 6.4-1 8-1-1-3-3.5-6-6-5z" />
            </svg>
          ) : (
            <span
              style={{
                display: 'block',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : '2px',
                transform: `rotate(${p.rotation}deg)`,
              }}
            />
          )}
        </span>
      ))}
    </div>
  )
}

function makeFireworks(count, colors) {
  return Array.from({ length: count }, (_, i) => {
    const x = 10 + Math.random() * 80
    const launchHeight = 30 + Math.random() * 40
    const delay = Math.random() * 4
    const color = colors[Math.floor(Math.random() * colors.length)]
    const sparks = Array.from({ length: 12 }, (_, j) => {
      const angle = (j / 12) * Math.PI * 2
      const dist = 40 + Math.random() * 60
      return {
        id: `spark-${i}-${j}`,
        burstX: `${Math.cos(angle) * dist}px`,
        burstY: `${Math.sin(angle) * dist}px`,
        size: 3 + Math.random() * 5,
        duration: 0.8 + Math.random() * 0.6,
        color,
      }
    })
    return { id: `fw-${i}`, x, launchHeight, delay, color, sparks }
  })
}

function Firecrackers({ colors }) {
  const [fireworks, setFireworks] = useState([])

  useEffect(() => {
    setFireworks(makeFireworks(8, colors))
    const timer2 = setTimeout(() => {
      setFireworks((prev) => [...prev, ...makeFireworks(6, colors)])
    }, 3000)
    const cleanup = setTimeout(() => setFireworks([]), 10000)
    return () => { clearTimeout(timer2); clearTimeout(cleanup) }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="absolute"
          style={{
            left: `${fw.x}%`,
            bottom: '0%',
          }}
        >
          <div
            style={{
              width: 3,
              height: 20,
              background: `linear-gradient(to top, transparent, ${fw.color})`,
              borderRadius: 2,
              animation: `fireworkLaunch 0.8s ease-out ${fw.delay}s forwards`,
              '--launch-height': `-${fw.launchHeight}vh`,
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: 0,
              left: '50%',
              transform: `translateY(-${fw.launchHeight}vh)`,
            }}
          >
            {fw.sparks.map((s) => (
              <span
                key={s.id}
                className="absolute"
                style={{
                  width: s.size,
                  height: s.size,
                  backgroundColor: s.color,
                  borderRadius: '50%',
                  boxShadow: `0 0 6px 2px ${s.color}`,
                  animation: `fireworkBurst ${s.duration}s ease-out ${fw.delay + 0.8}s forwards`,
                  '--burst-x': s.burstX,
                  '--burst-y': s.burstY,
                  opacity: 0,
                  animationFillMode: 'forwards',
                }}
              />
            ))}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${fw.color}40, transparent 70%)`,
                animation: `fireworkGlow 1s ease-out ${fw.delay + 0.8}s forwards`,
                opacity: 0,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const inputBase =
  'w-full px-4 py-3 md:py-3.5 rounded-lg border border-blush-light bg-white/30 backdrop-blur-sm text-olive md:text-lg placeholder:text-olive-light/50 focus:border-blush-dark focus:ring-2 focus:ring-blush/20 outline-none transition-all duration-200'

const emptyGuest = () => ({ name: '' })

/**
 * config shape:
 * {
 *   labels: { ... },           // override default Hebrew labels
 *   contacts: [{ name, phone, tel }],  // contact people
 *   celebrationColors: [...],  // colors for confetti/fireworks
 *   submitButtonColor: '#508330',
 *   submitButtonHoverColor: '#5C943A',
 *   titleColor: '#CF43A8',
 *   lang: 'he',
 * }
 */
export default function RSVP({ config = {} }) {
  const t = { ...defaultLabels, ...config.labels }
  const contacts = config.contacts || []
  const celebrationColors = config.celebrationColors || ['#E8A0B5', '#CF43A8', '#D4789A', '#F0D4DE', '#508330', '#7CB342', '#FFD700', '#F472B6']
  const submitBg = config.submitButtonColor || '#508330'
  const submitHover = config.submitButtonHoverColor || '#5C943A'
  const submitBorderColor = config.submitButtonBorderColor || 'transparent'
  const submitTextColor = config.submitButtonTextColor || '#FFFFFF'
  const titleColor = config.titleColor || '#CF43A8'
  const lang = config.lang || 'he'
  const sectionBg = config.sectionBg || 'bg-cream'

  const [guests, setGuests] = useState([emptyGuest()])
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [nameErrors, setNameErrors] = useState([''])
  const [phoneError, setPhoneError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const setGuestCount = (delta) => {
    setGuests((prev) => {
      const newCount = Math.max(1, Math.min(20, prev.length + delta))
      if (newCount > prev.length) {
        const added = Array.from({ length: newCount - prev.length }, emptyGuest)
        return [...prev, ...added]
      }
      return prev.slice(0, newCount)
    })
    setNameErrors((prev) => {
      const newCount = Math.max(1, Math.min(20, prev.length + delta))
      if (newCount > prev.length) {
        const added = Array.from({ length: newCount - prev.length }, () => '')
        return [...prev, ...added]
      }
      return prev.slice(0, newCount)
    })
  }

  const updateGuestName = (index, value) => {
    setGuests((prev) => prev.map((g, i) => (i === index ? { name: value } : g)))
    setNameErrors((prev) => prev.map((e, i) => (i === index ? '' : e)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (guests.length === 0) {
      setSubmitError(t.errMinGuests)
      return
    }

    const { nameErrors: nErrors, phoneError: pError } = validateGuests(guests, phone, t)
    setNameErrors(nErrors)
    setPhoneError(pError)
    if (nErrors.some((e) => e) || pError) return

    setSubmitting(true)

    try {
      const rows = guests.map((g) => ({
        name: g.name.trim(),
        phone: phone.trim(),
        message: message.trim(),
        lang,
        created_at: new Date().toISOString(),
      }))

      if (supabase) {
        const { error: dbError } = await supabase.from('rsvp').insert(rows)
        if (dbError) throw dbError
      }

      const guestList = guests
        .map((g, i) => `${i + 1}. ${g.name}`)
        .join('\n') + `\nטלפון: ${phone.trim()}`

      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: import.meta.env.VITE_NOTIFICATION_EMAIL,
            guest_count: String(guests.length),
            guest_list: guestList,
            message: message.trim() || '—',
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        )
      } catch {
        console.warn('Email notification failed, but RSVP was saved.')
      }

      setSubmitted(true)
    } catch (err) {
      console.error('RSVP submission error:', err)
      setSubmitError(t.errSubmit)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <>
      <Confetti colors={celebrationColors} />
      <Firecrackers colors={celebrationColors} />
      <section
        id="rsvp"
        className={`py-8 md:min-h-screen md:flex md:flex-col md:justify-center md:py-24 px-4 md:px-10 ${sectionBg} overflow-hidden`}
      >
        <div className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center w-full">
          <div className="bg-cream rounded-2xl shadow-soft-lg p-6 md:p-12 border border-blush-light animate-fade-in-up">
            <div className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-green/15 flex items-center justify-center mx-auto mb-4 md:mb-6 animate-bounce-in">
              <svg className="w-7 h-7 md:w-9 md:h-9 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-olive font-bold mb-2">{t.thankYou}</h2>
            <p className="text-olive-light font-sans">{t.successMsg}</p>
          </div>
          {contacts.length > 0 && (
            <div id="contact" className="mt-6 pt-4 md:mt-12 md:pt-8 border-t border-blush-light text-center">
              <h2 className="font-display text-2xl md:text-3xl text-olive font-bold mb-4">{t.contactTitle}</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 font-sans pb-4">
                {contacts.map((c, i) => (
                  <a key={i} href={`tel:${c.tel}`} className="text-olive hover:text-blush-dark transition-colors">
                    {c.name}: {c.phone}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      </>
    )
  }

  return (
    <section
      id="rsvp"
      className={`py-8 md:min-h-screen md:flex md:flex-col md:justify-center md:py-24 px-4 md:px-10 ${sectionBg} text-olive overflow-hidden`}
    >
      <div className="max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto w-full">
        {t.rsvp && (
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl text-center font-bold mb-2 md:mb-4"
            style={{ color: titleColor }}
          >
            {t.rsvp}
          </h2>
        )}
        {t.intro && (
          <p className="text-center font-sans text-base md:text-lg text-olive-light mb-4 md:mb-8">
            {t.intro}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between gap-4">
            <label className="font-sans text-sm md:text-base font-medium text-olive">{t.adults}</label>
            <div className="flex items-center border border-blush-light rounded-lg overflow-hidden bg-white/30 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setGuestCount(-1)}
                aria-label={t.ariaMinus}
                className="w-10 h-10 flex items-center justify-center text-olive hover:bg-blush-light/30 transition-colors"

              >
                <span className="text-lg leading-none">−</span>
              </button>
              <span className="w-12 text-center font-sans">{guests.length}</span>
              <button
                type="button"
                onClick={() => setGuestCount(1)}
                aria-label={t.ariaPlus}
                className="w-10 h-10 flex items-center justify-center text-olive hover:bg-blush-light/30 transition-colors"
              >
                <span className="text-lg leading-none">+</span>
              </button>
            </div>
          </div>

          {guests.map((guest, i) => (
            <div
              key={i}
              className="rounded-xl border border-blush-light/50 bg-white/20 backdrop-blur-sm p-4 space-y-3"
            >
              <p className="font-sans text-sm font-semibold text-olive-light">{t.guestLabel(i)}</p>
              <div>
                <label
                  htmlFor={`name-${i}`}
                  className="block font-sans text-sm font-medium text-olive mb-1"
                >
                  {t.nameLabel}
                </label>
                <input
                  id={`name-${i}`}
                  type="text"
                  value={guest.name}
                  onChange={(e) => updateGuestName(i, e.target.value)}
                  className={`${inputBase} ${nameErrors[i] ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                  autoComplete="name"
                />
                {nameErrors[i] && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{nameErrors[i]}</p>
                )}
              </div>
            </div>
          ))}

          <div>
            <label
              htmlFor="phone"
              className="block font-sans text-sm font-medium text-olive mb-1"
            >
              {t.phoneLabel}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setPhoneError('') }}
              className={`${inputBase} ${phoneError ? 'border-red-500 ring-2 ring-red-200' : ''}`}
              autoComplete="tel"
            />
            {phoneError && (
              <p className="mt-1 text-sm text-red-600" role="alert">{phoneError}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block font-sans text-sm font-medium text-olive mb-1">
              {t.messageLabel}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className={`${inputBase} resize-y min-h-[80px] md:min-h-[100px]`}
            />
          </div>

          {submitError && (
            <p className="text-sm text-red-700 text-center" role="alert">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-lg font-sans font-medium transition-colors border-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: submitBg, borderColor: submitBorderColor, color: submitTextColor }}
            onMouseEnter={(e) => !submitting && (e.target.style.backgroundColor = submitHover)}
            onMouseLeave={(e) => !submitting && (e.target.style.backgroundColor = submitBg)}
          >
            {submitting ? t.submitting : t.submit}
          </button>
        </form>

        {contacts.length > 0 && (
          <div id="contact" className="mt-6 pt-4 md:mt-12 md:pt-8 border-t border-blush-light text-center">
            <h2 className="font-display text-2xl md:text-3xl text-olive font-bold mb-3 md:mb-4">{t.contactTitle}</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-8 font-sans pb-10">
              {contacts.map((c, i) => (
                <a key={i} href={`tel:${c.tel}`} className="text-olive hover:text-blush-dark transition-colors">
                  {c.name}: {c.phone}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
