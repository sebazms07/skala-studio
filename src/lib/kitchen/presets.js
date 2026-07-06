// Opciones del configurador de cocina — paleta tendencias 2026
// (maximalismo minimalista: neutros cálidos, verdes gris, acentos tierra, todo matte).
// Los ids se traducen vía i18n (configurator.layouts.*, configurator.cabinetColors.*, etc.)

export const layouts = ['linear', 'l', 'u', 'island']

export const cabinetColors = [
  { id: 'beige', hex: '#e8dcc8' },       // Beige cálido
  { id: 'stone', hex: '#d4c5b9' },       // Piedra natural (taupe)
  { id: 'sage', hex: '#6b7e7a' },        // Verde gris
  { id: 'moss', hex: '#a8b8a8' },        // Verde musgo
  { id: 'terracotta', hex: '#c17b5c' },  // Terracota suave
  { id: 'charcoal', hex: '#2c2c2c' },    // Negro carbón
  { id: 'honeyOak', hex: '#c9a876' },    // Roble miel
  { id: 'walnut', hex: '#5c4e44' },      // Nogal americano
]

export const finishes = ['matte', 'gloss']

export const countertops = [
  'quartzWhite',   // Cuarzo blanco lechoso
  'cashmere',      // Cuarzo beige cachemira
  'marble',        // Mármol natural
  'graphite',      // Cuarzo negro carbón
  'walnut',        // Nogal recubierto
  'microcement',   // Microcemento
]

export const floors = [
  'bleachedOak',   // Roble blanqueado
  'honeyOak',      // Roble miel
  'walnut',        // Nogal
  'travertine',    // Beige travertino
  'microcement',   // Microcemento pulido
]

export function defaultConfig() {
  return {
    layout: 'island',
    cabinetColor: 'stone',
    finish: 'matte',
    countertop: 'quartzWhite',
    floor: 'bleachedOak',
    temperature: 0.25, // 0 cálida (2700K) → 1 fría (6500K)
    intensity: 0.7, // 0 → 1
    night: false,
    led: true,
  }
}
