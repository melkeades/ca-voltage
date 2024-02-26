import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'

import '@splidejs/splide/css'

import { addSplideClasses, connectSplideArrows, connectSplideBullets, debounce, sel, selAll, vw } from './utils'

export default function home() {
  const mapLocationW$ = sel('.map__location-w')
  const location$a = mapLocationW$.querySelectorAll('.w-dyn-list .map__location')
  // const fragment = document.createDocumentFragment()
  const mapPosition = sel('.map__map').getBoundingClientRect()
  const markerRadius = sel('.map__state__fill').getBoundingClientRect().width / 2

  const mapWidth = mapPosition.width
  // const mapWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  let locationTl = {}
  location$a.forEach((location) => {
    const state = location.dataset.map
    const mapState$ = sel('#' + state)
    const mapStateWrap$ = mapState$.querySelector('.map__state-in')
    const mapStateW$ = mapState$.querySelector('.map__state')
    const mapMarker$ = mapState$.querySelector('.map__state__fill')
    const markerPosition = mapMarker$.getBoundingClientRect().x - mapPosition.x
    const xShift = ((markerPosition - mapWidth / 2) / mapWidth) * 50
    const yShift = -10

    if (markerPosition > mapWidth / 2) {
      location.classList.add('is--left')
    }

    location.style.left = ((markerPosition + markerRadius + xShift) / mapWidth) * 100 + '%'
    location.style.top = mapMarker$.getBoundingClientRect().y + markerRadius - mapPosition.y + yShift + 'px'
    const line$ = location.querySelector('.map__line path')
    line$.setAttribute('d', `M0 100L150 10H${location.getBoundingClientRect().width}`)

    const lineLength = line$.getTotalLength()

    locationTl[state] = gsap
      .timeline({ defaults: { ease: 'power4.inOut', duration: 0.6 }, paused: true })
      .to(location, { opacity: 1, duration: 0.3 }, 0)
      .to(mapMarker$, { fill: 'white', duration: 0.3 }, 0)
      .to(
        mapStateWrap$,
        {
          x: xShift,
          y: yShift,
          scale: 1.1,
          filter: 'drop-shadow(0px 40px 20px rgba(46, 83, 127, 0.25))',
          transformOrigin: 'center',
        },
        0
      )
      .to(mapStateW$, { fill: '#1999F7' }, 0)
      // .to(mapStateW$, { y: -10, fill: 'var(--base-color-brand--blue)' }, 0)
      .from(location.querySelector('.map__location__info'), { y: 30, ease: 'power2.out' }, 0)
      .fromTo(
        line$,
        {
          strokeDashoffset: 0, // where is starts
          strokeDasharray: 0 + ' ' + lineLength, // dash length and gap length
        },
        { strokeDashoffset: 0, strokeDasharray: lineLength + ' ' + lineLength, duration: 0.3 },
        0.3
      )

    // fragment.appendChild(location)
  })

  // mapLocationW$.querySelector('.location__info-slider').replaceChildren(fragment)

  const mapStateW$ = selAll('.map__state-w')
  mapStateW$.forEach((mapState) => {
    mapState.addEventListener('mouseenter', function () {
      locationTl[this.id].play()
    })
    mapState.addEventListener('mouseleave', function () {
      locationTl[this.id].reverse()
    })
  })
  function testSliderInit() {
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
  }
  testSliderInit()

  const servicesList$ = sel('.services__list')
  const servicesItem$a = selAll('.services__item')
  const servicesTlSt = gsap.timeline({ defaults: { ease: 'none' } })

  servicesItem$a.forEach((item, index) => {
    item.style.cursor = 'pointer'
    item.addEventListener('pointerdown', function () {
      console.log('i:' + index)
    })
    if (index === 0) return

    servicesTlSt
      .to(servicesItem$a[index - 1], { '--services-opacity': 0 }, index)
      .to(item, { '--services-opacity': 1 }, index)
      .to('.service__img-' + index, { opacity: 0 }, index)
  })

  ScrollTrigger.create({
    trigger: servicesList$,
    start: 'top 50%',
    end: 'bottom 75%',
    animation: servicesTlSt,
    scrub: true,
    snap: 1 / servicesItem$a.length,
    // markers: true,
  })

  const navbarDd$a = selAll('.navbar__dd')
  let mm = gsap.matchMedia()
  mm.add('(min-width: 991px)', (context) => {
    context.add('mouseenter', (e) => {
      const el = e.target.parentNode.querySelector('.navbar__dd__list')
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 }) // <- now it gets recorded in the Context
    })
    context.add('mouseleave', (e) => {
      const to = e.toElement || e.relatedTarget
      // console.log(e, to, to.classList.contains('navbar__cont'))
      if (to.classList.contains('w-dropdown-list') || to.classList.contains('navbar__cont')) return

      const el = e.target.parentNode.querySelector('.navbar__dd__list')
      gsap.to(el, { opacity: 0, duration: 0.3 }) // <- now it gets recorded in the Context
    })

    navbarDd$a.forEach((dd) => {
      dd.addEventListener('mouseenter', context.mouseenter)
      dd.addEventListener('mouseleave', context.mouseleave)
    })

    return () => {
      navbarDd$a.forEach((dd) => {
        dd.removeEventListener('mouseenter', context.mouseenter)
        dd.removeEventListener('mouseleave', context.mouseleave)
      })
    }
  })

  function mapCounterInit() {
    const mapNum$ = sel('.map__h__num')
    // get the line height of the element in em
    const lineHeight = parseFloat(getComputedStyle(mapNum$).lineHeight) / parseFloat(getComputedStyle(mapNum$).fontSize)

    const num = mapNum$.textContent
    let numbers = num.split('').map(Number)

    let fragment = document.createDocumentFragment()
    const time = 3

    numbers.forEach((n, i) => {
      const span = document.createElement('span')
      span.textContent = '0 1 2 3 4 5 6 7 8 9 0'
      span.classList.add('map__num', 'map__num-' + (i + 1))
      fragment.appendChild(span)
    })
    mapNum$.replaceChildren(fragment)

    const mapNumbersTl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })

    numbers.forEach((number, i) => {
      const index = i + 1
      let params = {}
      switch (index) {
        case 1:
          params = { y: -number * lineHeight + 'em', duration: time }
          break
        case 2:
          params = { y: -(number + 10) * lineHeight + 'em', repeat: 1, duration: time / index }
          break
      }
      mapNumbersTl.to('.map__num-' + index, params, 0)
    })

    ScrollTrigger.create({
      trigger: mapNum$,
      start: 'top 75%',
      animation: gsap.to(mapNumbersTl, { progress: 1, duration: 3, ease: 'power4.out' }),
    })
  }
  mapCounterInit()

  mm.add('(max-width: 990px)', () => {
    const name = 'location'
    const locationSlider$ = sel('.' + name + '__slider')
    const locationInfoSlider$ = sel('.' + name + '__info-slider')
    addSplideClasses(locationSlider$)
    addSplideClasses(locationInfoSlider$)

    const locationInfoSlider = new Splide(locationInfoSlider$, {
      type: 'fade',
      rewind: true, // to make it "loop" with the type fade
      arrows: false,
      pagination: false,
      width: 300,
      gap: 0,
    })
    const locationSlider = new Splide(locationSlider$, {
      arrows: false,
      pagination: false,
      gap: '1rem',
      type: 'loop',
      autoWidth: true,
      drag: 'free',
      focus: 'center',
      isNavigation: true,
      autoScroll: { speed: 0.6, autoStart: true },
    })
    let currentState = ''
    const updateMapState = debounce(() => {
      const newSate = sel('.location__slider').querySelector('.is-active').dataset.map
      if (currentState === newSate) return
      if (currentState) sel('#' + currentState).classList.remove('is--active')
      sel('#' + newSate).classList.add('is--active')
      currentState = newSate
    })
    locationSlider.mount({ AutoScroll })
    locationInfoSlider.mount()
    locationSlider.on('active', (slide) => {
      locationInfoSlider.go(slide.slideIndex)
      updateMapState()
    })
  })
}
