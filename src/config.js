/**
 * הלל ועדי – portrait paper/floral invitation.
 * Hero + details are full-bleed media with text baked in.
 * Only the RSVP image needs a live form overlaid below its baked-in title.
 *
 * The invitation ships in two languages. Everything that differs between them –
 * the baked-in images (Hebrew vs. English text), the UI strings, and the text
 * direction – lives in `translations[lang]`. Shared, language-agnostic values
 * (colours, date, venue link) are spread into both.
 */

// Hebrew (default) artwork
import heroImg from './assets/hero.webp'
import introImg from './assets/intro.webp'
import detailsImg from './assets/details.webp'
import rsvpImg from './assets/rsvp.webp'
import bgImg from './assets/background.webp'
// English artwork (PNGs converted to webp for fast loads)
import detailsEng from './assets/details-eng.webp'
import rsvpEng from './assets/rsvp-eng.webp'

const gold = '#9C7C3C'
const goldDark = '#7E632E'

// Values that are identical in every language.
const shared = {
  // Paper background colour, sampled from the images so overflow blends seamlessly.
  paperBg: '#F6F4ED',

  targetDate: new Date(2026, 7, 3, 19, 0, 0),

  // Venue navigation – אולם "אדמה", הבושם 16, אשדוד
  navigationUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('אולם אדמה הבושם 16 אשדוד'),

  contacts: [
    { name: 'הלל', phone: '000-0000000', tel: '+0000000000' },
    { name: 'עדי', phone: '000-0000000', tel: '+0000000000' },
  ],

  // Shared RSVP look & feel (title/intro stay baked into the image).
  rsvpStyle: {
    labels: { rsvp: '', intro: '' },
    titleColor: gold,
    // Match the entrance button: translucent white, gold border, gold text.
    submitButtonColor: 'rgba(255,255,255,0.55)',
    submitButtonHoverColor: 'rgba(255,255,255,0.85)',
    submitButtonBorderColor: 'rgba(156,124,60,0.4)',
    submitButtonTextColor: goldDark,
    celebrationColors: ['#9C7C3C', '#C9A75A', '#E6CC8A', '#7E632E', '#F6F4ED', '#B8C5E0', '#F4D35E', '#D9A7C7'],
    sectionBg: 'bg-transparent',
  },
}

// English label set for the live RSVP form (Hebrew defaults live in RSVP.jsx).
const enLabels = {
  contactTitle: 'Contact us',
  adults: 'Number of guests',
  guestLabel: (i) => `Guest ${i + 1}`,
  nameLabel: 'Full name *',
  phoneLabel: 'Phone number *',
  messageLabel: 'Message to the couple',
  specialRequestsLabel: 'Special requests',
  submit: 'Send',
  submitting: 'Sending...',
  ariaMinus: 'Remove',
  ariaPlus: 'Add',
  thankYou: 'Thank you for confirming!',
  successMsg: 'Your RSVP was received. We can’t wait to celebrate with you!',
  errName: 'Please enter a full name',
  errNameShort: 'Name must be at least 2 characters',
  errPhone: 'Please enter a phone number',
  errPhoneInvalid: 'Invalid phone number',
  errMinGuests: 'Please add at least one guest',
  errSubmit: 'Something went wrong, please try again',
}

export const translations = {
  he: {
    ...shared,
    lang: 'he',
    dir: 'rtl',
    title: 'הלל ועדי - הזמנה לחתונה',
    description: 'שמחים להזמינכם לשמחת נישואינו – 3.8.26, אולם אדמה, אשדוד',
    // UI strings that live in JSX rather than baked into images.
    ui: {
      enter: 'כניסה',
      navAria: 'ניווט לאולם',
      nextAria: 'לקטע הבא',
      langToggle: '🇬🇧',
      langToggleAria: 'Switch to English',
    },
    // Full Hebrew experience: a hero cover gate, then intro → details → rsvp.
    hero: true,
    sections: ['intro', 'details', 'rsvp'],
    images: { heroImg, introImg, detailsImg, rsvpImg, bgImg },
    rsvp: { ...shared.rsvpStyle, lang: 'he' },
  },

  en: {
    ...shared,
    lang: 'en',
    dir: 'ltr',
    title: 'Hillel & Adi - Wedding Invitation',
    description: 'Join us in celebrating our wedding – Aug 3, 2026, Adama Hall, Ashdod',
    ui: {
      enter: 'Enter',
      navAria: 'Navigate to the venue',
      nextAria: 'Next section',
      langToggle: '🇮🇱',
      langToggleAria: 'מעבר לעברית',
    },
    // English experience: no hero cover, no intro — only details → rsvp.
    hero: false,
    sections: ['details', 'rsvp'],
    images: { detailsImg: detailsEng, rsvpImg: rsvpEng, bgImg },
    rsvp: { ...shared.rsvpStyle, labels: { ...enLabels, rsvp: '', intro: '' }, lang: 'en' },
  },
}

export const defaultLang = 'he'

// Back-compat default export (Hebrew) for anything importing the old shape.
export const config = translations[defaultLang]
export default config
