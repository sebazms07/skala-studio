<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/** Spotlight que sigue el cursor con suavizado (lerp). Solo desktop con hover. */
const el = ref(null)
const enabled = ref(false)

let rafId = 0
let target = { x: 0, y: 0 }
let pos = { x: 0, y: 0 }
let onMove = null

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (reduced || !canHover) return

  enabled.value = true
  const parent = el.value.parentElement
  target = pos = { x: parent.clientWidth * 0.7, y: parent.clientHeight * 0.35 }

  onMove = (e) => {
    const rect = parent.getBoundingClientRect()
    target = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  parent.addEventListener('pointermove', onMove, { passive: true })

  function frame() {
    pos = {
      x: pos.x + (target.x - pos.x) * 0.07,
      y: pos.y + (target.y - pos.y) * 0.07,
    }
    if (el.value) {
      el.value.style.background = `radial-gradient(38rem circle at ${pos.x}px ${pos.y}px, rgba(255, 250, 240, 0.5), transparent 65%)`
    }
    rafId = requestAnimationFrame(frame)
  }
  rafId = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  if (onMove) el.value?.parentElement?.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <div v-show="enabled" ref="el" class="spotlight" aria-hidden="true"></div>
</template>

<style scoped>
.spotlight {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  mix-blend-mode: soft-light;
}
</style>
