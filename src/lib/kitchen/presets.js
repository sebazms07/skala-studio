// Opciones del configurador de cocina. Los ids se traducen vía i18n
// (configurator.layouts.*, configurator.cabinetColors.*, etc.)

export const layouts = ['linear', 'l', 'u', 'island']

export const cabinetColors = [
  { id: 'cream', hex: '#ede6da' },
  { id: 'taupe', hex: '#a89272' },
  { id: 'sage', hex: '#8a9b84' },
  { id: 'navy', hex: '#2c3a4f' },
  { id: 'terracotta', hex: '#b56a4c' },
  { id: 'graphite', hex: '#3a3733' },
]

export const finishes = ['matte', 'gloss']

export const countertops = ['marble', 'granite', 'walnut', 'concrete']

export const floors = ['lightwood', 'walnut', 'concrete']

export function defaultConfig() {
  return {
    layout: 'island',
    cabinetColor: 'taupe',
    finish: 'matte',
    countertop: 'marble',
    floor: 'lightwood',
    temperature: 0.3, // 0 cálida → 1 fría
    intensity: 0.7, // 0 → 1
    night: false,
    led: true,
  }
}
