# Skala Studio

Sitio web de **Skala Studio** — estudio de arquitectura, diseño interior y mobiliario a medida ([@skalastudio.sk](https://www.instagram.com/skalastudio.sk/)).

Multi-página, bilingüe (ES/EN) y con animaciones fluidas estilo Awwwards: shader WebGL de aurora en el hero, partículas, spotlight, smooth scroll y transiciones de página.

## Stack

- [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/) (`<script setup>` / Composition API)
- [Vue Router](https://router.vuejs.org/) — 6 rutas con transición de cortina
- [vue-i18n](https://vue-i18n.intlify.dev/) — español (default) e inglés
- [motion-v](https://motion.dev/docs/vue) — micro-interacciones y presencia de componentes
- [GSAP](https://gsap.com/) + ScrollTrigger — reveals, parallax, split-text
- [Lenis](https://lenis.darkroom.engineering/) — smooth scroll
- CSS puro con design tokens (`src/style.css`), sistema de diseño en `design-system/`

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # previsualizar el build
```

## Estructura

```
src/
├── components/        # Navbar, Footer, Preloader, SplitText, Marquee, ProjectCard
│   └── hero/          # AuroraShader (WebGL), GoldParticles, HeroSpotlight
├── composables/       # useLenis (smooth scroll), useReveal (ScrollTrigger)
├── data/projects.js   # ⚠️ datos e imágenes placeholder — reemplazar con renders reales
├── i18n/              # es.json / en.json
├── router/
└── views/             # Home, Proyectos, Detalle, Servicios, Estudio, Contacto
```

## Pendientes

- Reemplazar imágenes de Unsplash y fichas de `src/data/projects.js` por los proyectos reales
- Actualizar email y dirección en Contacto
- Conectar el formulario a un backend (Formspree, API propia…) en `ContactView.vue`
