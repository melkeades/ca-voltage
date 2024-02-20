import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'

import '@splidejs/splide/css'

import './style.styl'
import { addSplideClasses, connectSplideArrows, connectSplideBullets, debounce, getSiblings, sel, selAll, vw } from './utils'
import ScrollToPlugin from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

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
  const mapState$ = sel('#' + state)
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
      mapState$,
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
  const cont = sel('.tests__cont')
  const cont1 = sel('.tests__cont-1')
  // let gap = a.getBoundingClientRect().x - b.getBoundingClientRect().x

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
    // console.log('gap: ', gap, vw5)
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
  // pin: '.services__img-col',
  animation: servicesTlSt,
  scrub: true,
  snap: 1 / servicesItem$a.length,
  // markers: true,
})

// // Get all the tabs and tab panes
// const tabs = document.querySelectorAll('.tab')
// const tabPanes = document.querySelectorAll('.tab-pane')

// // Add mouseover event listener to each tab
// tabs.forEach((tab, index) => {
//   tab.addEventListener('mouseover', () => {
//     // Remove the 'active' class from all tabs and tab panes
//     tabs.forEach((t) => t.classList.remove('active'))
//     tabPanes.forEach((pane) => pane.classList.remove('active'))

//     // Add the 'active' class to the hovered tab and corresponding tab pane
//     tab.classList.add('active')
//     tabPanes[index].classList.add('active')
//   })
// })
//
// sel('.navbar10_menu-dropdown').addEventListener('mouseover', function () {

sel('.navbar10_menu-dropdown:nth-of-type(2)').addEventListener('mouseenter', function () {
  // const g = sel('.navbar10_logo-link')
  // console.log(g)
  // g.dispatchEvent(new MouseEvent('click'))
  // g.style.opacity = 0.5
})

const navbarTabs$a = selAll('.navbar__dd__tab')
function changeTabHandle(tab) {
  if (tab.classList.contains('w--current')) return

  const currentTab$ = tab.parentNode.querySelector('.w--current')
  currentTab$.classList.remove('w--current')
  currentTab$.ariaSelected = false
  const currentPane$ = sel('#' + currentTab$.getAttribute('aria-controls'))
  currentPane$.classList.remove('w--tab-active')

  tab.classList.add('w--current')
  tab.ariaSelected = true
  const newPane$ = sel('#' + tab.getAttribute('aria-controls'))
  newPane$.classList.add('w--tab-active')
}

navbarTabs$a.forEach((tab) => {
  tab.addEventListener('mouseenter', function () {
    changeTabHandle(this)
    // console.log('enter', this.dispatchEvent(new MouseEvent('click')))
    // context.onHover()
  })
  tab.addEventListener('click', function (e) {
    // e.preventDefault()
    e.stopPropagation()

    changeTabHandle(this)
  })
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
    console.log(e, to, to.classList.contains('navbar__cont'))
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
mm.add('(max-width: 990px)', () => {})
