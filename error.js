import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'

import '@splidejs/splide/css'

import { addStaticSplideClasses, sel, debounce, vw, connectSplideArrows, connectSplideBullets } from './utils'
export default function error() {
  ;(() => {
    const prefix = 'error-card'
    addStaticSplideClasses(prefix + '__img__slider')
    const img = new Splide('.' + prefix + '__img__slider', {
      autoplay: false,
      autoHeight: true,
      type: 'fade',
      rewind: true,
      pagination: false,
      arrows: false,
    })

    addStaticSplideClasses(prefix + '__slider')
    const info = new Splide('.' + prefix + '__slider', {
      //   gap: '1rem',
      perPage: 1,
      type: 'loop',
      speed: 1500,
      //   width: '50vw',
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',

      pagination: false,
      arrows: false,
      isNavigation: true,
    })

    img.sync(info)
    img.mount()
    info.mount()
    connectSplideArrows(info, prefix)
    connectSplideBullets(info, prefix)
  })()
}
