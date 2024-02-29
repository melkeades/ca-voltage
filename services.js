import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'

import '@splidejs/splide/css'

import { addSplideClasses, sel, debounce, vw, connectSplideArrows, connectSplideBullets } from './utils'
export default function services() {
  ;(() => {
    const cont = sel('.tests__cont')
    const cont1 = sel('.tests__cont-1')

    const name = 'tests'
    addSplideClasses(name + '__slider')
    const splide = new Splide('.' + name + '__slider', {
      arrows: false,
      pagination: false,
      gap: '20rem',
      type: 'loop',
      perPage: 1,
      speed: 1500,
      interval: 5000,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      autoplay: 'pause',
      intersection: {
        inView: {
          autoplay: true,
        },
        outView: {
          autoplay: false,
        },
      },
    }).mount({ Intersection })

    function updateGap() {
      const gap = cont1.getBoundingClientRect().x - cont.getBoundingClientRect().x
      const vw5 = vw(5)
      splide.options.gap = gap < vw5 ? gap + vw5 : gap
      splide.refresh()
    }
    const refresh = debounce(updateGap, 100)
    splide.on('resize', () => {
      refresh()
    })
    connectSplideArrows(splide, name)
    connectSplideBullets(splide, name)
  })()
}
