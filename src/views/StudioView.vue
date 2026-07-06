<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SplitText from '../components/SplitText.vue'
import { useReveal } from '../composables/useReveal'

const { t, tm, rt } = useI18n()
const root = ref(null)
useReveal(root)

const stats = [
  { value: '48+', key: 'studio.statsProjects' },
  { value: '8', key: 'studio.statsYears' },
  { value: '5', key: 'studio.statsCities' },
]
</script>

<template>
  <div ref="root" class="page">
    <header class="container page__head">
      <p class="label" data-reveal>{{ t('nav.studio') }}</p>
      <h1 class="statement">
        <SplitText :text="t('studio.heroText')" tag="span" :delay="0.2" />
      </h1>
    </header>

    <div class="container">
      <div class="media img-frame" data-clip>
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80"
          :alt="t('studio.title')"
          data-parallax="8"
        />
      </div>
    </div>

    <section class="container philosophy">
      <div>
        <p class="label" data-reveal>{{ t('studio.philosophyLabel') }}</p>
        <h2 class="philosophy__title" data-reveal="0.05">{{ t('studio.philosophyTitle') }}</h2>
      </div>
      <p class="philosophy__text" data-reveal="0.1">{{ t('studio.philosophyText') }}</p>
    </section>

    <section class="section section--dark">
      <div class="container">
        <ul class="values">
          <li
            v-for="(v, i) in tm('studio.values')"
            :key="i"
            class="values__item"
            :data-reveal="i * 0.07"
          >
            <span class="values__num">0{{ i + 1 }}</span>
            <h3>{{ rt(v.name) }}</h3>
            <p>{{ rt(v.desc) }}</p>
          </li>
        </ul>

        <dl class="stats">
          <div v-for="s in stats" :key="s.key" class="stats__item" data-reveal>
            <dd>{{ s.value }}</dd>
            <dt>{{ t(s.key) }}</dt>
          </div>
        </dl>
      </div>
    </section>

    <section class="section">
      <div class="container cta">
        <h2 class="cta__title" data-reveal>{{ t('home.ctaTitle') }}</h2>
        <div data-reveal="0.05">
          <RouterLink to="/contacto" class="btn btn--primary">{{ t('home.ctaButton') }}</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page {
  padding-top: 8rem;
}

.page__head {
  margin-bottom: var(--space-5);
}

.statement {
  font-size: var(--text-2xl);
  font-weight: 500;
  max-width: 28ch;
  margin-top: var(--space-3);
}

.media {
  aspect-ratio: 16 / 8;
}

.media img {
  scale: 1.12;
}

.philosophy {
  display: grid;
  gap: var(--space-4);
  padding-block: var(--space-6);
}

.philosophy__title {
  font-size: var(--text-2xl);
  margin-top: var(--space-2);
  max-width: 16ch;
}

.philosophy__text {
  font-size: var(--text-lg);
  color: var(--color-foreground-soft);
  max-width: 52ch;
}

.values {
  list-style: none;
  display: grid;
  gap: var(--space-4);
}

.values__num {
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  color: var(--color-primary);
}

.values__item {
  padding-top: var(--space-3);
  border-top: 1px solid color-mix(in srgb, var(--color-on-dark) 18%, transparent);
}

.values__item h3 {
  font-size: var(--text-xl);
  margin-block: var(--space-1);
}

.values__item p {
  font-size: var(--text-sm);
  color: var(--color-on-dark-soft);
  max-width: 36ch;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.stats__item dd {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  color: var(--color-primary);
}

.stats__item dt {
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-on-dark-soft);
  margin-top: 0.4rem;
}

.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
}

.cta__title {
  font-size: var(--text-3xl);
  max-width: 16ch;
}

@media (min-width: 900px) {
  .philosophy {
    grid-template-columns: 1fr 1.2fr;
  }

  .values {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5);
  }
}
</style>
