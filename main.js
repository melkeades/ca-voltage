import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import Splide from '@splidejs/splide'
import { Intersection } from '@splidejs/splide-extension-intersection'

import '@splidejs/splide/css'

import './style.styl'
import { addSplideClasses, connectSplideArrows, connectSplideBullets, sel, selAll } from './utils'

const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

const mapLocationW$ = sel('.map__location-w')
const location$a = mapLocationW$.querySelectorAll('.w-dyn-list .map__location')
const fragment = document.createDocumentFragment()
const mapPosition = sel('.map__map').getBoundingClientRect()
const markerRadius = sel('.map__state__fill').getBoundingClientRect().width / 2

const mapWidth = mapPosition.width
// const mapWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
let locationTl = {}
location$a.forEach((location) => {
  const state = location.dataset.map
  const mapStateW$ = sel('#' + state + ' .map__state')
  const mapMarker$ = sel('#' + state + ' .map__state__fill')
  const markerPosition = mapMarker$.getBoundingClientRect().x - mapPosition.x
  const xShift = ((markerPosition - mapWidth / 2) / mapWidth) * 50

  if (markerPosition > mapWidth / 2) {
    location.classList.add('is--left')
  }

  location.style.left = ((markerPosition + markerRadius) / mapWidth) * 100 + '%'
  location.style.top = mapMarker$.getBoundingClientRect().y + markerRadius - mapPosition.y + 'px'
  const line$ = location.querySelector('.map__line path')
  line$.setAttribute('d', `M0 100L150 10H${location.getBoundingClientRect().width}`)

  const lineLength = line$.getTotalLength()

  locationTl[state] = gsap
    .timeline({ defaults: { ease: 'power4.inOut', duration: 0.6 }, paused: true })
    .to(location, { opacity: 1, duration: 0.3 }, 0)
    .to(mapMarker$, { fill: 'white' }, 0)
    .to(
      mapStateW$,
      {
        x: xShift,
        y: -10,
        scale: 1.1,
        fill: '#1999F7',
        filter: 'drop-shadow(0px 40px 20px rgba(46, 83, 127, 0.25))',
        transformOrigin: 'center',
      },
      0
    )
    // .to(mapStateW$, { y: -10, fill: 'var(--base-color-brand--blue)' }, 0)
    .from(location.querySelector('.map__location__info'), { y: 30, ease: 'power2.out' }, 0)
    .fromTo(
      line$,
      {
        strokeDashoffset: 0, // where is starts
        strokeDasharray: 0 + ' ' + lineLength, // dash length and gap length
      },
      { strokeDashoffset: 0, strokeDasharray: lineLength + ' ' + lineLength },
      0
    )

  fragment.appendChild(location)
})

mapLocationW$.replaceChildren(fragment)

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
  const name = 'tests'
  addSplideClasses(name + '__slider')
  const splide = new Splide('.' + name + '__slider', {
    arrows: false,
    pagination: false,
    gap: '2rem',
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
  connectSplideArrows(splide, name)
  connectSplideBullets(splide, name)
}
testSliderInit()
