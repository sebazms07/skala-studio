import * as THREE from 'three'
import { cabinetColors } from './presets'

/* ------------------------------------------------------------------
   Texturas procedurales (canvas) — sin assets externos.
------------------------------------------------------------------- */

const draws = {
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

  granite(ctx, s) {
    ctx.fillStyle = '#33302d'
    ctx.fillRect(0, 0, s, s)
    for (let i = 0; i < 5200; i++) {
      const v = Math.random()
      ctx.fillStyle =
        v > 0.965
          ? `rgba(226,220,208,${0.5 + Math.random() * 0.4})`
          : `rgba(${90 + Math.random() * 70},${85 + Math.random() * 62},${78 + Math.random() * 55},${0.25 + Math.random() * 0.4})`
      const r = 0.6 + Math.random() * 1.7
      ctx.beginPath()
      ctx.arc(Math.random() * s, Math.random() * s, r, 0, 7)
      ctx.fill()
    }
  },

  woodLight(ctx, s) {
    wood(ctx, s, '#d9c4a4', '#c4ab86', '#a98e6b')
  },

  woodWalnut(ctx, s) {
    wood(ctx, s, '#6e5238', '#5c4128', '#46311d')
  },

  concrete(ctx, s) {
    ctx.fillStyle = '#98938c'
    ctx.fillRect(0, 0, s, s)
    for (let i = 0; i < 240; i++) {
      const g = 120 + Math.random() * 60
      ctx.fillStyle = `rgba(${g},${g - 3},${g - 8},${0.04 + Math.random() * 0.07})`
      const r = 8 + Math.random() * 70
      ctx.beginPath()
      ctx.arc(Math.random() * s, Math.random() * s, r, 0, 7)
      ctx.fill()
    }
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(60,57,52,${Math.random() * 0.14})`
      ctx.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2)
    }
  },
}

function wood(ctx, s, base, grainA, grainB) {
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
    ctx.fillStyle = 'rgba(40,30,20,0.35)'
    ctx.fillRect(0, y0 + ph - 1.2, s, 1.6)
  }
}

/* ------------------------------------------------------------------ */

const counterSpec = {
  marble: { draw: 'marble', roughness: 0.26 },
  granite: { draw: 'granite', roughness: 0.36 },
  walnut: { draw: 'woodWalnut', roughness: 0.5 },
  concrete: { draw: 'concrete', roughness: 0.62 },
}

const floorSpec = {
  lightwood: { draw: 'woodLight', roughness: 0.72 },
  walnut: { draw: 'woodWalnut', roughness: 0.72 },
  concrete: { draw: 'concrete', roughness: 0.85 },
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
    wall: new THREE.MeshStandardMaterial({ color: '#ece4d8', roughness: 0.96 }),
    kick: new THREE.MeshStandardMaterial({ color: '#242019', roughness: 0.8 }),
    metal: new THREE.MeshStandardMaterial({ color: '#c9cbca', metalness: 0.88, roughness: 0.3 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: '#1f1d1b', metalness: 0.55, roughness: 0.42 }),
    led: new THREE.MeshStandardMaterial({
      color: '#fff3e0',
      emissive: '#ffc98a',
      emissiveIntensity: config.led ? 2.4 : 0,
    }),
    stoolWood: new THREE.MeshStandardMaterial({ color: '#8a6f52', roughness: 0.55 }),
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
