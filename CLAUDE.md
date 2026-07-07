# CLAUDE.md — Skala Studio Web

Sitio web de **Skala Studio** (Instagram [@skalastudio.sk](https://www.instagram.com/skalastudio.sk/)), estudio de
arquitectura, diseño interior y **mobiliario a medida**. Web moderna estilo Awwwards, multi-página,
bilingüe (ES/EN), con animaciones fluidas y un **configurador 3D de cocina** interactivo.

- **En vivo:** https://sebazms07.github.io/skala-studio/
- **Repo:** https://github.com/sebazms07/skala-studio (rama `main`)
- **Raíz del proyecto:** `~/Documents/claude/skala-web`

---

## Stack

| Área | Tecnología |
|------|-----------|
| Framework | Vue 3 (`<script setup>` / Composition API) + Vite 8 |
| Ruteo | Vue Router 4 (`createWebHistory`) — transición de cortina entre páginas |
| i18n | vue-i18n 11 (`legacy: false`), ES por defecto + EN |
| Animación declarativa | **motion-v** (Motion para Vue) — hover/press, stagger, `AnimatePresence` |
| Animación scroll | **GSAP** + ScrollTrigger (reveals, parallax, split-text) |
| Smooth scroll | **Lenis** |
| 3D | **Three.js** (solo en el configurador, lazy-loaded) |
| Estilos | CSS puro con design tokens en `src/style.css` (sin Tailwind) |

`npm install` · `npm run dev` (puerto configurable) · `npm run build` · `npm run preview`
En este entorno el dev server se lanza con la config **"skala-web"** de `.claude/launch.json` (puerto 5175).

---

## Identidad visual (design system)

Generado con el skill `ui-ux-pro-max` (estilo **Swiss Modernism 2.0**, editorial cálido). Tokens en `src/style.css`:

- **Colores:** primario taupe `#a89272` (del logo), fondo crema `#faf5f2`, texto carbón `#1c1a17`,
  acento dorado `#9a6b2f`, secciones oscuras `#1c1a17`. Siempre usar las custom properties `--color-*`, no hex sueltos.
- **Tipografía:** *Playfair Display* (títulos, serif) + *Inter* (cuerpo), vía Google Fonts (`index.html`).
- **Espaciado:** escala espaciosa `--space-1..7` (0.5rem → 9rem).
- **Motion tokens:** `--dur-fast/med/slow`, `--ease-out/in/in-out` — mismo ritmo en GSAP y motion-v.
- **Utilidades globales** (en `style.css`): `.container`, `.section`, `.section--dark`, `.label` (marcador
  editorial en mayúsculas), `.btn`/`.btn--primary`/`.btn--outline`, `.link-line` (subrayado animado),
  `.img-frame` (zoom en hover), `.grain` (overlay de ruido SVG).

El design system persistido del skill vive en `design-system/` (referencia, no se importa en código).

---

## Estructura

```
src/
├── main.js                 # createApp + router + i18n
├── App.vue                 # layout: Preloader, Navbar, RouterView (transición cortina GSAP), Footer
├── style.css               # design tokens + reset + utilidades globales
├── router/index.js         # 7 rutas, todas lazy; scrollBehavior top
├── i18n/                    # index.js + es.json + en.json  (fuente de TODOS los textos)
├── data/projects.js        # 6 proyectos placeholder (Instagram) + getProject/getAdjacent
├── composables/
│   ├── useLenis.js         # smooth scroll global (initLenis, scrollToTop, stop/start)
│   ├── useReveal.js        # GSAP ScrollTrigger por vista con gsap.context + cleanup
│   └── useKitchenScene.js  # escena Three.js del configurador (init/updateConfig/dispose)
├── components/
│   ├── TheNavbar.vue       # logo, links, selector ES/EN, menú móvil, hide-on-scroll
│   ├── TheFooter.vue       # navegación, Instagram, wordmark gigante
│   ├── ThePreloader.vue    # monograma Sk (1 vez por sesión via sessionStorage)
│   ├── SplitText.vue       # reveal de título letra-por-letra con máscara POR PALABRA (ver Gotchas)
│   ├── MarqueeText.vue     # marquee infinito CSS
│   ├── ProjectCard.vue     # card de proyecto con motion-v (while-in-view stagger)
│   ├── hero/               # AuroraShader (WebGL), GoldParticles (canvas 2D), HeroSpotlight (cursor)
│   └── configurator/       # KitchenScene.vue (canvas + fallback) + ConfigPanel.vue (controles)
├── lib/kitchen/            # lógica pura del configurador (ver sección propia)
└── views/                  # HomeView, ProjectsView, ProjectDetailView, ServicesView,
                            # StudioView, ContactView, KitchenConfiguratorView
```

### Rutas (`router/index.js`)
`/` Home · `/proyectos` · `/proyectos/:slug` (detalle) · `/servicios` · `/personalizador` (configurador) ·
`/estudio` · `/contacto` · `*` → redirect a `/`. **Todas lazy** (`() => import()`).

---

## Patrones a reutilizar (importante)

- **Textos:** NUNCA hardcodear strings en componentes. Van en `i18n/es.json` + `en.json` y se leen con
  `t('...')`, `tm('...')` (arrays/objetos) + `rt(...)`. Los nombres de opciones del configurador también.
- **Reveals de scroll:** en una vista nueva, `const root = ref(null); useReveal(root)` y marcar elementos con
  `data-reveal` (fade-up, valor = delay), `data-clip` (imagen clip-path), `data-parallax` (valor = intensidad).
- **Título de página:** usar `<SplitText :text="t('...')" :delay="0.2" />` como en las demás vistas.
- **Cabecera de vista:** patrón repetido — `.label` + `.page__title` + `.page__subtitle`, con `padding-top: 8rem`
  (para dejar espacio bajo la navbar fija).
- **Micro-interacciones:** motion-v (`:while-press`, `:while-in-view`, `AnimatePresence`). GSAP solo para scroll y
  coreografías complejas.
- **Efectos canvas/WebGL:** patrón de `AuroraShader.vue` — pausar con `IntersectionObserver`, limpiar en
  `onUnmounted`, fallback si no hay WebGL, respetar `prefers-reduced-motion`.

---

## Configurador 3D de cocina (`/personalizador`)

Módulo estrella: cocina moderna paramétrica que el visitante personaliza en tiempo real. **Three.js carga solo en
esta ruta** (chunk aparte ~555KB), no afecta el bundle del resto del sitio. Cocina **generada por código** (cajas,
cilindros) y **texturas procedurales en canvas** — sin modelos GLTF ni imágenes externas (cero problemas con el base path).

**Archivos:**
- `lib/kitchen/presets.js` — opciones (layouts, `cabinetColors`, `finishes`, `countertops`, `floors`) + `defaultConfig()`.
- `lib/kitchen/materials.js` — `createMaterials(config)` devuelve materiales `MeshStandardMaterial` compartidos +
  API (`setCabinetColor`, `setFinish`, `setCountertop`, `setFloor`, `setLed`, `dispose`). Texturas dibujadas en canvas
  (mármol, cuarzos, maderas, travertino, microcemento), cacheadas por clave. `textureThumb()` genera las miniaturas del panel.
- `lib/kitchen/buildKitchen.js` — `buildKitchen(layout, m)` construye el `Group` de la cocina según distribución
  (`linear`, `l`, `u`, `island`); helpers `run()`, `island()`, `tallUnit()`, `addSink()`. Devuelve `{ group, ledLights, dispose }`.
- `composables/useKitchenScene.js` — `createKitchenScene(canvas, config, {reduced})`: renderer, luces
  (DirectionalLight clave con sombras + Hemisphere + PointLight fill + PMREM RoomEnvironment), OrbitControls
  (damping, azimut/polar limitados, sin pan), loop pausado por `IntersectionObserver` + `visibilitychange`,
  `updateConfig()` (muta materiales/luces o reconstruye layout con transición GSAP) y `dispose()` completo. Devuelve `null` si no hay WebGL.
- `components/configurator/KitchenScene.vue` — canvas + `watch(config)` → `updateConfig`, `dispose` en unmount, fallback WebGL, hint.
- `components/configurator/ConfigPanel.vue` — swatches, segmented controls, miniaturas de textura, sliders, toggles.
  Todo accesible (`role="radiogroup"`, `aria-checked`, targets ≥44px).
- `views/KitchenConfiguratorView.vue` — layout responsive (visor + panel sticky en desktop / apilado en móvil),
  botón Reiniciar y CTA **"Solicitar cotización"** → `RouterLink` a `/contacto?config=<resumen>`.

**Opciones actuales (paleta "tendencias 2026", neutros cálidos + matte):**
- Distribución: Lineal · En L · En U (frente continuo de pared a pared) · Con isla.
- Gabinetes: beige, piedra/taupe, verde gris (sage), verde musgo, terracota, carbón, roble miel, nogal + acabado mate/lacado.
- Encimera: cuarzo blanco, cuarzo cachemira, mármol, cuarzo grafito, nogal, microcemento.
- Piso: roble blanqueado, roble miel, nogal, travertino, microcemento.
- Iluminación: temperatura (2700K cálida ↔ 6500K fría), intensidad, modo noche, tira LED bajo gabinetes.
- Herrajes/grifería en **dorado cepillado** (`m.brass`), electrodomésticos en acero matte (`m.metal`).

**Conexión con Contacto:** `KitchenConfiguratorView` arma un `summary` legible → query `?config=`. `ContactView.vue`
en `onMounted` lee `route.query.config` y prellena el textarea (con `configurator.quoteIntro`) + selecciona tipo "Mobiliario a medida".

Para **añadir un color/textura/layout**: agregar el id en `presets.js`, su dibujo/spec en `materials.js` (y/o caso en
`buildKitchen.js`), y las traducciones en `i18n/*.json` (`configurator.cabinetColors.*`, `.countertops.*`, `.floors.*`, `.layouts.*`).

---

## Deploy — GitHub Pages (¡leer!)

Deploy automático vía **GitHub Actions** en cada push a `main` (`.github/workflows/deploy.yml`).

- **Pages Source DEBE ser "GitHub Actions"** (Settings → Pages), NO "Deploy from a branch". Con "branch" sirve el
  código fuente crudo (`/src/main.js`) y todo rompe con 404.
- **Base path:** `vite.config.js` pone `base: '/skala-studio/'` **solo en producción** (`NODE_ENV === 'production'`),
  en dev queda `/`. Vue Router usa `createWebHistory(import.meta.env.BASE_URL)` para mantener `/skala-studio` en las rutas.
- **SPA routing:** un plugin en `vite.config.js` copia `dist/index.html` → `dist/404.html` en cada build. Así los
  reloads en rutas profundas (`/personalizador`, etc.) devuelven la app. **No** crear un `public/404.html` manual
  (sobrescribe al generado y rompe las rutas de assets).
- El workflow tiene `environment: github-pages` y `concurrency: pages` (ambos necesarios).
- El error `"Deployment failed, try again later"` del step `deploy-pages` suele ser **transitorio** → reintentar (commit vacío).
- Verificar deploy: comparar el hash de `dist/assets/index-*.js` local con el `<script>` servido en la URL en vivo.

---

## Gotchas aprendidos

- **vue-i18n y `@`:** un `@` literal en un mensaje se interpreta como sintaxis de enlace y lanza
  "Invalid linked format". Escaparlo como `{'@'}` (ej. placeholders de email en `contact.form.emailPh`).
- **SplitText / recorte de tipografía:** el reveal usa una máscara `overflow:hidden` **por palabra** (no por letra)
  con `padding-block: 0.35em; margin-block: -0.35em`, para no recortar ascendentes/descendentes de la itálica de
  Playfair (la "f" de "la forma"). No reducir ese padding. Anima con `gsap.fromTo(chars, {yPercent:112}, ...)`.
- **Three.js:** `PCFSoftShadowMap` está deprecado → usar `PCFShadowMap`. Disponer SIEMPRE geometrías, materiales y
  texturas en teardown (ya implementado en `dispose()`), y `gsap.killTweensOf` de la cámara.
- **FOV móvil:** en portrait el FOV horizontal se estrecha; `useKitchenScene` sube el FOV vertical a 58 cuando `w/h < 0.9`.
- **Datos placeholder:** proyectos (`data/projects.js`, imágenes Unsplash), email `hola@skalastudio.com` y dirección
  de Contacto son de relleno — reemplazar por los reales.

---

## Pendientes / ideas
- Reemplazar imágenes y fichas de proyectos por los renders reales del estudio.
- Conectar el formulario de Contacto a un backend real (Formspree / API) — hoy solo simula el envío.
- Actualizar email y dirección reales.
