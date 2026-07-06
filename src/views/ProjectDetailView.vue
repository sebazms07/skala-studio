<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import SplitText from '../components/SplitText.vue'
import { getProject, getAdjacent } from '../data/projects'
import { useReveal } from '../composables/useReveal'

const props = defineProps({ slug: { type: String, required: true } })

const { t, locale } = useI18n()
const router = useRouter()
const root = ref(null)
useReveal(root)

const project = computed(() => getProject(props.slug))
const adjacent = computed(() => getAdjacent(props.slug))

if (!getProject(props.slug)) {
  router.replace('/proyectos')
}
</script>

<template>
  <div v-if="project" ref="root" class="page">
    <header class="container">
      <RouterLink to="/proyectos" class="link-line back" data-reveal>
        ← {{ t('projects.detail.back') }}
      </RouterLink>
      <h1 class="title">
        <SplitText :text="project.name" tag="span" :delay="0.2" />
      </h1>
    </header>

    <div class="container">
      <div class="cover img-frame" data-clip>
        <img :src="project.cover" :alt="project.name" data-parallax="7" />
      </div>
    </div>

    <div class="container body">
      <dl class="meta" data-reveal>
        <div>
          <dt>{{ t('projects.detail.year') }}</dt>
          <dd>{{ project.year }}</dd>
        </div>
        <div>
          <dt>{{ t('projects.detail.location') }}</dt>
          <dd>{{ project.location }}</dd>
        </div>
        <div>
          <dt>{{ t('projects.detail.category') }}</dt>
          <dd>{{ t(`projects.categories.${project.category}`) }}</dd>
        </div>
        <div>
          <dt>{{ t('projects.detail.area') }}</dt>
          <dd>{{ project.area }}</dd>
        </div>
      </dl>

      <p class="desc" data-reveal="0.1">{{ project.desc[locale] || project.desc.es }}</p>
    </div>

    <div class="container gallery">
      <div v-for="(img, i) in project.gallery" :key="img" class="img-frame gallery__item" data-clip>
        <img :src="img" :alt="`${project.name} — ${i + 1}`" loading="lazy" />
      </div>
    </div>

    <nav class="container pager" aria-label="Proyectos">
      <RouterLink
        v-if="adjacent.prev"
        :to="`/proyectos/${adjacent.prev.slug}`"
        class="pager__link"
      >
        <span class="label">{{ t('projects.detail.prev') }}</span>
        <span class="pager__name">{{ adjacent.prev.name }}</span>
      </RouterLink>
      <RouterLink
        v-if="adjacent.next"
        :to="`/proyectos/${adjacent.next.slug}`"
        class="pager__link pager__link--next"
      >
        <span class="label">{{ t('projects.detail.next') }}</span>
        <span class="pager__name">{{ adjacent.next.name }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.page {
  padding-top: 8rem;
}

.back {
  font-size: var(--text-sm);
  color: var(--color-foreground-soft);
}

.title {
  font-size: var(--text-hero);
  margin-block: var(--space-3) var(--space-4);
}

.cover {
  aspect-ratio: 16 / 9;
}

.cover img {
  scale: 1.12;
}

.body {
  display: grid;
  gap: var(--space-4);
  padding-block: var(--space-5);
}

.meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  align-content: start;
}

.meta dt {
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-foreground-soft);
  margin-bottom: 0.35rem;
}

.meta dd {
  font-family: var(--font-display);
  font-size: var(--text-lg);
}

.desc {
  font-size: var(--text-xl);
  font-family: var(--font-display);
  line-height: 1.5;
  max-width: 30ch;
}

.gallery {
  display: grid;
  gap: var(--space-4);
  padding-bottom: var(--space-6);
}

.gallery__item {
  aspect-ratio: 4 / 3;
}

.gallery__item:first-child {
  aspect-ratio: 16 / 10;
}

.pager {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding-block: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border);
}

.pager__link {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.pager__link--next {
  text-align: right;
  align-items: flex-end;
  margin-left: auto;
}

.pager__name {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  transition: color var(--dur-fast) var(--ease-out);
}

.pager__link:hover .pager__name {
  color: var(--color-accent);
}

@media (min-width: 900px) {
  .body {
    grid-template-columns: 1fr 1.2fr;
  }

  .gallery {
    grid-template-columns: repeat(2, 1fr);
  }

  .gallery__item:first-child {
    grid-column: 1 / -1;
  }
}
</style>
