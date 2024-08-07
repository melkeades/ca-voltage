import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Splide from '@splidejs/splide'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'

import '@splidejs/splide/css'

import { addSplideClasses, connectSplideArrows, connectSplideBullets, debounce, sel, selAll, vw, mm, onDomReady, repeatArr } from './utils'

export default function home() {
  const mapLocationW$ = sel('.map__location-w')
  const location$a = mapLocationW$.querySelectorAll('.w-dyn-list .map__location')
  // const fragment = document.createDocumentFragment()
  const map$ = sel('.map__map')
  const mapSvg$ = sel('.map-svg')
  const mapPosition = map$.getBoundingClientRect()
  const markerRadius = sel('.map__state__fill').getBoundingClientRect().width / 2

  const mapWidth = mapPosition.width
  // const mapWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  // const hoverBlue = getComputedStyle(document.documentElement).getPropertyValue('--base-color-brand--light-gray')
  const hoverBlue = '#b9e0ff'
  const green = '#43D845'
  const svgNs = 'http://www.w3.org/2000/svg'

  let locationTl = {}
  const mwArr = repeatArr([80, 70, 55, 65, 120, 90, 140, 110, 75, 130, 140, 55, 100, 105, 80, 130], 100)
  // console.log(mwArr)

  // function addSvgAttr(el, attr, value) {
  function addSvgAttr(el, attrArr) {
    if (!el || !attrArr) return

    attrArr.forEach((attr) => {
      const [attrName, value] = [attr[0], attr[1]]

      if (!attrName || !value) return
      el.setAttributeNS(null, attrName, value)
    })
  }
  function getTextWidth(text, font) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = font || getComputedStyle(document.body).font
    return context.measureText(text).width
  }
  function getTextHeight(text, font) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = font || getComputedStyle(document.body).font
    return context.measureText(text).actualBoundingBoxAscent + context.measureText(text).actualBoundingBoxDescent
  }
  onDomReady(() => {
    location$a.forEach((location) => {
      const state = location.dataset.map
      const mapState$ = sel('#' + state)
      const mapStateC$ = mapState$?.querySelector('.map__state-in')
      const mapStateW$ = mapState$?.querySelector('.map__state')

      /*
      // add number of the V dots
      const pinW$ = mapMarkerFill$?.parentElement
      // const pinW$ = mapState$.querySelector('.map__state__marker')
      let mapPinNum$
      if (pinW$) {
        const pinX = pinW$.getBBox().x
        const pinY = pinW$.getBBox().y
        const pinWidth = pinW$.getBBox().width
        const pinHeight = pinW$.getBBox().height
        const dotNum = mapState$.querySelectorAll('.map__pin').length || 0
        // console.log(state, dotNum)
        mapPinNum$ = document.createElementNS(svgNs, 'text')
        mapPinNum$.textContent = dotNum
        const textSize = '0.875rem'
        const textFont = 'sans-serif'
        const textWeight = 'bold'
        const textProps = textWeight + ' ' + textSize + ' ' + textFont
        const textWidth = getTextWidth(dotNum, textProps)
        const textHeight = getTextHeight(dotNum, textProps)
        const textX = pinX - textWidth / 2 + pinWidth / 2
        // + textHeight because the text is aligned to the bottom
        const textY = pinY + textHeight / 2 + pinHeight / 2
        // console.log(textHeight, pinHeight)
        addSvgAttr(mapPinNum$, [
          ['x', textX],
          ['y', textY],
          ['font-family', textFont],
          ['font-size', textSize],
          ['font-weight', textWeight],
          ['class', 'map__pin__num'],
        ])
        pinW$.appendChild(mapPinNum$)
      }
      */

      const dot$a = mapState$?.querySelectorAll('.map__pin')
      const dotBg$a = mapState$?.querySelectorAll('.map__pin__bg')
      const dotStagger = 1
      let totalMw = 0

      if (dot$a?.length > 0) {
        gsap.set(dot$a, { opacity: 0 })

        // locationTl[state].fromTo(dot$a, { fill: green }, { fill: 'white' }, 0)
        const dotTl = gsap
          .timeline({ defaults: { duration: 1.8 - dotStagger, stagger: { amount: dotStagger } }, paused: true })
          .to(dot$a, { opacity: 1 }, 0)
          .to(dotBg$a, { keyframes: { scale: [0.5, 1.5, 1] }, transformOrigin: 'center' }, 0)

        ScrollTrigger.create({
          trigger: map$,
          start: 'top 25%',
          animation: dotTl,
        })
        let dotShiftI = 0

        dot$a.forEach((dot, i) => {
          dot.style.pointerEvents = 'auto'
          const pinBb = dot.querySelector('.map__pin__bg').getBBox()
          const pinX = pinBb.x
          const pinY = pinBb.y
          const pinWidth = pinBb.width

          const text = document.createElementNS(svgNs, 'text')
          dotShiftI += i
          const textContent = mwArr[dotShiftI] + 'MW'
          totalMw += mwArr[dotShiftI]
          text.textContent = textContent
          const textSize = '1rem'
          const textFont = 'sans-serif'
          const padding = 10
          const textProps = textSize + ' ' + textFont
          const textWidth = getTextWidth(textContent, textProps)
          const textHeight = getTextHeight(textContent, textProps)
          const textX = pinX - textWidth / 2 + pinWidth / 2
          const textY = pinY - 15
          addSvgAttr(text, [
            ['x', textX],
            ['y', textY],
            ['font-family', textFont],
            ['font-size', textSize],
          ])

          const svgGroup = document.createElementNS(svgNs, 'g')
          addSvgAttr(svgGroup, [
            ['class', 'map__tooltip'],
            ['data-pin', i.toString()],
          ])

          svgGroup.appendChild(text)

          const bg = document.createElementNS(svgNs, 'rect')
          addSvgAttr(bg, [
            ['x', textX - padding],
            ['y', textY - textHeight - padding],
            ['width', textWidth + padding * 2],
            ['height', textHeight + padding * 2],
            ['fill', 'white'],
            ['rx', '5'],
          ])
          svgGroup.prepend(bg)

          const pointer = document.createElementNS(svgNs, 'path')
          const pointerWidth = 10
          addSvgAttr(pointer, [
            // "M0 0 h8 l-4 4 0 0Z"
            ['d', 'M' + (textX + textWidth / 2 - pointerWidth / 2) + ' ' + (textY + padding - 1) + ' h' + pointerWidth + ' l-' + pointerWidth / 2 + ' 5 0 0Z'],
            ['fill', 'white'],
          ])
          svgGroup.appendChild(pointer)

          mapStateC$.appendChild(svgGroup)
          const tl = gsap.timeline({ paused: true, defaults: {} }).to(svgGroup, { y: -5, opacity: 1, duration: 0.3 })
          dot.addEventListener('mouseenter', function () {
            tl.play()
          })
          dot.addEventListener('mouseleave', function () {
            tl.reverse()
          })
          // dot.onmouseenter = () => {
          //   tl.play()
          // }
          // dot.onmouseleave = () => {
          //   tl.reverse()
          // }
        })
      }

      const mapMarkerNum$ = location.querySelector('.map__mw--num')
      if (mapMarkerNum$) {
        location.querySelector('.map__mw:not(.map__mw--num)').remove()
        const suffix = totalMw >= 1000 ? 'GW' : 'MW'
        totalMw = totalMw >= 1000 ? totalMw / 1000 : totalMw
        mapMarkerNum$.textContent = totalMw + ' ' + suffix
      }

      const mapMarkerFill$ = mapState$?.querySelector('.map__state__fill')
      if (!mapMarkerFill$) return
      const mapMarkerStroke$ = mapState$?.querySelector('.map__state__stroke')

      const markerPosition = mapMarkerFill$?.getBoundingClientRect().x - mapPosition.x
      const xShift = ((markerPosition - mapWidth / 2) / mapWidth) * 50
      const yShift = -10
      // read and assign css variable to color

      if (markerPosition > mapWidth / 2) {
        location.classList.add('is--left')
      }
      location.style.left = ((markerPosition + markerRadius + xShift) / mapWidth) * 100 + '%'
      location.style.top = mapMarkerFill$?.getBoundingClientRect().y + markerRadius - mapPosition.y + yShift + 'px'

      const line$ = location.querySelector('.map__line path')
      line$.setAttribute('d', `M0 100L150 10H${location.getBoundingClientRect().width}`)
      const lineLength = line$.getTotalLength()

      // animate state on hover

      locationTl[state] = gsap
        .timeline({ defaults: { ease: 'power4.inOut', duration: 0.6 }, paused: true })
        .to(location, { opacity: 1, duration: 0.3 }, 0)
        .to(mapMarkerFill$, { fill: hoverBlue, duration: 0.3 }, 0)
        .to(mapMarkerStroke$, { stroke: hoverBlue, duration: 0.3 }, 0)
        // .to(mapPinNum$, { opacity: 0 }, 0)
        .to(
          mapStateC$,
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

      console.log(state, totalMw)
    })
  })
  // mapLocationW$.querySelector('.location__info-slider').replaceChildren(fragment)

  const mapStateW$ = selAll('.map__state-w')
  mapStateW$.forEach((mapState) => {
    mapState.addEventListener('mouseenter', function (e) {
      locationTl[this.id].play()
    })
    mapState.addEventListener('mouseleave', function (e) {
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
