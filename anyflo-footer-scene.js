/* anyflo-footer-scene.js
 * Where: Page Settings → Before </body>  (Home, after anyflo-footer.js) as <script type="module">
 * Targets: .anyflo-footer-background (made by anyflo-footer.js) — WebGL scene instead of the footer video
 * Needs: Anyflo.off('video') returning true so anyflo-footer.js never loads the mp4
 */
const CDN = "https://cdn.jsdelivr.net/npm/three@0.160.0";
// "footer bg.html" = graphs-up preset; chart points from addChartLine on anyflo.vercel.app
const CONFIG = {"bg": "#EAE9E5", "size": 2048, "camera": {"position": [0, 0, 900], "target": [0, 0, 0]}, "objects": [{"color": "#C8B8DD", "thickness": 32, "trailLength": 0.55, "trailSpeed": 0.18, "trailHead": 0.245, "taper": 1, "yStart": -280, "yEnd": 100, "zigzagAmp": 110, "steps": 7}, {"color": "#87BAC7", "thickness": 32, "trailLength": 0.55, "trailSpeed": 0.22, "trailHead": 0.649, "taper": 1, "yStart": -100, "yEnd": 220, "zigzagAmp": 85, "steps": 6}, {"color": "#ADCEA6", "thickness": 32, "trailLength": 0.55, "trailSpeed": 0.16, "trailHead": 0.867, "taper": 1, "yStart": 80, "yEnd": 340, "zigzagAmp": 65, "steps": 5}]};
// Figma 793:4622 (1600px frame): 2147px square rotated -15deg, centred (1027.87, 1196.13) from the FAQ top-left
const SIDE = 2147 / 1600, CX = 1027.87 / 1600, CY = 1196.13 / 1600, MAX_FB = 2560;
const MOBILE = { side: 2.8, cx: 0.5, cy: 0.8 };
let THREE, EffectComposer, RenderPass, ShaderPass, OutputPass;
function makeNoiseShader(CONFIG) { return {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(CONFIG.size, CONFIG.size) },
    bgColor: { value: new THREE.Color(CONFIG.bg) },
    seedOffset: { value: 0 },
  },
  vertexShader: "\n    varying vec2 vUv;\n    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\n  ",
  fragmentShader: "\n    uniform sampler2D tDiffuse;\n    uniform vec2 resolution;\n    uniform vec3 bgColor;\n    uniform float useBg;\n    uniform float seedOffset;\n    varying vec2 vUv;\n\n    const float baseFreq = 0.3500;\n    const int OCTAVES = 3;\n    const float dispScale = 54.00;\n    const float contrast = 12.00;\n\n    // Ashima 2D simplex noise -------------------------------------\n    vec3 mod289_3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }\n    vec2 mod289_2(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }\n    vec3 permute(vec3 x) { return mod289_3(((x*34.0)+1.0)*x); }\n    float snoise(vec2 v) {\n      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);\n      vec2 i = floor(v + dot(v, C.yy));\n      vec2 x0 = v - i + dot(i, C.xx);\n      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n      vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;\n      i = mod289_2(i);\n      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));\n      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n      m = m*m; m = m*m;\n      vec3 x = 2.0 * fract(p * C.www) - 1.0;\n      vec3 h = abs(x) - 0.5;\n      vec3 ox = floor(x + 0.5);\n      vec3 a0 = x - ox;\n      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);\n      vec3 g;\n      g.x = a0.x * x0.x + h.x * x0.y;\n      g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n      return 130.0 * dot(m, g);\n    }\n    float fractalNoise(vec2 p) {\n      float v = 0.0, amp = 1.0, total = 0.0;\n      vec2 freq = p;\n      for (int i = 0; i < 5; i++) {\n        if (i >= OCTAVES) break;\n        v += snoise(freq) * amp;\n        total += amp;\n        amp *= 0.5;\n        freq *= 2.0;\n      }\n      return v / max(total, 0.0001);\n    }\n    // -------------------------------------------------------------\n\n    void main() {\n      // Resolution-independent noise: sample in a fixed 2048-pixel reference\n      // space regardless of the framebuffer's actual size. This keeps the noise\n      // pattern visually identical at 1x preview, 2x export, and 4x export\n      // (otherwise feature size and displacement stay fixed in framebuffer\n      // pixels and shrink relative to the shape as the framebuffer grows).\n      const float REF = 2048.0;\n      vec2 pix = vUv * REF;\n      vec2 nin1 = pix * baseFreq + vec2(seedOffset, seedOffset * 0.7);\n      vec2 nin2 = pix * baseFreq + vec2(seedOffset + 127.1, seedOffset - 311.7);\n      vec2 noise = vec2(fractalNoise(nin1), fractalNoise(nin2));\n      vec2 dispUv = noise * dispScale / REF;\n      vec4 c = texture2D(tDiffuse, vUv + dispUv);\n      // Threshold the alpha (matches SVG feComponentTransfer linear).\n      float a = clamp(contrast * c.a - (contrast - 1.0) * 0.5, 0.0, 1.0);\n      // useBg=1 → composite over bgColor (opaque output); useBg=0 → transparent output (alpha = a).\n      vec3 outColor = mix(c.rgb, mix(bgColor, c.rgb, a), useBg);\n      float outAlpha = mix(a, 1.0, useBg);\n      gl_FragColor = vec4(outColor, outAlpha);\n    }\n  ",
}; }

function createTrailMaterial(color, trailLength = 0.18, radius = 25, taper = 1.0) {
  return new THREE.ShaderMaterial({
    uniforms: {
      head:        { value: 0 },
      trailLength: { value: trailLength },
      uColor:      { value: new THREE.Color(color) },
      uRadius:     { value: radius },
      uTaper:      { value: taper },
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float head;
      uniform float trailLength;
      uniform float uRadius;
      uniform float uTaper;
      void main() {
        vUv = uv;
        // Distance from head, wrapped to [0, 1).
        float u = uv.x;
        float d = head - u;
        d = d - floor(d);
        // Position along the trail: 0 at head, 1 at tail edge, >1 outside trail.
        // Outside the trail we clamp so vertices don't pop, but those pixels are
        // discarded in the fragment shader anyway.
        float trailPos = clamp(d / max(trailLength, 0.0001), 0.0, 1.0);
        // Smoothstep gives a nicer taper curve than a straight line.
        float t = smoothstep(0.0, 1.0, trailPos);
        float scale = 1.0 - t * uTaper;
        // The TubeGeometry's vertex normal points radially outward from the
        // centerline. Reconstruct the centerline by removing the original radius
        // offset, then re-displace at the (smaller) tapered radius.
        vec3 centerline = position - normal * uRadius;
        vec3 newPos     = centerline + normal * uRadius * scale;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float head;
      uniform float trailLength;
      uniform vec3 uColor;
      void main() {
        float u = vUv.x;
        float d = head - u;
        d = d - floor(d);
        if (d > trailLength) discard;
        gl_FragColor = vec4(uColor, 1.0);
      }
    `,
    side: THREE.DoubleSide,
    transparent: true,
  });
}


function chartLine(o) {
  const pts = [];
  for (let i = 0; i <= o.steps; i++) {
    const t = i / o.steps;
    const zig = (i % 2 === 0 ? -1 : 1) * o.zigzagAmp * Math.sin(t * Math.PI);
    pts.push(new THREE.Vector3(-900 + 1800 * t, o.yStart + (o.yEnd - o.yStart) * t + zig, 0));
  }
  const curve = new THREE.CurvePath();
  for (let i = 0; i < pts.length - 1; i++) curve.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
  return new THREE.TubeGeometry(curve, Math.max(96, pts.length * 12), o.thickness, 8, false);
}

function whenBackground() {
  return new Promise((resolve) => {
    const find = () => document.querySelector(".anyflo-footer-background");
    if (find()) return resolve(find());
    const mo = new MutationObserver(() => { if (find()) { mo.disconnect(); resolve(find()); } });
    mo.observe(document.body, { childList: true, subtree: true });
  });
}

async function mount() {
  if (!document.querySelector(".footer_component")) return;
  [THREE, { EffectComposer }, { RenderPass }, { ShaderPass }, { OutputPass }] = await Promise.all([
    import(CDN + "/+esm"),
    import(CDN + "/examples/jsm/postprocessing/EffectComposer.js/+esm"),
    import(CDN + "/examples/jsm/postprocessing/RenderPass.js/+esm"),
    import(CDN + "/examples/jsm/postprocessing/ShaderPass.js/+esm"),
    import(CDN + "/examples/jsm/postprocessing/OutputPass.js/+esm"),
  ]);
  const bg = await whenBackground();
  const canvas = document.createElement("canvas");
  canvas.className = "anyflo-footer-scene";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;display:block;max-width:none;pointer-events:none;transform:rotate(-15deg)";
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 1, 5000);
  camera.position.fromArray(CONFIG.camera.position);
  camera.lookAt(new THREE.Vector3().fromArray(CONFIG.camera.target));
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new ShaderPass(makeNoiseShader(CONFIG)));
  composer.addPass(new OutputPass());
  const objects = CONFIG.objects.map((o) => {
    const obj3d = new THREE.Mesh(chartLine(o), createTrailMaterial(o.color, o.trailLength, o.thickness, o.taper));
    scene.add(obj3d);
    return Object.assign({ obj3d }, o);
  });
  function fit() {
    const w = bg.clientWidth || 1;
    // phones (<=479px): a width-scaled scene is too thin there, so size it to MOBILE.side x width
    // and centre it at MOBILE.cy of the FAQ height
    const phone = window.matchMedia("(max-width: 479px)").matches;
    const faqH = (document.querySelector(".section_home-faq") || bg).offsetHeight;
    const m = Math.round(w * (phone ? MOBILE.side : SIDE));
    const dpr = Math.min(window.devicePixelRatio || 1, 2, MAX_FB / m);
    renderer.setPixelRatio(dpr);
    renderer.setSize(m, m, false);
    composer.setPixelRatio(dpr);
    composer.setSize(m, m);
    canvas.style.width = canvas.style.height = m + "px";
    canvas.style.left = Math.round(w * (phone ? MOBILE.cx : CX) - m / 2) + "px";
    canvas.style.top = Math.round((phone ? faqH * MOBILE.cy : w * CY) - m / 2) + "px";
  }
  function step(dt) {
    for (const o of objects) {
      o.trailHead = (o.trailHead + o.trailSpeed * dt) % 1;
      o.obj3d.material.uniforms.head.value = o.trailHead;
    }
    composer.render();
  }
  bg.appendChild(canvas);
  fit();
  new ResizeObserver(() => { fit(); step(0); }).observe(bg);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { step(0); return; }
  let visible = false, raf = 0, last = 0;
  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    step(dt);
    raf = requestAnimationFrame(tick);
  }
  function sync() {
    const run = visible && !document.hidden;
    if (run && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; sync(); }, { rootMargin: "200px 0px" }).observe(bg);
  document.addEventListener("visibilitychange", sync);
}
mount().catch((err) => console.warn("[anyflo-footer-scene]", err));
