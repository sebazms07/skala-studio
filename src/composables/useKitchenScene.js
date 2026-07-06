import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import gsap from 'gsap'
import { buildKitchen, WALL } from '../lib/kitchen/buildKitchen'
import { createMaterials } from '../lib/kitchen/materials'

/* 2700K → 6500K (tendencias iluminación 2026) */
const WARM = new THREE.Color('#ffd9b3')
const COOL = new THREE.Color('#e8f0ff')
const BG_DAY = new THREE.Color('#efe8dd')
const BG_NIGHT = new THREE.Color('#121009')

/**
 * Escena Three.js del configurador. Devuelve null si no hay WebGL.
 * API: { updateConfig(config), dispose() }
 */
export function createKitchenScene(canvas, initial, { reduced = false } = {}) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    if (!renderer.getContext()) throw new Error('no webgl')
  } catch {
    return null
  }

  let config = { ...initial }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.92

  const scene = new THREE.Scene()
  scene.background = BG_DAY.clone()

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60)
  camera.position.set(3.9, 2.2, 4.4)

  const controls = new OrbitControls(camera, canvas)
  controls.target.set(-0.2, 0.85, -1.1)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.enablePan = false
  controls.minDistance = 3
  controls.maxDistance = 10
  controls.minPolarAngle = 0.35
  controls.maxPolarAngle = 1.5
  /* mantener la cámara en el cuadrante abierto (las paredes están en -x y -z) */
  controls.minAzimuthAngle = -0.15
  controls.maxAzimuthAngle = 1.72

  /* entrada suave de cámara */
  if (!reduced) {
    camera.position.set(5.6, 3.3, 6.4)
    gsap.to(camera.position, { x: 3.9, y: 2.2, z: 4.4, duration: 1.6, ease: 'expo.out' })
  }

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex

  const materials = createMaterials(config)
  const m = materials.mats

  /* ---- Habitación (persistente) ---- */
  const roomGeos = []
  const roomBox = (w, h, d, mat, x, y, z) => {
    const g = new THREE.BoxGeometry(w, h, d)
    roomGeos.push(g)
    const mesh = new THREE.Mesh(g, mat)
    mesh.position.set(x, y, z)
    mesh.receiveShadow = true
    scene.add(mesh)
    return mesh
  }
  roomBox(WALL * 2 + 0.2, 0.06, WALL * 2 + 0.2, m.floor, 0, -0.03, 0)
  roomBox(WALL * 2 + 0.2, 3.1, 0.12, m.wall, 0, 1.55, -WALL - 0.06)
  roomBox(0.12, 3.1, WALL * 2 + 0.2, m.wall, -WALL - 0.06, 1.55, 0)

  /* ---- Luces ---- */
  const key = new THREE.DirectionalLight(0xffffff, 1.5)
  key.position.set(3.8, 5.4, 2.8)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.left = key.shadow.camera.bottom = -6
  key.shadow.camera.right = key.shadow.camera.top = 6
  key.shadow.bias = -0.0004
  scene.add(key)

  const hemi = new THREE.HemisphereLight(0xfff2e2, 0x776a58, 0.3)
  scene.add(hemi)

  const fill = new THREE.PointLight(0xffe6c4, 0.5, 14, 1.6)
  fill.position.set(-1.4, 2.6, 2.0)
  scene.add(fill)

  /* ---- Cocina ---- */
  let kitchen = null

  function mountKitchen(layout, animate) {
    const old = kitchen
    kitchen = buildKitchen(layout, m)
    scene.add(kitchen.group)
    applyLighting()

    if (animate && !reduced) {
      kitchen.group.scale.setScalar(0.001)
      gsap.to(kitchen.group.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'expo.out' })
    }
    if (old) {
      const remove = () => {
        scene.remove(old.group)
        old.dispose()
      }
      if (animate && !reduced) {
        gsap.to(old.group.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.3, ease: 'power2.in', onComplete: remove })
      } else remove()
    }
  }

  function applyLighting() {
    const f = 0.35 + config.intensity * 0.95
    const col = WARM.clone().lerp(COOL, config.temperature)
    key.color.copy(col)
    key.intensity = (config.night ? 0.18 : 1.25) * f
    hemi.intensity = (config.night ? 0.04 : 0.2) * f
    fill.color.copy(col)
    fill.intensity = (config.night ? 0.75 : 0.4) * f
    scene.environmentIntensity = (config.night ? 0.1 : 0.5) * f
    const bg = config.night ? BG_NIGHT : BG_DAY
    if (reduced) scene.background.copy(bg)
    else gsap.to(scene.background, { r: bg.r, g: bg.g, b: bg.b, duration: 0.6, ease: 'power2.out' })
    const ledOn = config.led
    materials.setLed(ledOn)
    kitchen?.ledLights.forEach((l) => (l.intensity = ledOn ? (config.night ? 1.7 : 1.0) : 0))
  }

  mountKitchen(config.layout, false)

  /* ---- API de actualización ---- */
  function updateConfig(next) {
    const prev = config
    config = { ...next }
    if (next.layout !== prev.layout) mountKitchen(next.layout, true)
    if (next.cabinetColor !== prev.cabinetColor) materials.setCabinetColor(next.cabinetColor)
    if (next.finish !== prev.finish) materials.setFinish(next.finish)
    if (next.countertop !== prev.countertop) materials.setCountertop(next.countertop)
    if (next.floor !== prev.floor) materials.setFloor(next.floor)
    applyLighting()
  }

  /* ---- Loop pausable ---- */
  let running = false
  let rafId = 0

  function frame() {
    if (!running) return
    controls.update()
    renderer.render(scene, camera)
    rafId = requestAnimationFrame(frame)
  }

  function start() {
    if (running) return
    running = true
    rafId = requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    cancelAnimationFrame(rafId)
  }

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
  io.observe(canvas)

  const onVis = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVis)

  /* ---- Resize ---- */
  function resize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // en portrait el FOV horizontal se estrecha: abrir el vertical para compensar
    camera.fov = w / h < 0.9 ? 58 : 42
    camera.updateProjectionMatrix()
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  return {
    updateConfig,
    dispose() {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      gsap.killTweensOf(camera.position)
      controls.dispose()
      kitchen?.dispose()
      if (kitchen) scene.remove(kitchen.group)
      roomGeos.forEach((g) => g.dispose())
      materials.dispose()
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
