<script setup>
import { useI18n } from 'vue-i18n'
import logo from '../assets/logo.png'

const { t } = useI18n()
const year = new Date().getFullYear()

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/proyectos', key: 'nav.projects' },
  { to: '/servicios', key: 'nav.services' },
  { to: '/estudio', key: 'nav.studio' },
  { to: '/contacto', key: 'nav.contact' },
]
</script>

<template>
  <footer class="footer section--dark">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <img :src="logo" alt="Skala Studio" class="footer__logo" width="56" height="56" />
          <p class="footer__tagline">{{ t('footer.tagline') }}</p>
        </div>

        <div class="footer__cols">
          <div>
            <h3 class="footer__heading">{{ t('footer.nav') }}</h3>
            <ul>
              <li v-for="link in links" :key="link.to">
                <RouterLink :to="link.to" class="link-line">{{ t(link.key) }}</RouterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="footer__heading">{{ t('footer.social') }}</h3>
            <ul>
              <li>
                <a
                  href="https://www.instagram.com/skalastudio.sk/"
                  target="_blank"
                  rel="noopener"
                  class="link-line"
                  >Instagram</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p class="footer__wordmark" aria-hidden="true">skala studio</p>

      <div class="footer__bottom">
        <span>© {{ year }} Skala Studio</span>
        <span>{{ t('footer.rights') }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding-block: var(--space-6) var(--space-3);
}

.footer__top {
  display: grid;
  gap: var(--space-5);
  padding-bottom: var(--space-6);
}

.footer__logo {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
}

.footer__tagline {
  margin-top: var(--space-3);
  max-width: 20rem;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  line-height: 1.35;
}

.footer__cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.footer__heading {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-on-dark-soft);
  margin-bottom: var(--space-2);
}

.footer ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: var(--text-sm);
}

.footer__wordmark {
  font-family: var(--font-display);
  font-size: clamp(3rem, 12vw, 10rem);
  line-height: 1;
  text-align: center;
  color: color-mix(in srgb, var(--color-on-dark) 12%, transparent);
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid color-mix(in srgb, var(--color-on-dark) 15%, transparent);
  font-size: var(--text-xs);
  color: var(--color-on-dark-soft);
}

@media (min-width: 900px) {
  .footer__top {
    grid-template-columns: 1.2fr 1fr;
  }
}
</style>
