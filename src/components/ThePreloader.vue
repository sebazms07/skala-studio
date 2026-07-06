<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { stopScroll, startScroll } from '../composables/useLenis'
import logo from '../assets/logo.png'

const show = ref(!sessionStorage.getItem('skala-preloaded'))
const root = ref(null)
const mark = ref(null)

onMounted(() => {
  if (!show.value) return
  sessionStorage.setItem('skala-preloaded', '1')

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    show.value = false
    return
  }

  stopScroll()
  gsap
    .timeline({
      onComplete: () => {
        show.value = false
        startScroll()
      },
    })
    .fromTo(
      mark.value,
      { autoAlpha: 0, scale: 0.85 },
      { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
    )
    .to(mark.value, { autoAlpha: 0, y: -24, duration: 0.45, ease: 'power2.in' }, '+=0.5')
    .to(root.value, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '-=0.15')
})
</script>

<template>
  <div v-if="show" ref="root" class="preloader" aria-hidden="true">
    <img ref="mark" :src="logo" alt="" class="preloader__mark" width="96" height="96" />
  </div>
</template>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: var(--z-preloader);
  display: grid;
  place-items: center;
  background: var(--color-primary);
}

.preloader__mark {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  visibility: hidden;
}
</style>
