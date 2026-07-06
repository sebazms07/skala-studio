// Datos placeholder de proyectos (nombres tomados de los destacados de Instagram).
// Reemplazar imágenes de Unsplash por los renders reales y ajustar fichas.
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`

export const projects = [
  {
    slug: 'casa-natu',
    name: 'Casa Natu',
    category: 'architecture',
    year: 2024,
    location: 'La Planicie',
    area: '420 m²',
    cover: u('photo-1600596542815-ffad4c1539a9'),
    gallery: [
      u('photo-1600607687939-ce8a6c25118c'),
      u('photo-1600585154340-be6161a56a0c'),
      u('photo-1600566753190-17f0baa2a6c3'),
    ],
    desc: {
      es: 'Vivienda unifamiliar donde la vegetación tropical y la madera dialogan con volúmenes puros. La casa se abre al jardín a través de una pérgola que filtra la luz y difumina el límite entre interior y exterior.',
      en: 'A single-family home where tropical vegetation and wood converse with pure volumes. The house opens to the garden through a pergola that filters light and blurs the boundary between inside and outside.',
    },
  },
  {
    slug: 'haltia',
    name: 'Haltia',
    category: 'commercial',
    year: 2024,
    location: 'San Isidro',
    area: '260 m²',
    cover: u('photo-1497366216548-37526070297c'),
    gallery: [
      u('photo-1497366811353-6870744d04b2'),
      u('photo-1524758631624-e2822e304c36'),
      u('photo-1604328698692-f76ea9498e76'),
    ],
    desc: {
      es: 'Oficinas corporativas pensadas para el trabajo híbrido: zonas de concentración, áreas colaborativas y una materialidad cálida que rompe con la frialdad del espacio de trabajo tradicional.',
      en: 'Corporate offices designed for hybrid work: focus zones, collaborative areas and a warm material palette that breaks with the coldness of the traditional workplace.',
    },
  },
  {
    slug: 'pranha',
    name: 'Pranha',
    category: 'commercial',
    year: 2023,
    location: 'Miraflores',
    area: '180 m²',
    cover: u('photo-1517248135467-4c7edcad34c4'),
    gallery: [
      u('photo-1552566626-52f8b828add9'),
      u('photo-1466978913421-dad2ebd01d17'),
      u('photo-1414235077428-338989a2e8c0'),
    ],
    desc: {
      es: 'Espacio gastronómico de carácter intenso: un rojo profundo envuelve la sala privada mientras la iluminación lineal dibuja el ritmo del techo. Contraste, drama y confort en una sola atmósfera.',
      en: 'A dining space with intense character: a deep red wraps the private room while linear lighting draws the rhythm of the ceiling. Contrast, drama and comfort in a single atmosphere.',
    },
  },
  {
    slug: 'centro-medico-da',
    name: 'Centro Médico DA',
    category: 'commercial',
    year: 2023,
    location: 'Surco',
    area: '340 m²',
    cover: u('photo-1629909613654-28e377c37b09'),
    gallery: [
      u('photo-1519494026892-80bbd2d6fd0d'),
      u('photo-1631679706909-1844bbd07221'),
      u('photo-1497366216548-37526070297c'),
    ],
    desc: {
      es: 'Centro de medicina regenerativa donde el diseño reduce la ansiedad del paciente: curvas suaves, vidrio texturizado y una paleta neutra que transmite calma y profesionalismo.',
      en: 'A regenerative medicine center where design reduces patient anxiety: soft curves, textured glass and a neutral palette that conveys calm and professionalism.',
    },
  },
  {
    slug: 'laureles',
    name: 'Laureles',
    category: 'interior',
    year: 2024,
    location: 'La Molina',
    area: '210 m²',
    cover: u('photo-1618221195710-dd6b41faaea6'),
    gallery: [
      u('photo-1616486338812-3dadae4b4ace'),
      u('photo-1615873968403-89e068629265'),
      u('photo-1556228453-efd6c1ff04f6'),
    ],
    desc: {
      es: 'Interiorismo integral de una vivienda familiar: madera clara, textiles naturales y mobiliario a medida que ordena la vida diaria sin renunciar a la calidez.',
      en: 'Full interior design of a family home: light wood, natural textiles and custom furniture that organizes daily life without giving up warmth.',
    },
  },
  {
    slug: 'casa-gr',
    name: 'Casa GR',
    category: 'interior',
    year: 2023,
    location: 'Barranco',
    area: '150 m²',
    cover: u('photo-1522708323590-d24dbb6b0267'),
    gallery: [
      u('photo-1484154218962-a197022b5858'),
      u('photo-1540518614846-7eded433c457'),
      u('photo-1505693416388-ac5ce068fe85'),
    ],
    desc: {
      es: 'Remodelación de un departamento con espíritu joven: murales suaves, dormitorios que crecen con los niños y una cocina abierta que se vuelve el corazón de la casa.',
      en: 'Renovation of an apartment with a young spirit: soft murals, bedrooms that grow with the kids and an open kitchen that becomes the heart of the home.',
    },
  },
]

export function getProject(slug) {
  return projects.find((p) => p.slug === slug)
}

export function getAdjacent(slug) {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  }
}
