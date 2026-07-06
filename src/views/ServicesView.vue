<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReveal } from '../composables/useReveal'

const { t, tm, rt } = useI18n()
const root = ref(null)
useReveal(root)

const services = [
  {
    key: 'interior',
    img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80',
  },
  {
    key: 'architecture',
    img: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80',
  },
  {
    key: 'furniture',
    img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1400&q=80',
  },
]
</script>

<template>
  <div ref="root" class="page">
    <header class="container page__head">
      <p class="label" data-reveal>{{ t('nav.services') }}</p>
      <h1 class="page__title" data-reveal="0.05">{{ t('services.title') }}</h1>
      <p class="page__subtitle" data-reveal="0.1">{{ t('services.subtitle') }}</p>
    </header>

    <section
      v-for="(s, i) in services"
      :key="s.key"
      class="container service"
      :class="{ 'service--flip': i % 2 === 1 }"
    >
      <div class="service__media img-frame" data-clip>
        <img :src="s.img" :alt="t(`services.${s.key}.name`)" loading="lazy" data-parallax="6" />
      </div>
      <div class="service__text">
        <span class="service__num" data-reveal>0{{ i + 1 }}</span>
        <h2 class="service__name" data-reveal="0.05">{{ t(`services.${s.key}.name`) }}</h2>
        <p class="service__desc" data-reveal="0.1">{{ t(`services.${s.key}.desc`) }}</p>
        <ul class="service__points" data-reveal="0.15">
          <li v-for="p in tm(`services.${s.key}.points`)" :key="rt(p)">{{ rt(p) }}</li>
        </ul>
      </div>
    </section>

    <section class="section section--dark process">
      <div class="container">
        <p class="label" data-reveal>{{ t('services.processLabel') }}</p>
        <h2 class="process__title" data-reveal="0.05">{{ t('services.processTitle') }}</h2>

        <ol class="process__grid">
          <li
            v-for="(step, i) in tm('services.process')"
            :key="i"
            class="process__step"
            :data-reveal="0.1 + i * 0.07"
          >
            <span class="service__num">0{{ i + 1 }}</span>
            <h3>{{ rt(step.name) }}</h3>
            <p>{{ rt(step.desc) }}</p>
          </li>
        </ol>

        <div class="process__cta" data-reveal>
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
  margin-bottom: var(--space-6);
}

.page__title {
  font-size: var(--text-3xl);
  margin-block: var(--space-2);
}

.page__subtitle {
  max-width: 44ch;
  color: var(--color-foreground-soft);
}

.service {
  display: grid;
  gap: var(--space-4);
  align-items: center;
  padding-bottom: var(--space-6);
}

.service__media {
  aspect-ratio: 4 / 3;
}

.service__media img {
  scale: 1.12;
}

.service__num {
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  color: var(--color-accent);
}

.service__name {
  font-size: var(--text-2xl);
  margin-block: var(--space-2);
}

.service__desc {
  color: var(--color-foreground-soft);
  max-width: 46ch;
  margin-bottom: var(--space-3);
}

.service__points {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  font-size: var(--text-sm);
}

.service__points li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.service__points li::before {
  content: '';
  width: 1.25rem;
  height: 1px;
  background: var(--color-primary);
  flex-shrink: 0;
}

.process__title {
  font-size: var(--text-2xl);
  margin-block: var(--space-2) var(--space-5);
}

.process__grid {
  list-style: none;
  display: grid;
  gap: var(--space-4);
}

.process__step {
  padding-top: var(--space-3);
  border-top: 1px solid color-mix(in srgb, var(--color-on-dark) 18%, transparent);
}

.process__step h3 {
  font-size: var(--text-xl);
  margin-block: var(--space-1) var(--space-1);
}

.process__step p {
  font-size: var(--text-sm);
  color: var(--color-on-dark-soft);
}

.process__step .service__num {
  color: var(--color-primary);
}

.process__cta {
  margin-top: var(--space-5);
}

@media (min-width: 900px) {
  .service {
    grid-template-columns: 1.1fr 1fr;
  }

  .service--flip .service__media {
    order: 2;
  }

  .process__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
