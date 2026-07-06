<script setup>
defineProps({
  text: { type: String, required: true },
})
</script>

<template>
  <div class="marquee" aria-hidden="true">
    <div class="marquee__track">
      <span v-for="n in 4" :key="n" class="marquee__item">{{ text }}&nbsp;</span>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  white-space: nowrap;
  padding-block: var(--space-4);
  border-block: 1px solid var(--color-border);
}

.marquee__track {
  display: inline-flex;
  animation: marquee-scroll 28s linear infinite;
  will-change: transform;
}

.marquee__item {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-style: italic;
  color: var(--color-primary);
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee__track {
    animation: none;
  }
}
</style>
