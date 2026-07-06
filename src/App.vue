<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import ThePreloader from './components/ThePreloader.vue'
import { initLenis, scrollToTop } from './composables/useLenis'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const curtain = ref(null)
const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  initLenis()
  // SPA redirect from 404.html: navigate to stored path
  const redirect = sessionStorage.redirect
  if (redirect) {
    delete sessionStorage.redirect
    router.replace(redirect)
  }
})

function pageLeave(el, done) {
  if (reduced || !curtain.value) return done()
  gsap
    .timeline({ onComplete: done })
    .set(curtain.value, { transformOrigin: 'center bottom', scaleY: 0, autoAlpha: 1 })
    .to(curtain.value, { scaleY: 1, duration: 0.45, ease: 'power4.in' })
    .to(el, { autoAlpha: 0, duration: 0.25 }, 0.1)
}

function pageEnter(el, done) {
  scrollToTop(true)
  if (reduced || !curtain.value) {
    ScrollTrigger.refresh()
    return done()
  }
  gsap
    .timeline({
      onComplete: () => {
        ScrollTrigger.refresh()
        done()
      },
    })
    .set(curtain.value, { transformOrigin: 'center top' })
    .fromTo(
      el,
      { autoAlpha: 0, y: 26 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      0.2
    )
    .to(curtain.value, { scaleY: 0, duration: 0.65, ease: 'power4.inOut' }, 0)
}
</script>

<template>
  <ThePreloader />
  <TheNavbar />
  <div ref="curtain" class="page-curtain" aria-hidden="true"></div>
  <main>
    <RouterView v-slot="{ Component }">
      <Transition mode="out-in" :css="false" @leave="pageLeave" @enter="pageEnter">
        <component :is="Component" :key="$route.path" />
      </Transition>
    </RouterView>
  </main>
  <TheFooter />
</template>

<style scoped>
.page-curtain {
  position: fixed;
  inset: 0;
  z-index: var(--z-transition);
  background: var(--color-primary);
  transform: scaleY(0);
  visibility: hidden;
  pointer-events: none;
}
</style>
