/* anyflo-hero-scene.js
 * Where: Page Settings → Before </body>  (Home) as <script type="module" src="…/anyflo-hero-scene.js">
 * Targets: .home-hero_background — the WebGL scene replaces .home-hero_video once it starts
 * Note:  scene code from "hero scene.html"; no OrbitControls, transparent bg, sized to the hero,
 *        paused off-screen / in hidden tabs, one still frame on reduced motion,
 *        the video stays if WebGL or the CDN fails
 */
const CDN = "https://cdn.jsdelivr.net/npm/three@0.160.0";
// sphere-trails preset on anyflo.vercel.app spins the whole group; the export dropped it
const COMPOSITION_SPIN = { x: 0.04, y: 0.10 };

const CONFIG = {
  "bg": "#EAE9E5",
  "size": 2048,
  "camera": {
    "position": [
      504.79122797316234,
      325.7027686753387,
      924.0141448330254
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
      "color": "#87BAC7",
      "colors": null,
      "colorMode": "single",
      "size": 260,
      "thickness": 30,
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "spinX": 0,
      "spinY": 0,
      "spinZ": 0,
      "panX": 0,
      "panY": 0,
      "panZ": 0,
      "panRange": 800,
      "trailLength": 0.5,
      "trailSpeed": 0.2,
      "trailHead": 0.8379999999999759,
      "taper": 1
    },
    {
      "type": "trail-circle",
      "style": "trail",
      "color": "#ADCEA6",
      "colors": null,
      "colorMode": "single",
      "size": 260,
      "thickness": 30,
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        0,
        1.0471975511965976,
        0
      ],
      "spinX": 0,
      "spinY": 0,
      "spinZ": 0,
      "panX": 0,
      "panY": 0,
      "panZ": 0,
      "panRange": 800,
      "trailLength": 0.5,
      "trailSpeed": 0.28,
      "trailHead": 0.8731999999999879,
      "taper": 1
    },
    {
      "type": "trail-circle",
      "style": "trail",
      "color": "#87BAC7",
      "colors": null,
      "colorMode": "single",
      "size": 260,
      "thickness": 30,
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        0,
        -1.0471975511965976,
        0
      ],
      "spinX": 0,
      "spinY": 0,
      "spinZ": 0,
      "panX": 0,
      "panY": 0,
      "panZ": 0,
      "panRange": 800,
      "trailLength": 0.5,
      "trailSpeed": 0.16,
      "trailHead": 0.1203999999999911,
      "taper": 1
    },
    {
      "type": "trail-circle",
      "plane": "xz",
      "style": "trail",
      "color": "#ADCEA6",
      "colors": null,
      "colorMode": "single",
      "size": 260,
      "thickness": 30,
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        0,
        0,
        0
      ],
      "spinX": 0,
      "spinY": 0,
      "spinZ": 0,
      "panX": 0,
      "panY": 0,
      "panZ": 0,
      "panRange": 800,
      "trailLength": 0.5,
      "trailSpeed": 0.22,
      "trailHead": 0.021800000000029407,
      "taper": 1
    },
    {
      "type": "trail-circle",
      "style": "trail",
      "color": "#87BAC7",
      "colors": null,
      "colorMode": "single",
      "size": 260,
      "thickness": 30,
      "position": [
        0,
        0,
        0
      ],
      "rotation": [
        0.7853981633974483,
        0,
        0.5235987755982988
      ],
      "spinX": 0,
      "spinY": 0,
      "spinZ": 0,
      "panX": 0,
      "panY": 0,
      "panZ": 0,
      "panRange": 800,
      "trailLength": 0.5,
      "trailSpeed": -0.3,
      "trailHead": 0.5429999999999796,
      "taper": 1
    }
  ]
};

function makeNoiseShader() { return {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(CONFIG.size, CONFIG.size) },
    bgColor: { value: new THREE.Color(CONFIG.bg) },
    seedOffset: { value: 0 },
  },
  vertexShader: "\n    varying vec2 vUv;\n    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\n  ",
  fragmentShader: "\n    uniform sampler2D tDiffuse;\n    uniform vec2 resolution;\n    uniform vec3 bgColor;\n    uniform float useBg;\n    uniform float seedOffset;\n    varying vec2 vUv;\n\n    const float baseFreq = 0.3500;\n    const int OCTAVES = 3;\n    const float dispScale = 54.00;\n    const float contrast = 12.00;\n\n    // Ashima 2D simplex noise -------------------------------------\n    vec3 mod289_3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }\n    vec2 mod289_2(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }\n    vec3 permute(vec3 x) { return mod289_3(((x*34.0)+1.0)*x); }\n    float snoise(vec2 v) {\n      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);\n      vec2 i = floor(v + dot(v, C.yy));\n      vec2 x0 = v - i + dot(i, C.xx);\n      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n      vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;\n      i = mod289_2(i);\n      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));\n      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n      m = m*m; m = m*m;\n      vec3 x = 2.0 * fract(p * C.www) - 1.0;\n      vec3 h = abs(x) - 0.5;\n      vec3 ox = floor(x + 0.5);\n      vec3 a0 = x - ox;\n      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);\n      vec3 g;\n      g.x = a0.x * x0.x + h.x * x0.y;\n      g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n      return 130.0 * dot(m, g);\n    }\n    float fractalNoise(vec2 p) {\n      float v = 0.0, amp = 1.0, total = 0.0;\n      vec2 freq = p;\n      for (int i = 0; i < 5; i++) {\n        if (i >= OCTAVES) break;\n        v += snoise(freq) * amp;\n        total += amp;\n        amp *= 0.5;\n        freq *= 2.0;\n      }\n      return v / max(total, 0.0001);\n    }\n    // -------------------------------------------------------------\n\n    void main() {\n      // Resolution-independent noise: sample in a fixed 2048-pixel reference\n      // space regardless of the framebuffer's actual size. This keeps the noise\n      // pattern visually identical at 1x preview, 2x export, and 4x export\n      // (otherwise feature size and displacement stay fixed in framebuffer\n      // pixels and shrink relative to the shape as the framebuffer grows).\n      const float REF = 2048.0;\n      vec2 pix = vUv * REF;\n      vec2 nin1 = pix * baseFreq + vec2(seedOffset, seedOffset * 0.7);\n      vec2 nin2 = pix * baseFreq + vec2(seedOffset + 127.1, seedOffset - 311.7);\n      vec2 noise = vec2(fractalNoise(nin1), fractalNoise(nin2));\n      vec2 dispUv = noise * dispScale / REF;\n      vec4 c = texture2D(tDiffuse, vUv + dispUv);\n      // Threshold the alpha (matches SVG feComponentTransfer linear).\n      float a = clamp(contrast * c.a - (contrast - 1.0) * 0.5, 0.0, 1.0);\n      // useBg=1 → composite over bgColor (opaque output); useBg=0 → transparent output (alpha = a).\n      vec3 outColor = mix(c.rgb, mix(bgColor, c.rgb, a), useBg);\n      float outAlpha = mix(a, 1.0, useBg);\n      gl_FragColor = vec4(outColor, outAlpha);\n    }\n  ",
}; }

const OUTLINE_GENERATORS = {
  sphere(size) {
    const r = size, curves = [];
    for (const axis of ['xz', 'xy', 'yz']) {
      const pts = [];
      for (let i = 0; i <= 64; i++) {
        const t = i / 64 * Math.PI * 2;
        const c = Math.cos(t), s = Math.sin(t);
        if (axis === 'xz') pts.push([c * r, 0, s * r]);
        else if (axis === 'xy') pts.push([c * r, s * r, 0]);
        else pts.push([0, s * r, c * r]);
      }
      curves.push({ pts, closed: true });
    }
    return curves;
  },
  cube(size) {
    const h = size * 0.7;
    const v = [
      [-h,-h,-h],[ h,-h,-h],[ h, h,-h],[-h, h,-h],
      [-h,-h, h],[ h,-h, h],[ h, h, h],[-h, h, h],
    ];
    const e = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    return e.map(([a,b]) => ({ pts: [v[a], v[b]], closed: false }));
  },
  torus(size) {
    const R = size, r = size * 0.32;
    const curves = [];
    for (let i = 0; i < 16; i++) {
      const u = i / 16 * Math.PI * 2;
      const cu = Math.cos(u), su = Math.sin(u);
      const pts = [];
      for (let j = 0; j <= 32; j++) {
        const v = j / 32 * Math.PI * 2;
        const cv = Math.cos(v), sv = Math.sin(v);
        pts.push([(R + r * cv) * cu, r * sv, (R + r * cv) * su]);
      }
      curves.push({ pts, closed: true });
    }
    return curves;
  },
  cylinder(size) {
    const r = size * 0.7, hh = size * 0.75;
    const curves = [];
    const top = [], bot = [];
    for (let i = 0; i <= 64; i++) {
      const t = i / 64 * Math.PI * 2;
      top.push([Math.cos(t) * r, -hh, Math.sin(t) * r]);
      bot.push([Math.cos(t) * r,  hh, Math.sin(t) * r]);
    }
    curves.push({ pts: top, closed: true });
    curves.push({ pts: bot, closed: true });
    for (let i = 0; i < 8; i++) {
      const t = i / 8 * Math.PI * 2;
      curves.push({ pts: [
        [Math.cos(t)*r, -hh, Math.sin(t)*r],
        [Math.cos(t)*r,  hh, Math.sin(t)*r],
      ], closed: false });
    }
    return curves;
  },
  cone(size) {
    const r = size * 0.85, h = size * 1.6;
    const curves = [];
    const bot = [];
    for (let i = 0; i <= 64; i++) {
      const t = i / 64 * Math.PI * 2;
      bot.push([Math.cos(t) * r, -h/2, Math.sin(t) * r]);
    }
    curves.push({ pts: bot, closed: true });
    for (let i = 0; i < 16; i++) {
      const t = i / 16 * Math.PI * 2;
      curves.push({ pts: [
        [Math.cos(t)*r, -h/2, Math.sin(t)*r],
        [0, h/2, 0],
      ], closed: false });
    }
    return curves;
  },
  icosa(size) {
    const geo = new THREE.IcosahedronGeometry(size, 0);
    const edges = new THREE.EdgesGeometry(geo);
    const pos = edges.attributes.position;
    const out = [];
    for (let i = 0; i < pos.count; i += 2) {
      out.push({ pts: [
        [pos.getX(i),   pos.getY(i),   pos.getZ(i)  ],
        [pos.getX(i+1), pos.getY(i+1), pos.getZ(i+1)],
      ], closed: false });
    }
    geo.dispose(); edges.dispose();
    return out;
  },
  coin(size) {
    // A coin is just one flat ring in the XY plane — the preset's TILT_3D
    // camera turns it into an ellipse, which is the disc read. No rim, no
    // inset ring, no verticals: extra geometry only muddied the silhouette.
    const r = size * 0.95;
    const pts = [];
    const N = 128;
    for (let i = 0; i <= N; i++) {
      const t = i / N * Math.PI * 2;
      pts.push([Math.cos(t) * r, Math.sin(t) * r, 0]);
    }
    return [{ pts, closed: true }];
  },
  helix(size) {
    // Split into two halves so multi-color alternation produces a visible
    // 2-color helix (one color for the lower coil, another for the upper).
    // Both halves share the midpoint so the seam is invisible.
    const r = size, h = size * 1.6, turns = 4;
    const N = 256, mid = N / 2;
    const lower = [], upper = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const a = t * turns * Math.PI * 2;
      const p = [Math.cos(a) * r, -h/2 + h * t, Math.sin(a) * r];
      if (i <= mid) lower.push(p);
      if (i >= mid) upper.push(p);
    }
    return [
      { pts: lower, closed: false },
      { pts: upper, closed: false },
    ];
  },
  swoosh(size) {
    // 3D S-curve extending well beyond the typical view, suitable for panning loops.
    const w = size * 5;
    const h = size * 1.2;
    const pts = [];
    const N = 120;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = (t - 0.5) * w;
      const y = -Math.sin((t - 0.5) * Math.PI) * h * 0.5;
      const z = Math.cos((t - 0.5) * Math.PI) * size * 0.15;
      pts.push([x, y, z]);
    }
    return [{ pts, closed: false }];
  },
};

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

function makeOutlineGroup(type, size, color, thickness, opts) {
  // Outline shapes share the same comet/taper aesthetic as compositions: each
  // polyline of the wireframe becomes a TubeGeometry rendered with the trail
  // shader (taper, head, trailLength). Joint spheres at corners are gone —
  // the taper pinches each tube to a point at the tail, so there are no
  // "holes" at vertices to fill.
  //
  // opts:
  //   colors:      [hex] (single) or [hex1, hex2] (multi, alternated across polylines)
  //   trailLength: 0..1.5  (default 0.95, mostly drawn)
  //   taper:       0..1    (default 1.0, full pinch to tail)
  //   head:        0..1    (default 0.99 — head near the visual end of each tube)
  const o = opts || {};
  const colors = (Array.isArray(o.colors) && o.colors.length > 0) ? o.colors : [color];
  const trailLength = (typeof o.trailLength === 'number') ? o.trailLength : 0.95;
  const taper       = (typeof o.taper === 'number')       ? o.taper       : 1.0;
  const head        = (typeof o.head === 'number')        ? o.head        : 0.99;

  const curves = OUTLINE_GENERATORS[type](size);
  const group = new THREE.Group();
  const meshes = [];

  curves.forEach(({ pts, closed }, idx) => {
    if (pts.length < 2) return;
    const v3 = pts.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    let curve;
    if (v3.length === 2 && !closed) {
      curve = new THREE.LineCurve3(v3[0], v3[1]);
    } else if (!closed) {
      curve = new THREE.CatmullRomCurve3(v3, false);
    } else {
      const input = v3[0].equals(v3[v3.length - 1]) ? v3.slice(0, -1) : v3;
      curve = new THREE.CatmullRomCurve3(input, true);
    }
    const segs = Math.max(32, pts.length * 4);
    const tube = new THREE.TubeGeometry(curve, segs, thickness, 8, closed);
    const c = colors[idx % colors.length];
    const mat = createTrailMaterial(c, trailLength, thickness, taper);
    mat.uniforms.head.value = head;
    const mesh = new THREE.Mesh(tube, mat);
    group.add(mesh);
    meshes.push(mesh);
  });

  // Stashed for the animation loop: each frame we push head/length/taper
  // uniforms onto every child mesh so they all stay in sync.
  group.userData.outlineMeshes = meshes;
  return group;
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

function filledGeometryFor(type, size) {
  if (type === 'sphere') return new THREE.SphereGeometry(size, 48, 32);
  if (type === 'cube') return new THREE.BoxGeometry(size * 1.4, size * 1.4, size * 1.4);
  if (type === 'torus') return new THREE.TorusGeometry(size, size * 0.32, 24, 96);
  if (type === 'cylinder') return new THREE.CylinderGeometry(size * 0.7, size * 0.7, size * 1.5, 48);
  if (type === 'cone') return new THREE.ConeGeometry(size * 0.85, size * 1.6, 48);
  if (type === 'icosa') return new THREE.IcosahedronGeometry(size, 0);
  return null;
}

// ---- mount ---------------------------------------------------
let THREE, EffectComposer, RenderPass, ShaderPass, OutputPass;

async function mount() {
  const host = document.querySelector(".home-hero_background");
  if (!host) return;
  const video = host.querySelector(".home-hero_video");

  [THREE, { EffectComposer }, { RenderPass }, { ShaderPass }, { OutputPass }] = await Promise.all([
    import(CDN + "/+esm"),
    import(CDN + "/examples/jsm/postprocessing/EffectComposer.js/+esm"),
    import(CDN + "/examples/jsm/postprocessing/RenderPass.js/+esm"),
    import(CDN + "/examples/jsm/postprocessing/ShaderPass.js/+esm"),
    import(CDN + "/examples/jsm/postprocessing/OutputPass.js/+esm"),
  ]);
  const NoiseShader = makeNoiseShader();

  const canvas = document.createElement("canvas");
  canvas.className = "home-hero_scene";
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
  composer.addPass(new ShaderPass(NoiseShader));
  composer.addPass(new OutputPass());

  const group = new THREE.Group();
  scene.add(group);
  const objects = [];
  for (const o of CONFIG.objects) {
    let obj3d;
    if (o.style === "trail") {
      obj3d = new THREE.Mesh(
        makeGreatCircleTube(o.size, o.plane || "xy", o.thickness, 128),
        createTrailMaterial(o.color, o.trailLength, o.thickness, o.taper)
      );
    } else if (o.style === "outline") {
      const colors = Array.isArray(o.colors) && o.colors.length === 2
        ? (o.colorMode === "single" ? [o.colors[0]] : o.colors)
        : [o.color];
      obj3d = makeOutlineGroup(o.type, o.size, o.color, o.thickness, {
        colors, trailLength: o.trailLength, taper: o.taper, head: o.trailHead,
      });
    } else {
      const geo = filledGeometryFor(o.type, o.size);
      obj3d = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: o.color }));
    }
    obj3d.position.fromArray(o.position);
    obj3d.rotation.set(o.rotation[0], o.rotation[1], o.rotation[2]);
    group.add(obj3d);
    objects.push(Object.assign({ obj3d }, o));
  }

  // Square canvas covering the hero's shorter side, like the original fit()
  // Figma 793:4390 (1600px frame): the sphere is ~1134px across, centred at (1340, 527);
  // the sphere fills 0.634 of the canvas, so the canvas is 1.118 × hero width
  const hero = host.closest(".section_home-hero") || host;
  function fit() {
    const r = host.getBoundingClientRect();
    const s = hero.getBoundingClientRect();
    // mobile (<=479px): the sphere sits centred under the buttons, cut by the hero bottom
    const phone = window.matchMedia("(max-width: 479px)").matches;
    const m = Math.round(s.width * (phone ? 1.42 : 1.118)) || 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(m, m, false);
    composer.setPixelRatio(dpr);
    composer.setSize(m, m);
    canvas.style.position = "absolute";
    canvas.style.width = m + "px";
    canvas.style.height = m + "px";
    canvas.style.left = Math.round(s.left - r.left + s.width * (phone ? 0.5 : 0.8375) - m / 2) + "px";
    canvas.style.top = Math.round(s.top - r.top + (phone ? s.height + s.width * 0.08 : s.width * 0.329) - m / 2) + "px";
  }

  function step(dt) {
    group.rotation.y += COMPOSITION_SPIN.y * dt;
    group.rotation.x += COMPOSITION_SPIN.x * dt;
    for (const o of objects) {
      if (o.style === "trail") {
        o.trailHead = ((o.trailHead || 0) + (o.trailSpeed || 0) * dt);
        o.trailHead = o.trailHead - Math.floor(o.trailHead);
        const u = o.obj3d.material.uniforms;
        u.head.value = o.trailHead;
        u.trailLength.value = o.trailLength;
        u.uTaper.value = o.taper;
      } else if (o.style === "outline" && o.obj3d.userData && o.obj3d.userData.outlineMeshes) {
        o.trailHead = ((o.trailHead || 0) + (o.trailSpeed || 0) * dt);
        o.trailHead = o.trailHead - Math.floor(o.trailHead);
        for (const m of o.obj3d.userData.outlineMeshes) {
          if (!m.material || !m.material.uniforms) continue;
          m.material.uniforms.head.value = o.trailHead;
          m.material.uniforms.trailLength.value = o.trailLength;
          if (m.material.uniforms.uTaper) m.material.uniforms.uTaper.value = o.taper;
        }
      }
      o.obj3d.rotation.x += o.spinX * dt;
      o.obj3d.rotation.y += o.spinY * dt;
      o.obj3d.rotation.z += o.spinZ * dt;
      if (o.panX || o.panY || o.panZ) {
        const range = o.panRange || 800; const half = range / 2;
        if (o.panX) { o.obj3d.position.x += o.panX * dt; if (o.obj3d.position.x > half) o.obj3d.position.x -= range; else if (o.obj3d.position.x < -half) o.obj3d.position.x += range; }
        if (o.panY) { o.obj3d.position.y += o.panY * dt; if (o.obj3d.position.y > half) o.obj3d.position.y -= range; else if (o.obj3d.position.y < -half) o.obj3d.position.y += range; }
        if (o.panZ) { o.obj3d.position.z += o.panZ * dt; if (o.obj3d.position.z > half) o.obj3d.position.z -= range; else if (o.obj3d.position.z < -half) o.obj3d.position.z += range; }
      }
    }
    composer.render();
  }

  if (video) { video.pause(); video.replaceWith(canvas); } else host.appendChild(canvas);
  fit();
  new ResizeObserver(fit).observe(host);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    step(0);
    new ResizeObserver(() => step(0)).observe(host);
    return;
  }

  let visible = true, raf = 0, last = 0;
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
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; sync(); }).observe(host);
  document.addEventListener("visibilitychange", sync);
  sync();
}

mount().catch((err) => console.warn("[anyflo-hero-scene] kept the video:", err));
