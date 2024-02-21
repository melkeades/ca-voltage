export const sel = (e) => document.querySelector(e)
export const selAll = (e) => document.querySelectorAll(e)
export const vh = (percent) => window.innerHeight * (percent / 100)
export const vw = (percent) => window.innerWidth * (percent / 100)
const isDomEl = (el) => el instanceof Document || el instanceof Element
const l = (...e) => console.log(...e)

// export function debounce(func, time = 100) {
//   let timer = 0
//   return function (event) {
//     if (timer) clearTimeout(timer)
//     timer = setTimeout(func, time, event)
//   }
// }
export function debounce(func, timeout = 100) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}
export function devMode(mode) {
  if (mode === 0) {
    return
  } else if (mode === 1) {
    let i = 0
    document.querySelectorAll('[data-video-urls]').forEach((el) => {
      el.querySelector('video').remove()
      i++
    })
    console.log('devMode, removed videos:', i)
  } else if (mode === 2) {
    const devRemoveList = []
    // const devRemoveList = [videoHero$, introSec$, aboutSec$]
    devRemoveList.forEach((el) => {
      el.remove()
    })
    console.log('devMode: removing sections')
  }
}

export function removeSplideClasses(slider) {
  const splide = document.querySelector('.' + slider)
  const track = splide.querySelector('.splide__track')
  const list = splide.querySelector('.splide__list')
  const slide = splide.querySelectorAll('.splide__slide')
  splide.classList.remove('splide')
  track.classList.remove('splide__track')
  list.classList.remove('splide__list')
  slide.forEach((slide) => slide.classList.remove('splide__slide'))
}
export function addSplideClasses(slider, trackClass = '') {
  let splide
  if (typeof slider === 'string') {
    splide = document.querySelector('.' + slider)
  } else if (isDomEl(slider)) {
    splide = slider
  }
  // const track = splide.children[0]
  // const track = splide.querySelector('.w-dyn-list')
  const track = trackClass === '' ? splide.querySelector('.w-dyn-list') : splide.querySelector(trackClass)

  const list = track.children[0]
  const slide = list.childNodes
  splide.classList.add('splide')
  track.classList.add('splide__track')
  list.classList.add('splide__list')
  slide.forEach((slide) => slide.classList.add('splide__slide'))
}

export function connectSplideArrows(splide, classPrefix) {
  sel(`.${classPrefix}__arrows .arrow--left`).addEventListener('pointerdown', function () {
    splide.go('<')
  })

  sel(`.${classPrefix}__arrows .arrow:not(.arrow--left)`).addEventListener('pointerdown', function () {
    splide.go('>')
  })
}
export function connectSplideBullets(splide, classPrefix) {
  // parse bullets inside the container and repopulate
  const pagination$ = sel(`.${classPrefix}__pagination`)
  let bulletPressed = false
  if (splide.length > 1) {
    const bullet$ = sel(`.${classPrefix}__pagination .bullet:not(.bullet--active)`)
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < splide.length; i++) {
      let clone$ = bullet$.cloneNode(true)
      clone$.addEventListener('click', (e) => {
        bulletPressed = true
        splide.go(i)
      })
      fragment.appendChild(clone$)
    }
    fragment.firstChild.classList.add('bullet--active')
    pagination$.replaceChildren(fragment)
  } else {
    pagination$.replaceChildren()
  }
  splide.on('move', function (newIndex, oldIndex) {
    sel(`.${classPrefix}__pagination .bullet--active`).classList.remove('bullet--active')
    sel(`.${classPrefix}__pagination .bullet:nth-of-type(${splide.index + 1})`).classList.add('bullet--active')
  })
}

export function splideAutoWidth(splide) {
  // if not enough logos it will center them and stop the slider
  const Components = splide.Components
  // to remove duplicates for inactive/small slider
  splide.on('overflow', function (isOverflow) {
    splide.go(0) // Reset the carousel position

    splide.options = {
      focus: isOverflow ? 'center' : '',
      drag: isOverflow ? 'free' : false,
      clones: isOverflow ? undefined : 0, // Toggle clones
    }
  })
  let sliderOverflow = true
  let sliderReady = false
  // to center inactive/small slider
  splide.on('resized', function () {
    var isOverflow = Components.Layout.isOverflow()
    sliderOverflow = isOverflow
    var list = Components.Elements.list
    var lastSlide = Components.Slides.getAt(splide.length - 1)

    if (lastSlide) {
      // Toggles `justify-content: center`
      list.style.justifyContent = isOverflow ? 'flex-start' : 'center'

      // Remove the last margin
      if (!isOverflow) {
        lastSlide.slide.style.marginRight = ''
      }
    }
    if (sliderReady) {
      splideInit()
    }
  })
  splide.on('mounted', splideInit)
  function splideInit() {
    sliderReady = true
    if (!sliderOverflow) {
      splide.Components.AutoScroll.pause()
    } else if (sliderOverflow && splide.Components.AutoScroll.isPaused()) {
      // } else if (sliderOverflow && splide.Components.AutoScroll?.isPaused()) {
      splide.Components.AutoScroll.play()
    }
  }
}

export function onDomReady(run) {
  if (document.readyState !== 'loading') {
    run()
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      run()
    })
  }
}

// Add an observer that checks if a class exists. If it does remove the observer and call a function
export function addObserver(element, className, callback) {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        observer.disconnect()
        callback()
      }
    })
  })
  observer.observe(element, {
    attributes: true,
    attributeFilter: ['class'],
  })
}

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function scrollTriggerInit(distance = 0, elClassName = '', sectionClassName = '', fromToType = '', topMiddleBottom = '', markers = false) {
  const tlType = fromToType === '' ? 'fromTo' : fromToType
  const stPosition = topMiddleBottom === '' ? 'middle' : topMiddleBottom
  // negative distance = front object (faster on scroll), positive distance = back object (slower on scroll/more sticky)
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
  if (tlType === 'fromTo') {
    let fromDistance = -distance,
      toDistance = distance
    // remove the minus sign in a string for fromDistance
    if (typeof distance === 'string' && distance.charAt(0) === '-') fromDistance = distance.substring(1)

    tl.fromTo('.' + elClassName, { y: fromDistance }, { y: toDistance })
  } else if (tlType === 'to') {
    tl.to('.' + elClassName, { y: distance })
    console.log('to')
  } else if (tlType === 'from') {
    console.log('from')
    tl.from('.' + elClassName, { y: distance })
  }

  let start = 'top bottom'
  let end = 'bottom top'
  if (stPosition === 'top') {
    start = 'top top'
  } else if (stPosition === 'bottom') {
    end = 'bottom bottom'
  }

  sectionClassName = sectionClassName || elClassName
  return ScrollTrigger.create({
    animation: tl,
    trigger: '.' + sectionClassName,
    start: start,
    end: end,
    markers: markers,
    scrub: true,
    delay: 0.0,
  })
}

export function addSwiperClasses(slider) {
  const swiper = document.querySelector('.' + slider)
  const list = swiper.children[0]
  const slide = list.childNodes
  swiper.classList.add('swiper')
  list.classList.add('swiper-wrapper')
  slide.forEach((slide) => slide.classList.add('swiper-slide'))
}

export function getSiblings(e) {
  let siblings = []
  // if no parent, return no sibling
  if (!e.parentNode) {
    return siblings
  }
  // first child of the parent node
  let sibling = e.parentNode.firstChild
  // collecting siblings
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== e) {
      siblings.push(sibling)
    }
    sibling = sibling.nextSibling
  }
  return siblings
}
