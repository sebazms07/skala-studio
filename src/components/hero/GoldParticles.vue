<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/** Partículas doradas flotantes (canvas 2D, estilo Sparkles de 21st.dev). */
const props = defineProps({
  density: { type: Number, default: 36 },
})

const canvas = ref(null)
let ctx = null
let rafId = 0
let running = false
let particles = []
let observer = null
let onResize = null
let w = 0
let h = 0
let dpr = 1

function spawn() {
  const isMobile = window.innerWidth < 768
  const count = isMobile ? Math.round(props.density / 2) : props.density
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.6 + Math.random() * 1.8,
    vy: 0.08 + Math.random() * 0.25,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.002 + Math.random() * 0.006,
    alpha: 0.15 + Math.random() * 0.45,
  }))
}

function frame() {
  if (!running) return
  ctx.clearRect(0, 0, w, h)
  for (const p of particles) {
    p.y -= p.vy
    p.sway += p.swaySpeed
    const x = p.x + Math.sin(p.sway) * 14
    if (p.y < -6) {
      p.y = h + 6
      p.x = Math.random() * w
    }
    ctx.beginPath()
    ctx.arc(x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(216, 201, 174, ${p.alpha})`
    ctx.fill()
  }
  rafId = requestAnimationFrame(frame)
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  ctx = canvas.value.getContext('2d')

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = canvas.value.clientWidth
    h = canvas.value.clientHeight
    canvas.value.width = w * dpr
    canvas.value.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    spawn()
  }

  resize()
  onResize = resize
  window.addEventListener('resize', onResize, { passive: true })

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) {
      running = true
      rafId = requestAnimationFrame(frame)
    } else if (!entry.isIntersecting) {
      running = false
      cancelAnimationFrame(rafId)
    }
  })
  observer.observe(canvas.value)
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(rafId)
  observer?.disconnect()
  if (onResize) window.removeEventListener('resize', onResize)
})
</script>

<template>
  <canvas ref="canvas" class="particles" aria-hidden="true"></canvas>
</template>

<style scoped>
.particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}
</style>
