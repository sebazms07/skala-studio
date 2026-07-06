<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { motion } from 'motion-v'
import AuroraShader from '../components/hero/AuroraShader.vue'
import GoldParticles from '../components/hero/GoldParticles.vue'
import HeroSpotlight from '../components/hero/HeroSpotlight.vue'
import SplitText from '../components/SplitText.vue'
import MarqueeText from '../components/MarqueeText.vue'
import ProjectCard from '../components/ProjectCard.vue'
import { projects } from '../data/projects'
import { useReveal } from '../composables/useReveal'

const { t } = useI18n()
const root = ref(null)
useReveal(root)

const featured = projects.slice(0, 4)
const services = ['interior', 'architecture', 'furniture']
</script>

<template>
  <div ref="root">
    <!-- HERO: aurora shader + partículas + spotlight + grain (21st.dev → Vue) -->
    <section class="hero grain">
      <AuroraShader />
      <GoldParticles />
      <HeroSpotlight />

      <div class="container hero__content">
        <motion.p
          class="label hero__kicker"
          :initial="{ opacity: 0, y: 16 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7, delay: 0.3, ease: 'easeOut' }"
        >
          {{ t('hero.kicker') }}
        </motion.p>

        <h1 class="hero__title">
          <SplitText :text="t('hero.title1')" tag="span" class="hero__line" :delay="0.45" />
          <SplitText
            :text="t('hero.title2')"
            tag="span"
            class="hero__line hero__line--italic"
            :delay="0.6"
          />
          <SplitText :text="t('hero.title3')" tag="span" class="hero__line" :delay="0.75" />
        </h1>

        <motion.p
          class="hero__subtitle"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7, delay: 1.05, ease: 'easeOut' }"
        >
          {{ t('hero.subtitle') }}
        </motion.p>

        <motion.div
          class="hero__actions"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.7, delay: 1.2, ease: 'easeOut' }"
        >
          <RouterLink to="/proyectos" class="btn btn--primary">{{ t('hero.cta') }}</RouterLink>
          <RouterLink to="/contacto" class="btn btn--outline">{{ t('hero.cta2') }}</RouterLink>
        </motion.div>
      </div>

      <motion.span
        class="hero__scroll"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ delay: 1.8, duration: 0.8 }"
      >
        {{ t('hero.scroll') }}
      </motion.span>
    </section>

    <!-- INTRO -->
    <section class="section">
      <div class="container intro">
        <div class="intro__text">
          <p class="label" data-reveal>{{ t('home.introLabel') }}</p>
          <h2 class="intro__title" data-reveal="0.05">{{ t('home.introTitle') }}</h2>
          <p class="intro__body" data-reveal="0.1">{{ t('home.introText') }}</p>
          <RouterLink to="/estudio" class="link-line intro__link" data-reveal="0.15">
            {{ t('home.introLink') }} →
          </RouterLink>
        </div>
        <div class="intro__media img-frame" data-clip>
          <img
            src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=80"
            :alt="t('home.introTitle')"
            loading="lazy"
            data-parallax="8"
          />
        </div>
      </div>
    </section>

    <!-- SERVICIOS -->
    <section class="section section--dark">
      <div class="container">
        <p class="label" data-reveal>{{ t('home.servicesLabel') }}</p>
        <h2 class="section__title" data-reveal="0.05">{{ t('home.servicesTitle') }}</h2>

        <div class="services">
          <RouterLink
            v-for="(s, i) in services"
            :key="s"
            to="/servicios"
            class="service"
            :data-reveal="0.1 + i * 0.08"
          >
            <span class="service__num">0{{ i + 1 }}</span>
            <h3 class="service__name">{{ t(`services.${s}.name`) }}</h3>
            <p class="service__desc">{{ t(`services.${s}.desc`) }}</p>
            <span class="link-line service__more">{{ t('nav.services') }} →</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- PROYECTOS DESTACADOS -->
    <section class="section">
      <div class="container">
        <div class="featured__head">
          <div>
            <p class="label" data-reveal>{{ t('home.featuredLabel') }}</p>
            <h2 class="section__title" data-reveal="0.05">{{ t('home.featuredTitle') }}</h2>
          </div>
          <RouterLink to="/proyectos" class="link-line" data-reveal="0.1">
            {{ t('home.featuredLink') }} →
          </RouterLink>
        </div>

        <div class="featured__grid">
          <ProjectCard
            v-for="(p, i) in featured"
            :key="p.slug"
            :project="p"
            :index="i"
            :class="{ 'featured__offset': i % 2 === 1 }"
          />
        </div>
      </div>
    </section>

    <MarqueeText :text="t('home.marquee')" />

    <!-- CTA -->
    <section class="section section--dark cta">
      <div class="container cta__inner">
        <h2 class="cta__title" data-reveal>{{ t('home.ctaTitle') }}</h2>
        <p class="cta__text" data-reveal="0.05">{{ t('home.ctaText') }}</p>
        <div data-reveal="0.1">
          <RouterLink to="/contacto" class="btn btn--primary">{{ t('home.ctaButton') }}</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ---------- Hero ---------- */
.hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.hero__content {
  position: relative;
  z-index: 4;
  padding-top: 4.5rem;
}

.hero__kicker {
  margin-bottom: var(--space-3);
}

.hero__title {
  font-size: var(--text-hero);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.hero__line {
  display: block;
}

.hero__line--italic {
  font-style: italic;
  color: var(--color-primary-dark);
}

.hero__subtitle {
  max-width: 34rem;
  margin-top: var(--space-3);
  font-size: var(--text-lg);
  color: var(--color-foreground-soft);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.hero__scroll {
  position: absolute;
  bottom: var(--space-3);
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  font-size: var(--text-xs);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-foreground-soft);
}

/* ---------- Intro ---------- */
.intro {
  display: grid;
  gap: var(--space-5);
  align-items: center;
}

.intro__title {
  font-size: var(--text-2xl);
  margin-block: var(--space-2) var(--space-3);
  max-width: 18ch;
}

.intro__body {
  max-width: 46ch;
  color: var(--color-foreground-soft);
  margin-bottom: var(--space-3);
}

.intro__link {
  font-size: var(--text-sm);
  font-weight: 500;
}

.intro__media {
  aspect-ratio: 4 / 5;
}

.intro__media img {
  scale: 1.15;
}

/* ---------- Services ---------- */
.section__title {
  font-size: var(--text-2xl);
  margin-block: var(--space-2) var(--space-5);
  max-width: 22ch;
}

.services {
  display: grid;
  gap: var(--space-4);
}

.service {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid color-mix(in srgb, var(--color-on-dark) 18%, transparent);
}

.service__num {
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  color: var(--color-primary);
}

.service__name {
  font-size: var(--text-xl);
}

.service__desc {
  font-size: var(--text-sm);
  color: var(--color-on-dark-soft);
  max-width: 40ch;
}

.service__more {
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-top: auto;
}

/* ---------- Featured ---------- */
.featured__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.featured__head .section__title {
  margin-bottom: 0;
}

.featured__grid {
  display: grid;
  gap: var(--space-5);
}

/* ---------- CTA ---------- */
.cta__inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.cta__title {
  font-size: var(--text-3xl);
  max-width: 16ch;
}

.cta__text {
  color: var(--color-on-dark-soft);
}

/* ---------- Responsive ---------- */
@media (min-width: 900px) {
  .intro {
    grid-template-columns: 1.1fr 1fr;
  }

  .services {
    grid-template-columns: repeat(3, 1fr);
  }

  .featured__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5) var(--space-6);
  }

  .featured__offset {
    transform: translateY(var(--space-6));
  }

  .featured__grid {
    padding-bottom: var(--space-6);
  }
}
</style>
