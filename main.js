import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'
import '@splidejs/splide/css'
import { addSplideClasses, connectSplideArrows, connectSplideBullets, debounce, getSiblings, sel, selAll, vh, vw, mm, onDomReady, initObserver } from './utils'
import ScrollToPlugin from 'gsap/ScrollToPlugin'

import Home from './home'
import About from './about'
import Services from './services'
import Product from './product'
import Error from './error'

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

const navbarDd$a = selAll('.navbar__dd')
mm.add('(min-width: 991px)', (context) => {
  context.add('mouseenter', (e) => {
    const el = e.target.parentNode.querySelector('.navbar__dd__list')
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 }) // <- now it gets recorded in the Context
  })
  context.add('mouseleave', (e) => {
    const to = e.toElement || e.relatedTarget
    // console.log(e, to, to.classList.contains('navbar__cont'))
    if (to?.classList.contains('w-dropdown-list') || to?.classList.contains('navbar__cont')) return

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
  // update the link and name in accordance with the locale if it's a product tab
  if (tab.classList.contains('is-product')) {
    const linkedPane$ = sel('#' + tab.getAttribute('aria-controls'))
    const linkedItem$ = linkedPane$?.querySelector('.navbar__cat-data')
    const link = linkedItem$?.getAttribute('href')
    const name = linkedItem$?.textContent

    mm.add('(min-width: 991px)', (context) => {
      context.add('click', (e) => {
        e.stopPropagation()
        window.open(link, '_self')
      })
      tab.addEventListener('click', context.click)
      return () => {
        tab.removeEventListener('click', context.click)
      }
    })
    tab.textContent = name
    linkedPane$?.querySelector('.mm__a').setAttribute('href', link)
    initObserver(linkedItem$, 100, 'tab', () => {
      console.log('oo')
    })
  }
})

const searchIco$ = sel('.navbar__search-ico')
searchIco$?.addEventListener('click', function () {
  const searchInput$ = sel('.search__input')
  window.setTimeout(() => {
    searchInput$.focus()
  }, 100)
})

const dataPage = sel('.page-wrapper')?.getAttribute('data-page')
switch (dataPage) {
  case 'home':
    Home()
    break
  case 'about':
    About()
    break
  case 'product':
    Product()
    break
  case 'services':
    Services()
    break
  case 'service':
    Services()
    break
  case 'blog':
    // Services()
    break

  case 'error':
    Error()
    break
  default:
    console.log('unknown data-page:', dataPage)
}
