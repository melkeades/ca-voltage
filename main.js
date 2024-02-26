import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'
import '@splidejs/splide/css'
import { addSplideClasses, connectSplideArrows, connectSplideBullets, debounce, getSiblings, sel, selAll, vh, vw } from './utils'
import ScrollToPlugin from 'gsap/ScrollToPlugin'

import Home from './home'
import About from './about'

import './style.styl'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

const navbarSticky$ = sel('.navbar-sticky .navbar')
if (navbarSticky$) {
  const navbarTl = gsap.to(navbarSticky$, {
    keyframes: { '0%': { opacity: 0 }, '30%': { opacity: 1 }, '100%': { opacity: 1 } },
    yPercent: 100,
    ease: 'linear',
    paused: true,
  })
  ScrollTrigger.create({
    trigger: 'body',
    start: vh(160) + ' top',
    onToggle({ direction, getVelocity }) {
      // to reverse the easing
      gsap.to(navbarTl, { duration: 1.5, progress: direction === 1 ? 1 : 0, ease: 'expo.out' })
    },
  })
}

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
  })
  tab.addEventListener('click', function (e) {
    // e.preventDefault()
    e.stopPropagation()
    changeTabHandle(this)
  })
})

const dataPage = sel('.page-wrapper')?.getAttribute('data-page')
switch (dataPage) {
  case 'home':
    Home()
    break
  case 'about':
    About()
    break
  case 'error':
    error()
    break
  default:
    console.log('unknown data-page:', dataPage)
}
