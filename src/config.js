/**
 * הלל ועדי – portrait paper/floral invitation.
 * Hero + details are full-bleed media with text baked in.
 * Only the RSVP image needs a live form overlaid below its baked-in title.
 */

import heroImg from './assets/hero.webp'
import introImg from './assets/intro.webp'
import detailsImg from './assets/details.webp'
import rsvpImg from './assets/rsvp.webp'
import bgImg from './assets/background.webp'

const gold = '#9C7C3C'
const goldDark = '#7E632E'

export const config = {
  title: 'הלל ועדי - הזמנה לחתונה',
  description: 'שמחים להזמינכם לשמחת נישואינו – 3.8.26, אולם אדמה, אשדוד',
  lang: 'he',
  dir: 'rtl',

  // Paper background colour, sampled from the images so overflow blends seamlessly.
  paperBg: '#F6F4ED',

  targetDate: new Date(2026, 7, 3, 19, 0, 0),

  // Venue navigation – אולם "אדמה", הבושם 16, אשדוד
  navigationUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('אולם אדמה הבושם 16 אשדוד'),

  images: { heroImg, introImg, detailsImg, rsvpImg, bgImg },

  contacts: [
    { name: 'הלל', phone: '000-0000000', tel: '+0000000000' },
    { name: 'עדי', phone: '000-0000000', tel: '+0000000000' },
  ],

  rsvp: {
    // Title and intro are baked into the RSVP image, so suppress the duplicates.
    labels: { rsvp: '', intro: '' },
    titleColor: gold,
    // Match the entrance button: translucent white, gold border, gold text.
    submitButtonColor: 'rgba(255,255,255,0.55)',
    submitButtonHoverColor: 'rgba(255,255,255,0.85)',
    submitButtonBorderColor: 'rgba(156,124,60,0.4)',
    submitButtonTextColor: goldDark,
    celebrationColors: ['#9C7C3C', '#C9A75A', '#E6CC8A', '#7E632E', '#F6F4ED', '#B8C5E0', '#F4D35E', '#D9A7C7'],
    sectionBg: 'bg-transparent',
    lang: 'he',
  },
}

export default config
