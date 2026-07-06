<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCard from '../components/ProjectCard.vue'
import { projects } from '../data/projects'
import { useReveal } from '../composables/useReveal'

const { t } = useI18n()
const root = ref(null)
useReveal(root)

const filters = ['all', 'architecture', 'interior', 'commercial']
const active = ref('all')

const filtered = computed(() =>
  active.value === 'all' ? projects : projects.filter((p) => p.category === active.value)
)

function filterLabel(f) {
  return f === 'all' ? t('projects.all') : t(`projects.categories.${f}`)
}
</script>

<template>
  <div ref="root" class="page">
    <header class="container page__head">
      <p class="label" data-reveal>{{ t('nav.projects') }}</p>
      <h1 class="page__title" data-reveal="0.05">{{ t('projects.title') }}</h1>
      <p class="page__subtitle" data-reveal="0.1">{{ t('projects.subtitle') }}</p>

      <div class="filters" data-reveal="0.15" role="group" :aria-label="t('projects.title')">
        <button
          v-for="f in filters"
          :key="f"
          class="filters__btn"
          :class="{ 'is-active': active === f }"
          @click="active = f"
        >
          {{ filterLabel(f) }}
        </button>
      </div>
    </header>

    <div class="container">
      <div :key="active" class="grid">
        <ProjectCard
          v-for="(p, i) in filtered"
          :key="p.slug"
          :project="p"
          :index="i"
          :class="{ 'grid__offset': i % 2 === 1 }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: 8rem;
  padding-bottom: var(--space-7);
}

.page__head {
  margin-bottom: var(--space-5);
}

.page__title {
  font-size: var(--text-3xl);
  margin-block: var(--space-2);
}

.page__subtitle {
  max-width: 44ch;
  color: var(--color-foreground-soft);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: var(--space-4);
}

.filters__btn {
  min-height: 2.75rem;
  padding: 0.55rem 1.4rem;
  font-size: var(--text-sm);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-foreground-soft);
  transition:
    background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.filters__btn:hover {
  border-color: var(--color-foreground);
  color: var(--color-foreground);
}

.filters__btn.is-active {
  background: var(--color-foreground);
  border-color: var(--color-foreground);
  color: var(--color-on-dark);
}

.grid {
  display: grid;
  gap: var(--space-5);
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5) var(--space-6);
    padding-bottom: var(--space-6);
  }

  .grid__offset {
    transform: translateY(var(--space-6));
  }
}
</style>
