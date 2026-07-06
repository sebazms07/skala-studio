<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  text: { type: String, required: true },
  tag: { type: String, default: 'span' },
  delay: { type: Number, default: 0 },
})

const root = ref(null)

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const chars = root.value.querySelectorAll('.st__char')
  if (reduced) {
    gsap.set(chars, { y: 0, yPercent: 0 })
    return
  }
  // fromTo: el translateY(112%) inicial viene del CSS y GSAP lo leería en px
  gsap.fromTo(
    chars,
    { yPercent: 112, y: 0 },
    {
      yPercent: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.028,
      delay: props.delay,
    }
  )
})
</script>

<template>
  <component :is="tag" ref="root" class="st" :aria-label="text">
    <span
      v-for="(word, wi) in text.split(' ')"
      :key="wi"
      class="st__word"
      aria-hidden="true"
    >
      <span v-for="(ch, ci) in word.split('')" :key="ci" class="st__mask">
        <span class="st__char">{{ ch }}</span>
      </span>
      <span v-if="wi < text.split(' ').length - 1">&nbsp;</span>
    </span>
  </component>
</template>

<style scoped>
.st__word {
  display: inline-block;
  white-space: nowrap;
}

.st__mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}

.st__char {
  display: inline-block;
  transform: translateY(112%);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .st__char {
    transform: none;
  }
}
</style>
