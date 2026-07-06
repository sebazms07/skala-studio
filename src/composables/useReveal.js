import { onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll reveals for a view. Marca elementos con:
 *   data-reveal        → fade-up (valor opcional = delay en s)
 *   data-clip          → imagen con clip-path reveal
 *   data-parallax      → parallax sutil (valor = intensidad yPercent, default 10)
 * Se limpia solo al desmontar la vista (gsap.context).
 */
export function useReveal(rootRef) {
  let ctx

  onMounted(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scope = rootRef?.value ?? document

    ctx = gsap.context(() => {
      if (reduced) return

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: parseFloat(el.dataset.reveal) || 0,
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        )
      })

      gsap.utils.toArray('[data-clip]').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(14% 8% 14% 8%)', scale: 1.08 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: 1.3,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%' },
          }
        )
      })

      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 10
        gsap.fromTo(
          el,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })
    }, scope)

    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  onBeforeUnmount(() => ctx?.revert())
}
