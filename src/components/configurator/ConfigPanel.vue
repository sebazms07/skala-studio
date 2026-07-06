<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { motion } from 'motion-v'
import {
  layouts,
  cabinetColors,
  finishes,
  countertops,
  floors,
} from '../../lib/kitchen/presets'
import { textureThumb, counterThumbDraw, floorThumbDraw } from '../../lib/kitchen/materials'

const props = defineProps({
  config: { type: Object, required: true },
})
const emit = defineEmits(['update'])

const { t } = useI18n()

const set = (patch) => emit('update', patch)

/* miniaturas procedurales (se generan una sola vez) */
const counterThumbs = computed(() =>
  Object.fromEntries(countertops.map((id) => [id, textureThumb(counterThumbDraw(id))]))
)
const floorThumbs = computed(() =>
  Object.fromEntries(floors.map((id) => [id, textureThumb(floorThumbDraw(id))]))
)

/* mini-iconos de distribución */
const layoutIcons = {
  linear: 'M4 18 h16',
  l: 'M4 6 v12 h16',
  u: 'M4 6 v12 h16 v-12',
  island: 'M4 6 h16 M9 15 h6',
}
</script>

<template>
  <div class="panel">
    <!-- Distribución -->
    <section class="panel__section">
      <h3 class="label panel__label">{{ t('configurator.layout') }}</h3>
      <div class="seg" role="radiogroup" :aria-label="t('configurator.layout')">
        <motion.button
          v-for="id in layouts"
          :key="id"
          type="button"
          role="radio"
          class="seg__btn"
          :class="{ 'is-active': config.layout === id }"
          :aria-checked="config.layout === id"
          :while-press="{ scale: 0.95 }"
          @click="set({ layout: id })"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
            <path :d="layoutIcons[id]" />
          </svg>
          <span>{{ t(`configurator.layouts.${id}`) }}</span>
        </motion.button>
      </div>
    </section>

    <!-- Gabinetes -->
    <section class="panel__section">
      <h3 class="label panel__label">{{ t('configurator.cabinets') }}</h3>
      <div class="swatches" role="radiogroup" :aria-label="t('configurator.cabinets')">
        <motion.button
          v-for="c in cabinetColors"
          :key="c.id"
          type="button"
          role="radio"
          class="swatch"
          :class="{ 'is-active': config.cabinetColor === c.id }"
          :aria-checked="config.cabinetColor === c.id"
          :aria-label="t(`configurator.cabinetColors.${c.id}`)"
          :title="t(`configurator.cabinetColors.${c.id}`)"
          :style="{ backgroundColor: c.hex }"
          :while-press="{ scale: 0.9 }"
          @click="set({ cabinetColor: c.id })"
        />
      </div>
      <div class="seg seg--small" role="radiogroup" :aria-label="t('configurator.finish')">
        <button
          v-for="f in finishes"
          :key="f"
          type="button"
          role="radio"
          class="seg__btn seg__btn--text"
          :class="{ 'is-active': config.finish === f }"
          :aria-checked="config.finish === f"
          @click="set({ finish: f })"
        >
          {{ t(`configurator.finishes.${f}`) }}
        </button>
      </div>
    </section>

    <!-- Encimera -->
    <section class="panel__section">
      <h3 class="label panel__label">{{ t('configurator.countertop') }}</h3>
      <div class="thumbs" role="radiogroup" :aria-label="t('configurator.countertop')">
        <motion.button
          v-for="id in countertops"
          :key="id"
          type="button"
          role="radio"
          class="thumb"
          :class="{ 'is-active': config.countertop === id }"
          :aria-checked="config.countertop === id"
          :while-press="{ scale: 0.94 }"
          @click="set({ countertop: id })"
        >
          <img :src="counterThumbs[id]" alt="" />
          <span>{{ t(`configurator.countertops.${id}`) }}</span>
        </motion.button>
      </div>
    </section>

    <!-- Piso -->
    <section class="panel__section">
      <h3 class="label panel__label">{{ t('configurator.floor') }}</h3>
      <div class="thumbs" role="radiogroup" :aria-label="t('configurator.floor')">
        <motion.button
          v-for="id in floors"
          :key="id"
          type="button"
          role="radio"
          class="thumb"
          :class="{ 'is-active': config.floor === id }"
          :aria-checked="config.floor === id"
          :while-press="{ scale: 0.94 }"
          @click="set({ floor: id })"
        >
          <img :src="floorThumbs[id]" alt="" />
          <span>{{ t(`configurator.floors.${id}`) }}</span>
        </motion.button>
      </div>
    </section>

    <!-- Iluminación -->
    <section class="panel__section">
      <h3 class="label panel__label">{{ t('configurator.lighting') }}</h3>

      <div class="slider">
        <label for="cfg-temp">{{ t('configurator.temperature') }}</label>
        <div class="slider__row">
          <span class="slider__end">{{ t('configurator.warm') }}</span>
          <input
            id="cfg-temp"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="config.temperature"
            @input="set({ temperature: +$event.target.value })"
          />
          <span class="slider__end">{{ t('configurator.cool') }}</span>
        </div>
      </div>

      <div class="slider">
        <label for="cfg-int">{{ t('configurator.intensity') }}</label>
        <input
          id="cfg-int"
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="config.intensity"
          @input="set({ intensity: +$event.target.value })"
        />
      </div>

      <div class="toggles">
        <label class="toggle">
          <input
            type="checkbox"
            :checked="config.night"
            @change="set({ night: $event.target.checked })"
          />
          <span class="toggle__track" aria-hidden="true"></span>
          {{ t('configurator.night') }}
        </label>
        <label class="toggle">
          <input
            type="checkbox"
            :checked="config.led"
            @change="set({ led: $event.target.checked })"
          />
          <span class="toggle__track" aria-hidden="true"></span>
          {{ t('configurator.led') }}
        </label>
      </div>
    </section>
  </div>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.panel__section {
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.panel__section:first-child {
  border-top: none;
  padding-top: 0;
}

/* Segmented (distribución / acabado) */
.seg {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.seg--small {
  grid-template-columns: repeat(2, minmax(0, 8rem));
}

.seg__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  min-height: 3rem;
  padding: 0.7rem 0.5rem;
  font-size: var(--text-xs);
  letter-spacing: 0.04em;
  color: var(--color-foreground-soft);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: var(--color-surface);
  transition:
    border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.seg__btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.seg__btn--text {
  flex-direction: row;
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
}

.seg__btn:hover {
  border-color: var(--color-primary);
  color: var(--color-foreground);
}

.seg__btn.is-active {
  border-color: var(--color-foreground);
  background: var(--color-foreground);
  color: var(--color-on-dark);
}

/* Swatches de color */
.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.swatch {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 12%, transparent);
  cursor: pointer;
  transition: box-shadow var(--dur-fast) var(--ease-out);
}

.swatch.is-active {
  box-shadow:
    0 0 0 3px var(--color-background),
    0 0 0 5px var(--color-accent);
}

/* Miniaturas de textura */
.thumbs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5.2rem, 1fr));
  gap: 0.6rem;
}

.thumb {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.35rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: var(--color-surface);
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  color: var(--color-foreground-soft);
  transition: border-color var(--dur-fast) var(--ease-out);
}

.thumb img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 0.3rem;
}

.thumb:hover {
  border-color: var(--color-primary);
}

.thumb.is-active {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
  color: var(--color-foreground);
}

/* Sliders */
.slider {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.slider label {
  font-size: var(--text-sm);
  font-weight: 500;
}

.slider__row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.slider__end {
  font-size: var(--text-xs);
  color: var(--color-foreground-soft);
  white-space: nowrap;
}

input[type='range'] {
  flex: 1;
  width: 100%;
  height: 2.75rem;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type='range']::-webkit-slider-runnable-track {
  height: 3px;
  background: var(--color-border);
  border-radius: 2px;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1.15rem;
  height: 1.15rem;
  margin-top: -0.5rem;
  border-radius: 50%;
  background: var(--color-primary-dark);
  border: 2px solid var(--color-background);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
}

input[type='range']::-moz-range-track {
  height: 3px;
  background: var(--color-border);
  border-radius: 2px;
}

input[type='range']::-moz-range-thumb {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  background: var(--color-primary-dark);
  border: 2px solid var(--color-background);
}

/* Toggles */
.toggles {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.75rem;
  font-size: var(--text-sm);
  cursor: pointer;
  user-select: none;
}

.toggle input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.toggle__track {
  position: relative;
  width: 2.6rem;
  height: 1.45rem;
  border-radius: 999px;
  background: var(--color-border);
  transition: background-color var(--dur-fast) var(--ease-out);
  flex-shrink: 0;
}

.toggle__track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 1.05rem;
  height: 1.05rem;
  border-radius: 50%;
  background: var(--color-surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform var(--dur-fast) var(--ease-out);
}

.toggle input:checked + .toggle__track {
  background: var(--color-primary-dark);
}

.toggle input:checked + .toggle__track::after {
  transform: translateX(1.15rem);
}

.toggle input:focus-visible + .toggle__track {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@media (min-width: 900px) {
  .seg {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
