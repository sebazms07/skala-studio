<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createKitchenScene } from '../../composables/useKitchenScene'

const props = defineProps({
  config: { type: Object, required: true },
})

const { t } = useI18n()
const canvas = ref(null)
const failed = ref(false)
let scene = null

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  scene = createKitchenScene(canvas.value, { ...props.config }, { reduced })
  if (!scene) failed.value = true
})

watch(
  () => ({ ...props.config }),
  (c) => scene?.updateConfig(c),
  { deep: true }
)

onBeforeUnmount(() => {
  scene?.dispose()
  scene = null
})
</script>

<template>
  <div class="scene" :class="{ 'scene--night': config.night }">
    <canvas v-show="!failed" ref="canvas" class="scene__canvas"></canvas>
    <p v-if="failed" class="scene__fallback">{{ t('configurator.webglFallback') }}</p>
    <span v-if="!failed" class="scene__hint">{{ t('configurator.hint') }}</span>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 20rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #efe8dd;
  transition: background-color 0.6s ease;
}

.scene--night {
  background: #121009;
}

.scene__canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: grab;
}

.scene__canvas:active {
  cursor: grabbing;
}

.scene__hint {
  position: absolute;
  bottom: 0.9rem;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: min(90%, 30rem);
  padding: 0.35rem 1rem;
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-align: center;
  color: var(--color-foreground-soft);
  background: color-mix(in srgb, var(--color-background) 78%, transparent);
  backdrop-filter: blur(8px);
  border-radius: 999px;
  pointer-events: none;
}

.scene--night .scene__hint {
  color: var(--color-on-dark-soft);
  background: color-mix(in srgb, #121009 65%, transparent);
}

.scene__fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--space-4);
  text-align: center;
  color: var(--color-foreground-soft);
}
</style>
