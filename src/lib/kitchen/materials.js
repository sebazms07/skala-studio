import * as THREE from 'three'
import { cabinetColors } from './presets'

/* ------------------------------------------------------------------
   Texturas procedurales (canvas) — paleta tendencias 2026, sin assets.
------------------------------------------------------------------- */

/* cuarzo engineered: base lisa + moteado fino sutil */
function quartz(base, speck, dark) {
  return (ctx, s) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, s, s)
    for (let i = 0; i < 2600; i++) {
      ctx.fillStyle = Math.random() > 0.85 ? speck : dark
      ctx.globalAlpha = 0.06 + Math.random() * 0.12
      const r = 0.5 + Math.random() * 1.1
      ctx.beginPath()
      ctx.arc(Math.random() * s, Math.random() * s, r, 0, 7)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }
}

function wood(base, grainA, grainB) {
  return (ctx, s) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, s, s)
    const planks = 4
    const ph = s / planks
    for (let p = 0; p < planks; p++) {
      const y0 = p * ph
      for (let i = 0; i < 22; i++) {
        ctx.strokeStyle = `${i % 3 === 0 ? grainB : grainA}${Math.random() > 0.5 ? '55' : '33'}`
        ctx.lineWidth = 0.7 + Math.random() * 1.6
        const yy = y0 + Math.random() * ph
        const amp = 1 + Math.random() * 3
        ctx.beginPath()
        for (let x = 0; x <= s; x += 8) {
          const y = yy + Math.sin(x * 0.03 + p * 9 + i) * amp
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      ctx.fillStyle = 'rgba(40,30,20,0.3)'
      ctx.fillRect(0, y0 + ph - 1.2, s, 1.6)
    }
  }
}

const draws = {
  /* mármol natural blanco */
  marble(ctx, s) {
    ctx.fillStyle = '#f1ede6'
    ctx.fillRect(0, 0, s, s)
    for (let i = 0; i < 26; i++) {
      ctx.fillStyle = `rgba(206,197,182,${0.03 + Math.random() * 0.05})`
      const r = 40 + Math.random() * 120
      ctx.beginPath()
      ctx.arc(Math.random() * s, Math.random() * s, r, 0, 7)
      ctx.fill()
    }
    for (let i = 0; i < 13; i++) {
      ctx.strokeStyle = `rgba(132,126,116,${0.08 + Math.random() * 0.14})`
      ctx.lineWidth = 0.8 + Math.random() * 2
      ctx.beginPath()
      let x = Math.random() * s
      let y = -10
      ctx.moveTo(x, y)
      while (y < s + 10) {
        y += 18 + Math.random() * 42
        x += (Math.random() - 0.5) * 70
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  },

  /* travertino: bandas horizontales cálidas + poros */
  travertine(ctx, s) {
    ctx.fillStyle = '#d4c4b0'
    ctx.fillRect(0, 0, s, s)
    for (let b = 0; b < 14; b++) {
      const y = (s / 14) * b + Math.random() * 8
      ctx.fillStyle = `rgba(${168 + Math.random() * 30},${148 + Math.random() * 26},${122 + Math.random() * 22},${0.12 + Math.random() * 0.12})`
      ctx.fillRect(0, y, s, 10 + Math.random() * 22)
    }
    for (let i = 0; i < 700; i++) {
      ctx.fillStyle = `rgba(122,104,84,${0.05 + Math.random() * 0.12})`
      ctx.beginPath()
      ctx.ellipse(Math.random() * s, Math.random() * s, 1 + Math.random() * 2.4, 0.5 + Math.random(), 0, 0, 7)
      ctx.fill()
    }
  },

  /* microcemento pulido: nubes suaves grises */
  microcement(ctx, s) {
    ctx.fillStyle = '#a89f94'
    ctx.fillRect(0, 0, s, s)
    for (let i = 0; i < 260; i++) {
      const g = 140 + Math.random() * 50
      ctx.fillStyle = `rgba(${g},${g - 4},${g - 10},${0.04 + Math.random() * 0.06})`
      const r = 10 + Math.random() * 80
      ctx.beginPath()
      ctx.arc(Math.random() * s, Math.random() * s, r, 0, 7)
      ctx.fill()
    }
    for (let i = 0; i < 700; i++) {
      ctx.fillStyle = `rgba(70,66,60,${Math.random() * 0.1})`
      ctx.fillRect(Math.random() * s, Math.random() * s, 1.1, 1.1)
    }
  },

  quartzWhite: quartz('#f5f3f0', '#ffffff', '#d9d5cf'),
  quartzCashmere: quartz('#c9b8a8', '#e3d6c8', '#a8917c'),
  quartzGraphite: quartz('#1f1f1f', '#5a5a5a', '#0d0d0d'),

  woodBleached: wood('#d8d3c9', '#c4bfb3', '#a9a49a'),
  woodHoney: wood('#cda87a', '#b8905e', '#9a7748'),
  woodWalnut: wood('#6e5238', '#5c4128', '#46311d'),
}

/* ------------------------------------------------------------------ */

const counterSpec = {
  quartzWhite: { draw: 'quartzWhite', roughness: 0.45 },
  cashmere: { draw: 'quartzCashmere', roughness: 0.45 },
  marble: { draw: 'marble', roughness: 0.3 },
  graphite: { draw: 'quartzGraphite', roughness: 0.42 },
  walnut: { draw: 'woodWalnut', roughness: 0.5 },
  microcement: { draw: 'microcement', roughness: 0.6 },
}

const floorSpec = {
  bleachedOak: { draw: 'woodBleached', roughness: 0.72 },
  honeyOak: { draw: 'woodHoney', roughness: 0.72 },
  walnut: { draw: 'woodWalnut', roughness: 0.72 },
  travertine: { draw: 'travertine', roughness: 0.8 },
  microcement: { draw: 'microcement', roughness: 0.85 },
}

const cabinetHex = Object.fromEntries(cabinetColors.map((c) => [c.id, c.hex]))

/** Miniatura para el panel (mismo dibujo procedural, 96px). */
export function textureThumb(drawId) {
  const c = document.createElement('canvas')
  c.width = c.height = 96
  draws[drawId](c.getContext('2d'), 96)
  return c.toDataURL()
}

export const counterThumbDraw = (id) => counterSpec[id].draw
export const floorThumbDraw = (id) => floorSpec[id].draw

export function createMaterials(config) {
  const texCache = new Map()

  function tex(drawId, rx = 1, ry = 1) {
    const key = `${drawId}:${rx}:${ry}`
    if (!texCache.has(key)) {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 512
      draws[drawId](canvas.getContext('2d'), 512)
      const t = new THREE.CanvasTexture(canvas)
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(rx, ry)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      texCache.set(key, t)
    }
    return texCache.get(key)
  }

  const m = {
    cabinet: new THREE.MeshStandardMaterial({
      color: cabinetHex[config.cabinetColor],
      roughness: 0.62,
      metalness: 0.04,
    }),
    stone: new THREE.MeshStandardMaterial({
      map: tex(counterSpec[config.countertop].draw, 2, 1),
      roughness: counterSpec[config.countertop].roughness,
    }),
    floor: new THREE.MeshStandardMaterial({
      map: tex(floorSpec[config.floor].draw, 4, 4),
      roughness: floorSpec[config.floor].roughness,
    }),
    /* beige cálido 2026 para muros */
    wall: new THREE.MeshStandardMaterial({ color: '#e8dcc8', roughness: 0.96 }),
    kick: new THREE.MeshStandardMaterial({ color: '#242019', roughness: 0.8 }),
    /* acero inoxidable matte (electrodomésticos 2026) */
    metal: new THREE.MeshStandardMaterial({ color: '#a8a8a8', metalness: 0.85, roughness: 0.45 }),
    /* dorado cepillado (tiradores, grifería) */
    brass: new THREE.MeshStandardMaterial({ color: '#d4a574', metalness: 0.8, roughness: 0.35 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.55, roughness: 0.5 }),
    led: new THREE.MeshStandardMaterial({
      color: '#fff3e0',
      emissive: '#ffd9b3',
      emissiveIntensity: config.led ? 2.4 : 0,
    }),
    stoolWood: new THREE.MeshStandardMaterial({ color: '#c9a876', roughness: 0.55 }),
  }

  const api = {
    mats: m,

    setCabinetColor(id) {
      m.cabinet.color.set(cabinetHex[id])
    },

    setFinish(finish) {
      m.cabinet.roughness = finish === 'gloss' ? 0.16 : 0.62
      m.cabinet.needsUpdate = true
    },

    setCountertop(id) {
      const spec = counterSpec[id]
      m.stone.map = tex(spec.draw, 2, 1)
      m.stone.roughness = spec.roughness
      m.stone.needsUpdate = true
    },

    setFloor(id) {
      const spec = floorSpec[id]
      m.floor.map = tex(spec.draw, 4, 4)
      m.floor.roughness = spec.roughness
      m.floor.needsUpdate = true
    },

    setLed(on) {
      m.led.emissiveIntensity = on ? 2.4 : 0
    },

    dispose() {
      Object.values(m).forEach((mat) => mat.dispose())
      texCache.forEach((t) => t.dispose())
      texCache.clear()
    },
  }

  return api
}
