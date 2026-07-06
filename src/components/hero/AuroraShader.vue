<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Fondo aurora/ondas fluidas (estilo 21st.dev) en WebGL puro.
 * Fallback: gradiente CSS animado si no hay WebGL o prefers-reduced-motion.
 */
const canvas = ref(null)
const fallback = ref(false)

let gl = null
let rafId = 0
let running = false
let startTime = 0
let observer = null
let onResize = null

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0);
  float t = u_time * 0.05;

  float n1 = fbm(p * 1.3 + vec2(t, -t * 0.6));
  float n2 = fbm(p * 2.1 - vec2(t * 0.8, t * 0.4) + n1 * 1.4);

  vec3 cream = vec3(0.980, 0.961, 0.949);
  vec3 taupe = vec3(0.659, 0.573, 0.447);
  vec3 deep  = vec3(0.482, 0.400, 0.298);

  vec3 col = mix(cream, taupe, smoothstep(0.28, 0.9, n1));
  col = mix(col, deep, smoothstep(0.55, 0.98, n2) * 0.5);

  /* aclara la parte superior para legibilidad del texto */
  col = mix(col, cream, smoothstep(0.45, 1.0, uv.y) * 0.55);

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('AuroraShader:', gl.getShaderInfoLog(sh))
    return null
  }
  return sh
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  gl = !reduced ? canvas.value.getContext('webgl', { antialias: false }) : null

  if (!gl) {
    fallback.value = true
    return
  }

  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) {
    fallback.value = true
    return
  }

  const prog = gl.createProgram()
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'a_pos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const uTime = gl.getUniformLocation(prog, 'u_time')
  const uRes = gl.getUniformLocation(prog, 'u_res')

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = canvas.value.clientWidth
    const h = canvas.value.clientHeight
    canvas.value.width = Math.round(w * dpr * 0.75)
    canvas.value.height = Math.round(h * dpr * 0.75)
    gl.viewport(0, 0, canvas.value.width, canvas.value.height)
  }

  startTime = performance.now()

  function frame(now) {
    if (!running) return
    gl.uniform1f(uTime, (now - startTime) / 1000)
    gl.uniform2f(uRes, canvas.value.width, canvas.value.height)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    rafId = requestAnimationFrame(frame)
  }

  resize()
  onResize = resize
  window.addEventListener('resize', onResize, { passive: true })

  /* pausa cuando el hero no es visible */
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) {
      running = true
      rafId = requestAnimationFrame(frame)
    } else if (!entry.isIntersecting) {
      running = false
      cancelAnimationFrame(rafId)
    }
  })
  observer.observe(canvas.value)
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(rafId)
  observer?.disconnect()
  if (onResize) window.removeEventListener('resize', onResize)
  gl?.getExtension('WEBGL_lose_context')?.loseContext()
  gl = null
})
</script>

<template>
  <div class="aurora" :class="{ 'aurora--fallback': fallback }">
    <canvas v-if="!fallback" ref="canvas" class="aurora__canvas"></canvas>
  </div>
</template>

<style scoped>
.aurora {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.aurora__canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.aurora--fallback {
  background:
    radial-gradient(120% 90% at 15% 85%, rgba(138, 116, 88, 0.55) 0%, transparent 55%),
    radial-gradient(110% 80% at 85% 75%, rgba(168, 146, 114, 0.6) 0%, transparent 60%),
    var(--color-background);
}
</style>
