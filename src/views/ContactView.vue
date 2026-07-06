<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { motion, AnimatePresence } from 'motion-v'
import { useReveal } from '../composables/useReveal'

const { t, tm, rt } = useI18n()
const root = ref(null)
useReveal(root)

const form = reactive({ name: '', email: '', type: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })
const status = ref('idle') // idle | sending | success

function validate() {
  errors.name = form.name.trim() ? '' : t('contact.form.required')
  errors.message = form.message.trim() ? '' : t('contact.form.required')
  if (!form.email.trim()) errors.email = t('contact.form.required')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('contact.form.emailInvalid')
  } else errors.email = ''
  return !errors.name && !errors.email && !errors.message
}

function submit() {
  if (!validate()) return
  status.value = 'sending'
  /* Sin backend: simulación de envío. Conectar aquí un servicio real (Formspree, API propia…). */
  setTimeout(() => {
    status.value = 'success'
  }, 900)
}
</script>

<template>
  <div ref="root" class="page">
    <header class="container page__head">
      <p class="label" data-reveal>{{ t('nav.contact') }}</p>
      <h1 class="page__title" data-reveal="0.05">{{ t('contact.title') }}</h1>
      <p class="page__subtitle" data-reveal="0.1">{{ t('contact.subtitle') }}</p>
    </header>

    <div class="container layout">
      <aside class="info" data-reveal="0.15">
        <div class="info__block">
          <h2 class="info__heading">{{ t('contact.emailLabel') }}</h2>
          <a href="mailto:hola@skalastudio.com" class="link-line info__big">hola@skalastudio.com</a>
        </div>
        <div class="info__block">
          <h2 class="info__heading">{{ t('contact.follow') }}</h2>
          <a
            href="https://www.instagram.com/skalastudio.sk/"
            target="_blank"
            rel="noopener"
            class="link-line"
            >Instagram — @skalastudio.sk</a
          >
        </div>
        <div class="info__block">
          <h2 class="info__heading">{{ t('contact.visitLabel') }}</h2>
          <p>{{ t('contact.address') }}</p>
        </div>
      </aside>

      <div class="form-wrap">
        <AnimatePresence mode="wait">
          <motion.form
            v-if="status !== 'success'"
            key="form"
            class="form"
            novalidate
            :exit="{ opacity: 0, y: -16 }"
            :transition="{ duration: 0.3 }"
            @submit.prevent="submit"
          >
            <div class="field" data-reveal="0.2">
              <label for="c-name">{{ t('contact.form.name') }} *</label>
              <input
                id="c-name"
                v-model="form.name"
                type="text"
                name="name"
                autocomplete="name"
                :placeholder="t('contact.form.namePh')"
                :aria-invalid="!!errors.name"
                @blur="form.name && (errors.name = '')"
              />
              <p v-if="errors.name" class="field__error" role="alert">{{ errors.name }}</p>
            </div>

            <div class="field" data-reveal="0.25">
              <label for="c-email">{{ t('contact.form.email') }} *</label>
              <input
                id="c-email"
                v-model="form.email"
                type="email"
                name="email"
                autocomplete="email"
                :placeholder="t('contact.form.emailPh')"
                :aria-invalid="!!errors.email"
              />
              <p v-if="errors.email" class="field__error" role="alert">{{ errors.email }}</p>
            </div>

            <div class="field" data-reveal="0.3">
              <label for="c-type">{{ t('contact.form.type') }}</label>
              <select id="c-type" v-model="form.type" name="type">
                <option value="" disabled>{{ t('contact.form.typePh') }}</option>
                <option v-for="opt in tm('contact.form.types')" :key="rt(opt)" :value="rt(opt)">
                  {{ rt(opt) }}
                </option>
              </select>
            </div>

            <div class="field" data-reveal="0.35">
              <label for="c-message">{{ t('contact.form.message') }} *</label>
              <textarea
                id="c-message"
                v-model="form.message"
                name="message"
                rows="5"
                :placeholder="t('contact.form.messagePh')"
                :aria-invalid="!!errors.message"
              ></textarea>
              <p v-if="errors.message" class="field__error" role="alert">{{ errors.message }}</p>
            </div>

            <motion.button
              type="submit"
              class="btn btn--primary form__submit"
              :disabled="status === 'sending'"
              :while-press="{ scale: 0.97 }"
              data-reveal="0.4"
            >
              {{ status === 'sending' ? t('contact.form.sending') : t('contact.form.submit') }}
            </motion.button>
          </motion.form>

          <motion.p
            v-else
            key="success"
            class="success"
            role="status"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, ease: 'easeOut' }"
          >
            {{ t('contact.form.success') }}
          </motion.p>
        </AnimatePresence>
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
  max-width: 18ch;
}

.page__subtitle {
  max-width: 44ch;
  color: var(--color-foreground-soft);
}

.layout {
  display: grid;
  gap: var(--space-5);
}

.info {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.info__heading {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-foreground-soft);
  margin-bottom: var(--space-1);
}

.info__big {
  font-family: var(--font-display);
  font-size: var(--text-xl);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: var(--text-sm);
  font-weight: 500;
}

.field input,
.field select,
.field textarea {
  min-height: 3rem;
  padding: 0.8rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  transition: border-color var(--dur-fast) var(--ease-out);
}

.field textarea {
  resize: vertical;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--color-primary-dark);
}

.field input[aria-invalid='true'],
.field textarea[aria-invalid='true'] {
  border-color: #b3261e;
}

.field__error {
  font-size: var(--text-xs);
  color: #b3261e;
}

.field ::placeholder {
  color: color-mix(in srgb, var(--color-foreground-soft) 60%, transparent);
}

.form__submit {
  align-self: flex-start;
}

.form__submit:disabled {
  opacity: 0.5;
  cursor: default;
}

.success {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  max-width: 26ch;
}

@media (min-width: 900px) {
  .layout {
    grid-template-columns: 1fr 1.4fr;
  }
}
</style>
