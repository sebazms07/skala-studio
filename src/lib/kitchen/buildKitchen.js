import * as THREE from 'three'

/* Dimensiones (metros) */
const D = 0.62 // profundidad gabinete bajo
const BODY_H = 0.78
const KICK_H = 0.1
const TOP_Y = KICK_H + BODY_H // 0.88
const COUNTER_H = 0.045
const UP_Y0 = 1.45 // arranque gabinetes altos
const UP_H = 0.72
const UP_D = 0.34
export const WALL = 3.2 // media habitación

/**
 * Construye la cocina paramétrica según la distribución.
 * Materiales compartidos (m = api de createMaterials().mats).
 * Devuelve { group, ledLights, dispose } — dispose libera solo geometrías.
 */
export function buildKitchen(layout, m) {
  const geos = []
  const group = new THREE.Group()
  const ledLights = []

  const box = (w, h, d, mat, x, y, z, { parent = group, shadow = true } = {}) => {
    const g = new THREE.BoxGeometry(w, h, d)
    geos.push(g)
    const mesh = new THREE.Mesh(g, mat)
    mesh.position.set(x, y, z)
    mesh.castShadow = shadow
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }

  const cyl = (r, h, mat, x, y, z, { parent = group, rx = 0, seg = 20 } = {}) => {
    const g = new THREE.CylinderGeometry(r, r, h, seg)
    geos.push(g)
    const mesh = new THREE.Mesh(g, mat)
    mesh.position.set(x, y, z)
    mesh.rotation.x = rx
    mesh.castShadow = false
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }

  /* ---- Módulos (en coordenadas locales del run: X a lo largo,
          z=0 contra la pared, frente hacia +Z).
          drop: desplaza la encimera unos mm hacia abajo para evitar
          z-fighting donde dos encimeras se cruzan en una esquina. ---- */

  function run(
    len,
    { sinkAt = null, stoveAt = null, uppers = [], backsplash = true, drop = 0 } = {}
  ) {
    const rg = new THREE.Group()

    box(len - 0.06, KICK_H, D - 0.08, m.kick, 0, KICK_H / 2, D / 2 - 0.02, { parent: rg })
    box(len, BODY_H, D, m.cabinet, 0, KICK_H + BODY_H / 2, D / 2, { parent: rg })
    box(len + 0.05, COUNTER_H, D + 0.06, m.stone, 0, TOP_Y + COUNTER_H / 2 - drop, D / 2 + 0.015, {
      parent: rg,
    })
    if (backsplash) {
      box(len, 0.55, 0.025, m.stone, 0, TOP_Y + COUNTER_H + 0.275, 0.02, { parent: rg })
    }

    /* tiradores de puertas — dorado cepillado */
    const doors = Math.max(2, Math.round(len / 0.5))
    for (let i = 0; i < doors; i++) {
      const x = -len / 2 + (len / doors) * (i + 0.5)
      box(0.16, 0.018, 0.018, m.brass, x, TOP_Y - 0.09, D + 0.012, {
        parent: rg,
        shadow: false,
      })
    }

    /* gabinetes altos + tira LED */
    for (const seg of uppers) {
      const c = (seg.from + seg.to) / 2
      const sl = seg.to - seg.from
      box(sl, UP_H, UP_D, m.cabinet, c, UP_Y0 + UP_H / 2, UP_D / 2, { parent: rg })
      const nd = Math.max(1, Math.round(sl / 0.5))
      for (let i = 0; i < nd; i++) {
        const x = c - sl / 2 + (sl / nd) * (i + 0.5)
        box(0.14, 0.016, 0.016, m.brass, x, UP_Y0 + 0.07, UP_D + 0.012, {
          parent: rg,
          shadow: false,
        })
      }
      box(sl - 0.05, 0.02, 0.05, m.led, c, UP_Y0 - 0.012, UP_D - 0.03, {
        parent: rg,
        shadow: false,
      })
      const pl = new THREE.PointLight(0xffd9b3, 0, 2.4, 1.8)
      pl.position.set(c, UP_Y0 - 0.1, UP_D + 0.25)
      rg.add(pl)
      ledLights.push(pl)
    }

    /* estufa + campana */
    if (stoveAt !== null) {
      box(0.62, 0.015, 0.52, m.darkMetal, stoveAt, TOP_Y + COUNTER_H + 0.008, D / 2 + 0.015, {
        parent: rg,
        shadow: false,
      })
      for (const [dx, dz] of [[-0.15, -0.12], [0.15, -0.12], [-0.15, 0.14], [0.15, 0.14]]) {
        cyl(0.07, 0.014, m.kick, stoveAt + dx, TOP_Y + COUNTER_H + 0.02, D / 2 + 0.015 + dz, {
          parent: rg,
        })
      }
      box(0.72, 0.07, 0.48, m.metal, stoveAt, 1.5, 0.26, { parent: rg })
      box(0.5, 0.2, 0.36, m.metal, stoveAt, 1.63, 0.2, { parent: rg })
      box(0.24, 1.0, 0.24, m.metal, stoveAt, 2.25, 0.14, { parent: rg })
    }

    if (sinkAt !== null) addSink(rg, sinkAt, D / 2 + 0.015)
    return rg
  }

  function addSink(parent, x, z) {
    box(0.58, 0.014, 0.42, m.darkMetal, x, TOP_Y + COUNTER_H + 0.007, z, {
      parent,
      shadow: false,
    })
    /* grifería dorado cepillado */
    cyl(0.02, 0.3, m.brass, x - 0.22, TOP_Y + COUNTER_H + 0.15, z - 0.14, { parent })
    cyl(0.016, 0.22, m.brass, x - 0.22, TOP_Y + COUNTER_H + 0.3, z - 0.03, {
      parent,
      rx: Math.PI / 2,
    })
  }

  function tallUnit(x, z) {
    const tg = new THREE.Group()
    box(0.68, 2.14, 0.66, m.cabinet, 0, 1.07, 0.33, { parent: tg })
    box(0.6, 1.86, 0.03, m.metal, 0, 1.12, 0.67, { parent: tg, shadow: false })
    box(0.02, 0.7, 0.025, m.brass, -0.12, 1.45, 0.69, { parent: tg, shadow: false })
    tg.position.set(x, 0, z)
    group.add(tg)
  }

  function island(cx, cz) {
    const ig = new THREE.Group()
    const IW = 2.2
    const ID = 1.0
    box(IW - 0.06, KICK_H, ID - 0.08, m.kick, 0, KICK_H / 2, 0, { parent: ig })
    box(IW, BODY_H, ID, m.cabinet, 0, KICK_H + BODY_H / 2, 0, { parent: ig })
    box(IW + 0.15, COUNTER_H, ID + 0.15, m.stone, 0, TOP_Y + COUNTER_H / 2, 0, { parent: ig })
    /* laterales cascada de piedra */
    for (const s of [-1, 1]) {
      box(0.045, TOP_Y, ID + 0.15, m.stone, s * (IW / 2 + 0.05), TOP_Y / 2, 0, { parent: ig })
    }
    addSink(ig, 0.35, -0.05)
    /* bancos */
    for (const bx of [-0.7, 0, 0.7]) {
      cyl(0.19, 0.05, m.stoolWood, bx, 0.66, ID / 2 + 0.38, { parent: ig })
      cyl(0.024, 0.62, m.metal, bx, 0.33, ID / 2 + 0.38, { parent: ig })
      cyl(0.15, 0.02, m.metal, bx, 0.012, ID / 2 + 0.38, { parent: ig })
    }
    ig.position.set(cx, 0, cz)
    group.add(ig)
  }

  const place = (rg, x, z, ry) => {
    rg.position.set(x, 0, z)
    rg.rotation.y = ry
    group.add(rg)
  }

  /* ---- Distribuciones ---- */
  const backFull = { stoveAt: 1.1, uppers: [{ from: -2.3, to: 0.55 }, { from: 1.65, to: 2.3 }] }
  /* run lateral que llega hasta la esquina (z de -3.2 a 0.4) */
  const sideRun = () =>
    run(3.6, { sinkAt: 0.3, uppers: [{ from: -1.7, to: 1.7 }], drop: 0.002 })

  if (layout === 'linear') {
    place(run(4.6, { ...backFull, sinkAt: -1.2 }), -0.5, -WALL, 0)
    tallUnit(2.35, -WALL)
  } else if (layout === 'island') {
    place(run(4.6, backFull), -0.5, -WALL, 0)
    tallUnit(2.35, -WALL)
    island(0.1, -0.85)
  } else if (layout === 'l') {
    place(run(4.6, backFull), -0.5, -WALL, 0)
    tallUnit(2.35, -WALL)
    place(sideRun(), -WALL, -1.4, Math.PI / 2)
  } else if (layout === 'u') {
    /* frente trasero de pared a pared para que la U sea continua */
    place(
      run(6.4, {
        stoveAt: 0,
        uppers: [{ from: -3.05, to: -0.6 }, { from: 0.6, to: 3.05 }],
      }),
      0,
      -WALL,
      0
    )
    place(sideRun(), -WALL, -1.4, Math.PI / 2)
    /* península derecha, sin pared: sin backsplash ni altos */
    place(run(3.6, { backsplash: false, drop: 0.004 }), WALL, -1.4, -Math.PI / 2)
  }

  return {
    group,
    ledLights,
    dispose() {
      geos.forEach((g) => g.dispose())
    },
  }
}
