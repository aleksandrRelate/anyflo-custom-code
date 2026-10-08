/* anyflo-platform-scenes.js
 * Where: Page Settings → Before </body>  (Home) as <script type="module" src="…/anyflo-platform-scenes.js">
 * Targets: .home-platform_visual — a WebGL scene under each transparent .home-platform_image
 * Note:  scenes from "1/2/3 card bg.html" (anyflo.vercel.app), one per tab in tab order.
 *        Desktop: one canvas, scene follows .is-current. Mobile slides: each slide its own scene.
 *        Rendered only while on screen; one still frame on reduced motion.
 */
const CDN = "https://cdn.jsdelivr.net/npm/three@0.160.0";

// trail-circle plane and group spin come from the presets — the export drops them
const SCENES = [
  {
    "bg": "#EAE9E5",
    "size": 2048,
    "camera": {
      "position": [
        412.21,
        265.97,
        754.55
      ],
      "target": [
        0,
        0,
        0
      ]
    },
    "objects": [
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#C8B8DD",
        "size": 500,
        "thickness": 30,
        "rotation": [
          0,
          0,
          0
        ],
        "trailLength": 0.5,
        "trailSpeed": 0.1,
        "trailHead": 0.653,
        "taper": 1
      },
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#87BAC7",
        "size": 500,
        "thickness": 30,
        "rotation": [
          1.047198,
          0,
          0.785398
        ],
        "trailLength": 0.5,
        "trailSpeed": -0.08,
        "trailHead": 0.807,
        "taper": 1
      },
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#ADCEA6",
        "size": 500,
        "thickness": 30,
        "rotation": [
          -0.785398,
          0.628319,
          -0.523599
        ],
        "trailLength": 0.5,
        "trailSpeed": 0.12,
        "trailHead": 0.444,
        "taper": 1
      }
    ],
    "spin": {
      "x": 0,
      "y": 0.04
    }
  },
  {
    "bg": "#EAE9E5",
    "size": 2048,
    "camera": {
      "position": [
        412.21,
        265.97,
        754.55
      ],
      "target": [
        0,
        0,
        0
      ]
    },
    "objects": [
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#C8B8DD",
        "size": 260,
        "thickness": 30,
        "rotation": [
          0,
          0,
          0
        ],
        "trailLength": 0.5,
        "trailSpeed": 0.2,
        "trailHead": 0.735,
        "taper": 1
      },
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#87BAC7",
        "size": 260,
        "thickness": 30,
        "rotation": [
          0,
          1.047198,
          0
        ],
        "trailLength": 0.5,
        "trailSpeed": 0.28,
        "trailHead": 0.529,
        "taper": 1
      },
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#87BAC7",
        "size": 260,
        "thickness": 30,
        "rotation": [
          0,
          -1.047198,
          0
        ],
        "trailLength": 0.5,
        "trailSpeed": 0.16,
        "trailHead": 0.638,
        "taper": 1
      },
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#C8B8DD",
        "size": 260,
        "thickness": 30,
        "rotation": [
          0,
          0,
          0
        ],
        "trailLength": 0.5,
        "trailSpeed": 0.22,
        "trailHead": 0.609,
        "taper": 1,
        "plane": "xz"
      },
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#C8B8DD",
        "size": 260,
        "thickness": 30,
        "rotation": [
          0.785398,
          0,
          0.523599
        ],
        "trailLength": 0.5,
        "trailSpeed": -0.3,
        "trailHead": 0.197,
        "taper": 1
      }
    ],
    "spin": {
      "x": 0.04,
      "y": 0.1
    }
  },
  {
    "bg": "#EAE9E5",
    "size": 2048,
    "camera": {
      "position": [
        412.21,
        265.97,
        754.55
      ],
      "target": [
        0,
        0,
        0
      ]
    },
    "objects": [
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#C8B8DD",
        "size": 260,
        "thickness": 30,
        "rotation": [
          0,
          0,
          0
        ],
        "trailLength": 0.5,
        "trailSpeed": 0.2,
        "trailHead": 0.54,
        "taper": 1
      },
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#E2B68E",
        "size": 260,
        "thickness": 30,
        "rotation": [
          0,
          1.047198,
          0
        ],
        "trailLength": 0.5,
        "trailSpeed": 0.28,
        "trailHead": 0.056,
        "taper": 1
      },
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#87BAC7",
        "size": 260,
        "thickness": 30,
        "rotation": [
          0,
          -1.047198,
          0
        ],
        "trailLength": 0.5,
        "trailSpeed": 0.16,
        "trailHead": 0.082,
        "taper": 1
      },
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#ADCEA6",
        "size": 260,
        "thickness": 30,
        "rotation": [
          0,
          0,
          0
        ],
        "trailLength": 0.5,
        "trailSpeed": 0.22,
        "trailHead": 0.094,
        "taper": 1,
        "plane": "xz"
      },
      {
        "type": "trail-circle",
        "style": "trail",
        "color": "#C8B8DD",
        "size": 260,
        "thickness": 30,
        "rotation": [
          0.785398,
          0,
          0.523599
        ],
        "trailLength": 0.5,
        "trailSpeed": -0.3,
        "trailHead": 0.99,
        "taper": 1
      }
    ],
    "spin": {
      "x": 0.04,
      "y": 0.1
    }
  }
];

const SCENE_SCALE = 545.35 / 394;

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

// From anyflo.vercel.app — the export left trail-circle without geometry
function makeGreatCircleTube(radius, plane, tubeRadius, segments) {
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const t = i / segments * Math.PI * 2;
    const c = Math.cos(t), s = Math.sin(t);
    let p;
    if (plane === 'xy')      p = new THREE.Vector3(c * radius,  s * radius, 0);
    else if (plane === 'xz') p = new THREE.Vector3(c * radius,  0,          s * radius);
    else                     p = new THREE.Vector3(0,           s * radius, c * radius);
    pts.push(p);
  }
  const curve = new THREE.CatmullRomCurve3(pts, true);
  return new THREE.TubeGeometry(curve, segments * 3, tubeRadius, 8, true);
}

// ---- mount ---------------------------------------------------
function createScene(CONFIG) {
  const canvas = document.createElement("canvas");
  canvas.className = "home-platform_scene";
  canvas.setAttribute("aria-hidden", "true");
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

  const group = new THREE.Group();
  scene.add(group);
  const objects = CONFIG.objects.map((o) => {
    const obj3d = new THREE.Mesh(
      makeGreatCircleTube(o.size, o.plane || "xy", o.thickness, 128),
      createTrailMaterial(o.color, o.trailLength, o.thickness, o.taper)
    );
    obj3d.rotation.set(o.rotation[0], o.rotation[1], o.rotation[2]);
    group.add(obj3d);
    return Object.assign({ obj3d }, o);
  });

  return {
    canvas,
    // Figma 896:745: 545.35px square centred on a 297.9×394 card, clipped by it
    resize(w, h) {
      const m = Math.round(h * SCENE_SCALE) || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(m, m, false);
      composer.setPixelRatio(dpr);
      composer.setSize(m, m);
      canvas.style.width = m + "px";
      canvas.style.height = m + "px";
    },
    step(dt) {
      group.rotation.y += CONFIG.spin.y * dt;
      group.rotation.x += CONFIG.spin.x * dt;
      for (const o of objects) {
        o.trailHead = ((o.trailHead || 0) + (o.trailSpeed || 0) * dt);
        o.trailHead = o.trailHead - Math.floor(o.trailHead);
        const u = o.obj3d.material.uniforms;
        u.head.value = o.trailHead;
        u.trailLength.value = o.trailLength;
        u.uTaper.value = o.taper;
      }
      composer.render();
    },
  };
}

const STYLE = `
.home-platform_visual { position: relative; }
.home-platform_scene-layer {
  position: absolute; inset: 0; z-index: 0;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; border-radius: inherit; pointer-events: none;
}
.home-platform_scene { flex: none; display: block; }
.home-platform_visual > .home-platform_image { position: relative; z-index: 1; }
`;

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sources = [];

// which tab a visual shows: the .is-current image (desktop) or its only image (mobile slide)
function sceneIndex(visual) {
  const imgs = visual.querySelectorAll(".home-platform_image");
  const img = visual.querySelector(".home-platform_image.is-current") || imgs[0];
  const i = sources.indexOf(img && img.currentSrc ? img.currentSrc : img && img.src);
  return Math.max(0, Math.min(SCENES.length - 1, i));
}

// One live scene per tab for the whole page. Its canvas moves to whichever card is showing
// it (desktop card, or the active mobile slide, clones included), so the animation pauses and
// resumes where it was instead of restarting, and the page never holds more than 3 WebGL contexts.
const shared = [];
function sceneFor(i) {
  return shared[i] || (shared[i] = Object.assign(createScene(structuredClone(SCENES[i])), { owner: null }));
}

function attach(visual) {
  const layer = document.createElement("div");
  layer.className = "home-platform_scene-layer";
  layer.setAttribute("aria-hidden", "true");
  visual.prepend(layer);
  // a 2D copy of a frame, shown while the live canvas is in another card
  const still = document.createElement("canvas");
  still.className = "home-platform_scene";
  layer.appendChild(still);

  const tab = visual.closest(".home-platform_tab");
  let visible = false, raf = 0, last = 0, scene = null;

  // WebGL frames can only be copied right after drawing, so redraw (without advancing) first
  function freeze() {
    scene.step(0);
    still.width = scene.canvas.width;
    still.height = scene.canvas.height;
    still.style.width = scene.canvas.style.width;
    still.style.height = scene.canvas.style.height;
    still.getContext("2d").drawImage(scene.canvas, 0, 0);
    layer.replaceChildren(still);
  }
  const card = { release() { freeze(); stop(); } };

  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    scene.step(dt);
    raf = requestAnimationFrame(tick);
  }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  function sync() {
    if (!visible) return stop();
    const next = sceneFor(sceneIndex(visual));
    if (scene && scene !== next && scene.owner === card) { scene.owner = null; stop(); }
    scene = next;
    const active = !document.hidden && (!tab || tab.classList.contains("is-active"));
    if (active) {
      if (scene.owner !== card) {
        if (scene.owner) scene.owner.release();
        scene.owner = card;
        layer.replaceChildren(scene.canvas);
        scene.resize(visual.clientWidth, visual.clientHeight);
        scene.step(0);
      }
      if (!reduced && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    } else {
      stop();
      // on screen but not active (the next mobile slide peeking in): show a frame of it
      if (scene.owner !== card && !still.width) {
        if (!scene.owner) scene.resize(visual.clientWidth, visual.clientHeight);
        freeze();
      }
    }
  }

  new IntersectionObserver((e) => { visible = e[0].isIntersecting; sync(); }).observe(visual);
  new ResizeObserver(() => {
    if (scene && scene.owner === card) { scene.resize(visual.clientWidth, visual.clientHeight); scene.step(0); }
  }).observe(visual);
  // tabs move .is-current between images (desktop card)
  new MutationObserver(sync).observe(visual, { subtree: true, attributes: true, attributeFilter: ["class"] });
  if (tab) new MutationObserver(sync).observe(tab, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", sync);
}

async function mount() {
  const main = document.querySelector(".home-platform_content > .home-platform_visual");
  if (!main) return;
  document.head.appendChild(Object.assign(document.createElement("style"), { textContent: STYLE }));
  sources.push(...[...main.querySelectorAll(".home-platform_image")].map((img) => img.currentSrc || img.src));

  [THREE, { EffectComposer }, { RenderPass }, { ShaderPass }, { OutputPass }] = await Promise.all([
    import(CDN + "/+esm"),
    import(CDN + "/examples/jsm/postprocessing/EffectComposer.js/+esm"),
    import(CDN + "/examples/jsm/postprocessing/RenderPass.js/+esm"),
    import(CDN + "/examples/jsm/postprocessing/ShaderPass.js/+esm"),
    import(CDN + "/examples/jsm/postprocessing/OutputPass.js/+esm"),
  ]);
  // main visual + the mobile slide copies anyflo-page.js makes inside each tab
  document.querySelectorAll(".home-platform_visual").forEach(attach);
}

mount().catch((err) => console.warn("[anyflo-platform-scenes] no card scenes:", err));
