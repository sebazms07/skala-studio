<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SplitText from '../components/SplitText.vue'
import KitchenScene from '../components/configurator/KitchenScene.vue'
import ConfigPanel from '../components/configurator/ConfigPanel.vue'
import { defaultConfig } from '../lib/kitchen/presets'
import { useReveal } from '../composables/useReveal'

const { t } = useI18n()
const root = ref(null)
useReveal(root)

const config = reactive(defaultConfig())

function update(patch) {
  Object.assign(config, patch)
}

function reset() {
  Object.assign(config, defaultConfig())
}

/* Resumen legible para prellenar Contacto */
const summary = computed(() =>
  [
    `${t('configurator.layout')}: ${t(`configurator.layouts.${config.layout}`)}`,
    `${t('configurator.cabinets')}: ${t(`configurator.cabinetColors.${config.cabinetColor}`)} (${t(`configurator.finishes.${config.finish}`)})`,
    `${t('configurator.countertop')}: ${t(`configurator.countertops.${config.countertop}`)}`,
    `${t('configurator.floor')}: ${t(`configurator.floors.${config.floor}`)}`,
  ].join('\n')
)
</script>

<template>
  <div ref="root" class="page">
    <header class="container page__head">
      <p class="label" data-reveal>{{ t('nav.customize') }}</p>
      <h1 class="page__title">
        <SplitText :text="t('configurator.title')" tag="span" :delay="0.2" />
      </h1>
      <p class="page__subtitle" data-reveal="0.15">{{ t('configurator.subtitle') }}</p>
    </header>

    <div class="container studio-grid" data-reveal="0.2">
      <div class="viewer">
        <KitchenScene :config="config" />
      </div>

      <aside class="controls">
        <ConfigPanel :config="config" @update="update" />
        <div class="controls__actions">
          <button type="button" class="btn btn--outline" @click="reset">
            {{ t('configurator.reset') }}
          </button>
          <RouterLink
            class="btn btn--primary"
            :to="{ path: '/contacto', query: { config: summary } }"
          >
            {{ t('configurator.quote') }}
          </RouterLink>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: 8rem;
  padding-bottom: var(--space-6);
}

.page__head {
  margin-bottom: var(--space-4);
}

.page__title {
  font-size: var(--text-3xl);
  margin-block: var(--space-2);
}

.page__subtitle {
  max-width: 52ch;
  color: var(--color-foreground-soft);
}

.studio-grid {
  display: grid;
  gap: var(--space-4);
}

.viewer {
  height: 58dvh;
  min-height: 22rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.controls__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

@media (min-width: 1024px) {
  .studio-grid {
    grid-template-columns: 1.6fr 1fr;
    align-items: start;
  }

  .viewer {
    position: sticky;
    top: 5.5rem;
    height: calc(100dvh - 7rem);
    min-height: 30rem;
  }
}
</style>
