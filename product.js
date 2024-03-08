import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'

import '@splidejs/splide/css'

import { addSplideClasses, sel, debounce, vw, connectSplideArrows, connectSplideBullets } from './utils'
export default function product() {
  ;(() => {
    const name = 'product-details'
    addSplideClasses(name + '__slider')
    const splide = new Splide('.' + name + '__slider', {
      perPage: 1,
      width: '100%',
      autoplay: false,
      autoHeight: true,
      type: 'fade',
      rewind: true,
      pagination: false,
      arrows: false,
    })

    addSplideClasses(name + '__thumb-slider')
    const thumbnails = new Splide('.' + name + '__thumb-slider', {
      gap: '1rem',
      perPage: 4,
      rewind: true,
      pagination: false,
      arrows: false,
      isNavigation: true,
      breakpoints: {
        767: {
          perPage: 4.5,
          gap: '0.25rem',
        },
      },
    })

    splide.sync(thumbnails)
    splide.mount()
    thumbnails.mount()
  })()
}
