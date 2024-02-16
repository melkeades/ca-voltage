import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

import './style.styl'
import { sel, selAll } from './utils'

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

const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
let locationTl = {}
location$a.forEach((location) => {
  const state = location.dataset.map
  const mapStateW$ = sel('#' + state + ' .map__state')
  const mapMarker$ = sel('#' + state + ' .map__state__fill')
  const markerPosition = mapMarker$.getBoundingClientRect()
  if (markerPosition.x > viewportWidth / 2) {
    location.classList.add('is--left')
    location.style.left = ((markerPosition.x + markerRadius - mapPosition.x) / mapPosition.width) * 100 + '%'
  } else {
    location.style.left = ((markerPosition.x + markerRadius - mapPosition.x) / mapPosition.width) * 100 + '%'
  }
  location.style.top = markerPosition.y + markerRadius - mapPosition.y + 'px'
  const line$ = location.querySelector('.map__line path')

  const lineLength = line$.getTotalLength()

  console.log(line$)

  locationTl[state] = gsap
    .timeline({ defaults: { ease: 'power2.out', duration: 0.3 }, paused: true })
    .to(location, { opacity: 1 }, 0)
    .to(mapMarker$, { fill: 'white' }, 0)
    .to(mapStateW$, { y: -10, scale: 1.025, fill: '#1999F7', filter: 'drop-shadow(0px 40px 20px rgba(46, 83, 127, 0.25))', transformOrigin: 'center' }, 0)
    // .to(mapStateW$, { y: -10, fill: 'var(--base-color-brand--blue)' }, 0)
    .from(location.querySelector('.map__location__info'), { y: 20 }, 0)
    .fromTo(
      line$,
      {
        strokeDashoffset: 0, // where is starts
        strokeDasharray: 0 + ' ' + lineLength, // dash length and gap length
      },
      { strokeDashoffset: 0, strokeDasharray: lineLength + ' ' + lineLength, duration: 1 },
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
