<script setup>
import { motion } from 'motion-v'
import { useI18n } from 'vue-i18n'

defineProps({
  project: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const { t } = useI18n()
</script>

<template>
  <motion.article
    class="card"
    :initial="{ opacity: 0, y: 44 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :in-view-options="{ once: true, margin: '-60px' }"
    :transition="{ duration: 0.7, ease: 'easeOut', delay: (index % 2) * 0.1 }"
  >
    <RouterLink :to="`/proyectos/${project.slug}`" class="card__link">
      <motion.div
        class="img-frame card__img"
        :while-press="{ scale: 0.98 }"
        :transition="{ duration: 0.2 }"
      >
        <img :src="project.cover" :alt="project.name" loading="lazy" />
      </motion.div>
      <div class="card__meta">
        <h3 class="card__title">{{ project.name }}</h3>
        <span class="card__cat">
          {{ t(`projects.categories.${project.category}`) }} · {{ project.year }}
        </span>
      </div>
    </RouterLink>
  </motion.article>
</template>

<style scoped>
.card__link {
  display: block;
}

.card__img {
  aspect-ratio: 4 / 5;
}

.card__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
  padding-top: var(--space-2);
}

.card__title {
  font-size: var(--text-xl);
}

.card__cat {
  font-size: var(--text-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-foreground-soft);
  white-space: nowrap;
}
</style>
