<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { motion, AnimatePresence } from 'motion-v'
import { stopScroll, startScroll } from '../composables/useLenis'
import logo from '../assets/logo.png'

const { t, locale } = useI18n()
const route = useRoute()

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/proyectos', key: 'nav.projects' },
  { to: '/servicios', key: 'nav.services' },
  { to: '/personalizador', key: 'nav.customize' },
  { to: '/estudio', key: 'nav.studio' },
]

/* Hide on scroll down, show on scroll up */
const hidden = ref(false)
const scrolled = ref(false)
let lastY = 0

function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 40
  hidden.value = y > 140 && y > lastY && !menuOpen.value
  lastY = y
}

onMounted(() => {
  lastY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

/* Mobile menu */
const menuOpen = ref(false)

watch(menuOpen, (open) => {
  if (open) stopScroll()
  else startScroll()
})

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  }
)

/* Locale */
function setLocale(code) {
  locale.value = code
  localStorage.setItem('skala-locale', code)
  document.documentElement.lang = code
}

onMounted(() => {
  const saved = localStorage.getItem('skala-locale')
  if (saved && saved !== locale.value) setLocale(saved)
})
</script>

<template>
  <header class="nav" :class="{ 'nav--hidden': hidden, 'nav--scrolled': scrolled }">
    <div class="container nav__inner">
      <RouterLink to="/" class="nav__brand" aria-label="Skala Studio — Inicio">
        <img :src="logo" alt="" class="nav__logo" width="40" height="40" />
        <span class="nav__wordmark">skala studio</span>
      </RouterLink>

      <nav class="nav__links" aria-label="Principal">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="link-line nav__link"
          :class="{ 'is-active': route.path === link.to }"
        >
          {{ t(link.key) }}
        </RouterLink>
      </nav>

      <div class="nav__right">
        <div class="nav__locale" role="group" aria-label="Idioma / Language">
          <button
            :class="{ 'is-on': locale === 'es' }"
            aria-label="Español"
            @click="setLocale('es')"
          >
            ES
          </button>
          <span aria-hidden="true">/</span>
          <button
            :class="{ 'is-on': locale === 'en' }"
            aria-label="English"
            @click="setLocale('en')"
          >
            EN
          </button>
        </div>

        <RouterLink
          to="/contacto"
          class="btn btn--primary nav__cta"
          :class="{ 'is-current': route.path === '/contacto' }"
          :aria-current="route.path === '/contacto' ? 'page' : undefined"
        >
          {{ t('nav.cta') }}
        </RouterLink>

        <button
          class="nav__burger"
          :class="{ 'is-open': menuOpen }"
          :aria-expanded="menuOpen"
          aria-label="Menú"
          @click="menuOpen = !menuOpen"
        >
          <span></span><span></span>
        </button>
      </div>
    </div>

    <AnimatePresence>
      <motion.div
        v-if="menuOpen"
        class="menu"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.35, ease: 'easeOut' }"
      >
        <nav class="menu__links" aria-label="Menú móvil">
          <motion.div
            v-for="(link, i) in [...links, { to: '/contacto', key: 'nav.contact' }]"
            :key="link.to"
            :initial="{ opacity: 0, y: 28 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 0.08 + i * 0.06, ease: 'easeOut' }"
          >
            <RouterLink :to="link.to" class="menu__link">{{ t(link.key) }}</RouterLink>
          </motion.div>
        </nav>
        <motion.div
          class="menu__locale"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ delay: 0.4 }"
        >
          <button :class="{ 'is-on': locale === 'es' }" @click="setLocale('es')">Español</button>
          <button :class="{ 'is-on': locale === 'en' }" @click="setLocale('en')">English</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  transition:
    transform 0.5s var(--ease-out),
    background-color 0.3s ease;
}

.nav--hidden {
  transform: translateY(-100%);
}

.nav--scrolled {
  background: color-mix(in srgb, var(--color-background) 82%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  height: 4.5rem;
}

.nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.nav__logo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.nav__wordmark {
  font-family: var(--font-display);
  font-size: 1.15rem;
  letter-spacing: 0.02em;
}

.nav__links {
  display: none;
  gap: var(--space-3);
}

.nav__link {
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.04em;
}

.nav__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.nav__locale {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  color: var(--color-foreground-soft);
}

.nav__locale button {
  padding: 0.5rem 0.15rem;
  min-width: 2rem;
  min-height: 2.75rem;
  color: inherit;
}

.nav__locale button.is-on {
  color: var(--color-foreground);
  font-weight: 600;
}

.nav__cta {
  display: none;
  min-height: 2.6rem;
  padding-block: 0.6rem;
}

/* estado actual: estás en /contacto */
.nav__cta.is-current {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.nav__burger {
  position: relative;
  z-index: 20;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
}

.nav__burger span {
  display: block;
  width: 26px;
  height: 1.5px;
  background: currentColor;
  transition: transform 0.35s var(--ease-out);
}

.nav__burger.is-open span:first-child {
  transform: translateY(4.25px) rotate(45deg);
}

.nav__burger.is-open span:last-child {
  transform: translateY(-4.25px) rotate(-45deg);
}

@media (min-width: 900px) {
  .nav__links {
    display: flex;
  }

  .nav__cta {
    display: inline-flex;
  }

  .nav__burger {
    display: none;
  }
}

/* Mobile menu overlay */
.menu {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--space-5);
  background: var(--color-background);
}

.menu__links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.menu__link {
  display: inline-block;
  padding: 0.4rem 1rem;
  font-family: var(--font-display);
  font-size: var(--text-2xl);
}

.menu__locale {
  display: flex;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-foreground-soft);
}

.menu__locale button {
  padding: 0.6rem;
}

.menu__locale button.is-on {
  color: var(--color-accent);
  font-weight: 600;
}
</style>
