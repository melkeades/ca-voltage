import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'

import '@splidejs/splide/css'

import { addSplideClasses, connectSplideArrows, connectSplideBullets, connectSplideCarouselBullets, debounce, sel, selAll, vw } from './utils'

export default function about() {
  console.log('about')
  ;(() => {
    const prefix = 'team'
    const el = '.' + prefix + '__slider'
    addSplideClasses(el)

    const slider = new Splide(el, {
      arrows: false,
      pagination: false,
      gap: '1rem',
      perPage: 4,
      perMove: 4,
      speed: 1500,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      breakpoints: {
        991: {
          perPage: 2,
          perMove: 2,
        },
        478: {
          perPage: 1,
          perMove: 1,
        },
      },
    }).mount()
    connectSplideArrows(slider, prefix)
    connectSplideCarouselBullets(slider, prefix)
  })()
  ;(() => {
    const prefix = 'position'
    const el = '.' + prefix + '__slider'
    addSplideClasses(el)

    const slider = new Splide(el, {
      arrows: false,
      pagination: false,
      gap: '1rem',
      perPage: 3,
      perMove: 3,
      speed: 1500,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      breakpoints: {
        991: {
          perPage: 2,
          perMove: 2,
        },
        478: {
          perPage: 1,
          perMove: 1,
        },
      },
    }).mount()
    connectSplideArrows(slider, prefix)
    connectSplideCarouselBullets(slider, prefix)
  })()
}
