// The hero: a blocky rooftop city at dusk in Chhatpat's own look. A runner hops chhat to chhat,
// kites hang in the sky, Diwali lanterns drift up. Tap / click / Space makes the runner jump.
import * as THREE from 'three';

type Roof = { x0: number; x1: number; h: number; meshes: THREE.Object3D[] };

const WALLS = [0xf3b6a8, 0xf6d7a7, 0xe9e2cf, 0xa9d8c8, 0xe7a05c, 0x9cc3e4, 0xd7795b, 0xf0c35a, 0xc9a3c6, 0xf4efe4, 0x7fb8a4, 0xe8857a];
const KITES = [0xff3d8b, 0xffc23d, 0x19b3a3, 0xff8a1f, 0x3a7bff, 0xe5483b, 0x63d36a];
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

// ---------- city shader: flat toon light, world-space windows, lit at dusk, manual fog ----------
const cityVert = /* glsl */ `
  attribute vec3 instanceColor;
  attribute float aLit;
  varying vec3 vColor; varying vec3 vN; varying vec3 vW; varying float vLit; varying float vDist;
  void main(){
    vColor = instanceColor; vLit = aLit;
    vec4 w = modelMatrix * instanceMatrix * vec4(position,1.0);
    vW = w.xyz;
    vN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
    vec4 mv = viewMatrix * w; vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }`;
const cityFrag = /* glsl */ `
  uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uFog; uniform vec2 uFogR; uniform float uTime;
  varying vec3 vColor; varying vec3 vN; varying vec3 vW; varying float vLit; varying float vDist;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
  void main(){
    vec3 n = normalize(vN);
    float ndl = max(dot(n, normalize(uSun)), 0.0);
    float band = smoothstep(0.05, 0.35, ndl);
    vec3 base = vColor;
    vec3 col = base * (uSky * 0.72 + uSunCol * band * 0.7);
    // windows on walls only
    if (abs(n.y) < 0.5) {
      vec2 uv = vec2(abs(n.x) > 0.5 ? vW.z : vW.x, vW.y);
      vec2 cell = floor(uv / vec2(2.6, 3.1));
      vec2 f = fract(uv / vec2(2.6, 3.1));
      float win = step(0.28, f.x) * step(f.x, 0.72) * step(0.3, f.y) * step(f.y, 0.78);
      float slab = step(f.y, 0.06);
      col = mix(col, col * 0.78, slab);
      float lit = step(0.62 - vLit * 0.25, hash(cell + floor(vW.xz * 0.01)));
      vec3 glass = mix(base * 0.35 + vec3(0.05,0.07,0.15), vec3(1.0, 0.72, 0.36) * (0.9 + 0.1*sin(uTime*2.0 + cell.x)), lit);
      col = mix(col, glass, win * step(3.0, vW.y));
    } else {
      col *= 0.92; // roofs a touch darker so parapets read
    }
    float fog = smoothstep(uFogR.x, uFogR.y, vDist);
    gl_FragColor = vec4(mix(col, uFog, fog), 1.0);
  }`;

export function mountHero(container: HTMLElement, opts: { onScore?: (n: number, state: 'demo' | 'play' | 'fall') => void } = {}) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: devicePixelRatio < 2, powerPreference: 'high-performance' });
  } catch {
    container.dataset.gl = 'off';
    return () => {};
  }
  const small = innerWidth < 760;
  const nav = navigator as any;
  const weak = (nav.deviceMemory && nav.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  let dpr = Math.min(devicePixelRatio, weak ? 1.25 : small ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const FOG = new THREE.Color(0xf09a6a);
  scene.fog = new THREE.Fog(FOG, 60, 210);
  const camera = new THREE.PerspectiveCamera(small ? 62 : 46, 1, 0.5, 600);

  // ---------- sky ----------
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uTime; varying vec3 vP;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
      void main(){
        float y = vP.y;
        vec3 top = vec3(0.04,0.07,0.22), mid = vec3(0.20,0.18,0.48), low = vec3(0.98,0.56,0.36), hor = vec3(1.0,0.78,0.48);
        vec3 c = mix(hor, low, smoothstep(-0.02, 0.06, y));
        c = mix(c, mid, smoothstep(0.06, 0.28, y));
        c = mix(c, top, smoothstep(0.25, 0.75, y));
        vec3 sd = normalize(vec3(0.55, 0.05, -1.0));
        float s = max(dot(vP, sd), 0.0);
        c += vec3(1.0,0.7,0.4) * pow(s, 18.0) * 0.6 + vec3(1.0,0.9,0.7) * smoothstep(0.9985, 0.9995, s);
        vec2 g = floor(vP.xz / max(vP.y, 0.05) * 90.0);
        float star = step(0.9965, h(g)) * smoothstep(0.3, 0.7, y) * (0.6 + 0.4*sin(uTime*2.0 + h(g)*40.0));
        c += star;
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), skyMat);
  scene.add(sky);

  // ---------- lights for the standard-material things (runner, kites, props) ----------
  const sunDir = new THREE.Vector3(0.55, 0.42, -1).normalize();
  scene.add(new THREE.HemisphereLight(0x8fa8ff, 0x6b3a2a, 1.3));
  const sun = new THREE.DirectionalLight(0xffc28a, 2.4);
  sun.position.set(30, 40, 40);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x6f8bff, 0.9);
  rim.position.set(-20, 10, 30);
  scene.add(rim);

  const cityUniforms = {
    uSun: { value: new THREE.Vector3(0.55, 0.6, 0.7).normalize() },
    uSunCol: { value: new THREE.Color(0xffb27a) },
    uSky: { value: new THREE.Color(0x8d8fd8) },
    uFog: { value: FOG },
    uFogR: { value: new THREE.Vector2(55, 230) },
    uTime: { value: 0 },
  };
  const cityMat = new THREE.ShaderMaterial({ uniforms: cityUniforms, vertexShader: cityVert, fragmentShader: cityFrag });

  // ---------- background city: instanced boxes that wrap around the camera ----------
  const box = new THREE.BoxGeometry(1, 1, 1);
  box.translate(0, 0.5, 0);
  const BG = weak ? 380 : small ? 520 : 900;
  const bg = new THREE.InstancedMesh(box, cityMat, BG);
  const bgColor = new Float32Array(BG * 3);
  const bgLit = new Float32Array(BG);
  const bgData: { x: number; z: number; w: number; d: number; h: number }[] = [];
  const m4 = new THREE.Matrix4();
  const col = new THREE.Color();
  const SPAN = 320;
  const placeBg = (i: number, x: number) => {
    const z = -rand(24, 260);
    const far = -z / 260;
    const w = rand(7, 15), d = rand(7, 15);
    const h = rand(6, 12) + far * rand(4, 20) + (Math.random() < 0.05 ? rand(8, 18) : 0);
    bgData[i] = { x, z, w, d, h };
    m4.makeScale(w, h, d).setPosition(x, 0, z);
    bg.setMatrixAt(i, m4);
  };
  for (let i = 0; i < BG; i++) {
    placeBg(i, rand(-SPAN / 2, SPAN / 2));
    col.setHex(pick(WALLS)).toArray(bgColor, i * 3);
    bgLit[i] = Math.random();
  }
  bg.geometry = box.clone();
  bg.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(bgColor, 3));
  bg.geometry.setAttribute('aLit', new THREE.InstancedBufferAttribute(bgLit, 1));
  bg.frustumCulled = false;
  scene.add(bg);

  // a few foreground roofs between camera and lane (low, so they frame without blocking)
  const FG = 40;
  const fg = new THREE.InstancedMesh(box.clone(), cityMat, FG);
  const fgColor = new Float32Array(FG * 3), fgLit = new Float32Array(FG);
  const fgData: { x: number }[] = [];
  const placeFg = (i: number, x: number) => {
    const z = rand(9, 20), w = rand(6, 12), d = rand(6, 10), h = rand(4, 9);
    fgData[i] = { x };
    m4.makeScale(w, h, d).setPosition(x, 0, z);
    fg.setMatrixAt(i, m4);
  };
  for (let i = 0; i < FG; i++) { placeFg(i, rand(-SPAN / 2, SPAN / 2)); col.setHex(pick(WALLS)).toArray(fgColor, i * 3); fgLit[i] = Math.random(); }
  fg.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(fgColor, 3));
  fg.geometry.setAttribute('aLit', new THREE.InstancedBufferAttribute(fgLit, 1));
  fg.frustumCulled = false;
  scene.add(fg);

  // landmarks on the skyline: a temple shikhara, a minaret pair, a dome
  const lm = new THREE.Group();
  const stone = new THREE.MeshLambertMaterial({ color: 0xe8c9a0 });
  const sand = new THREE.MeshLambertMaterial({ color: 0xc8644a });
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.4 + (6 - i) * 0.9, 0.9 + (6 - i) * 0.9, 4.2, 8), stone);
    s.position.y = 18 + i * 4; lm.add(s);
  }
  const cap = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4, 8), new THREE.MeshLambertMaterial({ color: 0xffb13b }));
  cap.position.y = 18 + 6 * 4; lm.add(cap);
  const base = new THREE.Mesh(new THREE.BoxGeometry(16, 18, 16), stone); base.position.y = 9; lm.add(base);
  lm.position.set(40, 0, -150); scene.add(lm);
  const minar = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(2.4 - i * 0.35, 2.7 - i * 0.35, 13, 10), sand);
    t.position.y = 6.5 + i * 13; minar.add(t);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(3.2 - i * 0.35, 3.2 - i * 0.35, 0.7, 10), stone);
    ring.position.y = 13 + i * 13; minar.add(ring);
  }
  minar.position.set(-90, 0, -210); scene.add(minar);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(11, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xf4efe4 }));
  dome.position.set(150, 26, -190); scene.add(dome);
  const domeBase = new THREE.Mesh(new THREE.BoxGeometry(34, 26, 30), sand); domeBase.position.set(150, 13, -190); scene.add(domeBase);

  // ---------- the run lane: roofs with gullies between ----------
  const laneGroup = new THREE.Group(); scene.add(laneGroup);
  const tankMat = [new THREE.MeshLambertMaterial({ color: 0x2d62c9 }), new THREE.MeshLambertMaterial({ color: 0x1c1f2a }), new THREE.MeshLambertMaterial({ color: 0xf2f2ee })];
  const tankGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.5, 10);
  const parapetMat = new THREE.MeshLambertMaterial({ color: 0xf6efe2 });
  const clothMats = KITES.map((c) => new THREE.MeshLambertMaterial({ color: c, side: THREE.DoubleSide }));
  const roofs: Roof[] = [];
  let laneEnd = -30;
  let lastH = 13;
  const laneColors = new THREE.InstancedMesh(box.clone(), cityMat, 1); // kept for type parity
  laneColors.visible = false;

  const addRoof = () => {
    const gap = roofs.length === 0 ? 0 : rand(2.4, 4.4);
    const len = rand(10, 18);
    const h = THREE.MathUtils.clamp(lastH + rand(-1.6, 1.6), 10, 17);
    const x0 = laneEnd + gap, x1 = x0 + len;
    const meshes: THREE.Object3D[] = [];
    const g = new THREE.BoxGeometry(len, h, 9);
    g.translate(0, h / 2, 0);
    const c = new THREE.Color(pick(WALLS));
    const colors = new Float32Array([c.r, c.g, c.b]);
    const im = new THREE.InstancedMesh(g, cityMat, 1);
    im.setMatrixAt(0, m4.makeTranslation((x0 + x1) / 2, 0, 0));
    im.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(colors, 3));
    im.geometry.setAttribute('aLit', new THREE.InstancedBufferAttribute(new Float32Array([Math.random()]), 1));
    laneGroup.add(im); meshes.push(im);
    // parapet on the far side + low lips at the ends
    const par = new THREE.Mesh(new THREE.BoxGeometry(len, 0.9, 0.3), parapetMat);
    par.position.set((x0 + x1) / 2, h + 0.45, -4.35); laneGroup.add(par); meshes.push(par);
    // props
    if (Math.random() < 0.85) {
      const t = new THREE.Mesh(tankGeo, pick(tankMat));
      t.position.set(rand(x0 + 2, x1 - 2), h + 1.1, rand(-3.4, -2.2));
      const st = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 1.4), parapetMat);
      st.position.set(t.position.x, h + 0.2, t.position.z);
      laneGroup.add(t, st); meshes.push(t, st);
    }
    if (Math.random() < 0.5) {
      const mum = new THREE.Mesh(new THREE.BoxGeometry(3, 2.6, 3), new THREE.MeshLambertMaterial({ color: c.clone().offsetHSL(0, 0, -0.08) }));
      mum.position.set(rand(x0 + 2.5, x1 - 2.5), h + 1.3, -2.6); laneGroup.add(mum); meshes.push(mum);
    }
    if (Math.random() < 0.6) { // washing line with cloth
      const lx = rand(x0 + 1, x1 - 5), lw = 4;
      const line = new THREE.Mesh(new THREE.BoxGeometry(lw, 0.03, 0.03), parapetMat);
      line.position.set(lx + lw / 2, h + 2.1, -3.8); laneGroup.add(line); meshes.push(line);
      for (let k = 0; k < 3; k++) {
        const cl = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.1), pick(clothMats));
        cl.position.set(lx + 0.7 + k * 1.3, h + 1.5, -3.8); laneGroup.add(cl); meshes.push(cl);
      }
    }
    roofs.push({ x0, x1, h, meshes });
    laneEnd = x1; lastH = h;
  };
  while (laneEnd < 140) addRoof();

  // string lights across each gully
  const bulbGeo = new THREE.BufferGeometry();
  const bulbPos: number[] = [];
  const bulbCols: number[] = [];
  const bulbs = new THREE.Points(bulbGeo, new THREE.PointsMaterial({ size: 0.38, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(bulbs);
  const rebuildBulbs = () => {
    bulbPos.length = 0; bulbCols.length = 0;
    for (let i = 1; i < roofs.length; i++) {
      const a = roofs[i - 1], b = roofs[i];
      const ax = a.x1 - 1, bx = b.x0 + 1, ah = a.h + 2.4, bh = b.h + 2.4;
      for (let k = 0; k <= 10; k++) {
        const t = k / 10;
        bulbPos.push(ax + (bx - ax) * t, ah + (bh - ah) * t - Math.sin(t * Math.PI) * 0.9, -4.1);
        const c = new THREE.Color(pick([0xffc23d, 0xff8a1f, 0xff3d8b, 0x7fe3d8]));
        bulbCols.push(c.r, c.g, c.b);
      }
    }
    bulbGeo.setAttribute('position', new THREE.Float32BufferAttribute(bulbPos, 3));
    bulbGeo.setAttribute('color', new THREE.Float32BufferAttribute(bulbCols, 3));
  };
  rebuildBulbs();

  // ---------- runner: a blocky hero in a kurta ----------
  const hero = new THREE.Group();
  const skin = new THREE.MeshLambertMaterial({ color: 0xb87a52 });
  const kurta = new THREE.MeshLambertMaterial({ color: 0xff8a1f });
  const pant = new THREE.MeshLambertMaterial({ color: 0xf4efe4 });
  const scarf = new THREE.MeshLambertMaterial({ color: 0xff3d8b });
  const hair = new THREE.MeshLambertMaterial({ color: 0x1b1410 });
  const part = (w: number, h: number, d: number, m: THREE.Material, pivotTop = true) => {
    const g = new THREE.BoxGeometry(w, h, d);
    if (pivotTop) g.translate(0, -h / 2, 0);
    return new THREE.Mesh(g, m);
  };
  const torso = part(0.62, 0.78, 0.36, kurta, false); torso.position.y = 1.32; hero.add(torso);
  const sc = part(0.66, 0.16, 0.4, scarf, false); sc.position.y = 1.66; hero.add(sc);
  const head = part(0.44, 0.44, 0.42, skin, false); head.position.y = 1.97; hero.add(head);
  const hr = part(0.48, 0.14, 0.46, hair, false); hr.position.y = 2.22; hero.add(hr);
  const legL = part(0.24, 0.92, 0.26, pant); legL.position.set(0, 0.94, 0.15); hero.add(legL);
  const legR = part(0.24, 0.92, 0.26, pant); legR.position.set(0, 0.94, -0.15); hero.add(legR);
  const armL = part(0.18, 0.7, 0.2, kurta); armL.position.set(0, 1.66, 0.42); hero.add(armL);
  const armR = part(0.18, 0.7, 0.2, kurta); armR.position.set(0, 1.66, -0.42); hero.add(armR);
  hero.scale.setScalar(1.15);
  scene.add(hero);
  const blob = new THREE.Mesh(new THREE.CircleGeometry(0.6, 16), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false }));
  blob.rotation.x = -Math.PI / 2; scene.add(blob);

  // ---------- kites ----------
  const kiteGeo = new THREE.BufferGeometry();
  kiteGeo.setAttribute('position', new THREE.Float32BufferAttribute([0, 1, 0, -0.75, 0, 0, 0, -1, 0, 0, 1, 0, 0, -1, 0, 0.75, 0, 0], 3));
  kiteGeo.computeVertexNormals();
  type Kite = { g: THREE.Group; base: THREE.Vector3; ph: number; line: THREE.Line; anchor: THREE.Vector3 };
  const kites: Kite[] = [];
  const lineMat = new THREE.LineBasicMaterial({ color: 0xfff4e2, transparent: true, opacity: 0.35 });
  const makeKite = (pos: THREE.Vector3, scale: number) => {
    const g = new THREE.Group();
    const c1 = pick(KITES), c2 = pick(KITES.filter((k) => k !== c1));
    const a = new THREE.Mesh(kiteGeo, new THREE.MeshLambertMaterial({ color: c1, side: THREE.DoubleSide }));
    const b = new THREE.Mesh(new THREE.CircleGeometry(0.42, 4), new THREE.MeshLambertMaterial({ color: c2, side: THREE.DoubleSide }));
    b.position.z = 0.01; b.rotation.z = Math.PI / 4; b.scale.set(0.7, 0.95, 1);
    const tail = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.9), new THREE.MeshLambertMaterial({ color: c2, side: THREE.DoubleSide }));
    tail.position.y = -1.4;
    g.add(a, b, tail);
    g.scale.setScalar(scale);
    g.position.copy(pos);
    scene.add(g);
    const anchor = new THREE.Vector3(pos.x + rand(-30, 30), rand(10, 16), pos.z + rand(10, 40));
    const lg = new THREE.BufferGeometry().setFromPoints([pos, anchor]);
    const line = new THREE.Line(lg, lineMat);
    scene.add(line);
    kites.push({ g, base: pos.clone(), ph: Math.random() * 10, line, anchor });
  };
  for (let i = 0; i < (weak ? 8 : small ? 12 : 22); i++) makeKite(new THREE.Vector3(rand(-60, 200), rand(26, 62), rand(-120, -20)), rand(1.4, 2.6));

  // the visitor's own kite: follows the pointer
  const myKite = new THREE.Group();
  {
    const a = new THREE.Mesh(kiteGeo, new THREE.MeshLambertMaterial({ color: 0xff3d8b, side: THREE.DoubleSide, emissive: 0x401020 }));
    const b = new THREE.Mesh(new THREE.CircleGeometry(0.42, 4), new THREE.MeshLambertMaterial({ color: 0xffc23d, side: THREE.DoubleSide }));
    b.position.z = 0.01; b.rotation.z = Math.PI / 4; b.scale.set(0.7, 0.95, 1);
    const tail = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 1.1), new THREE.MeshLambertMaterial({ color: 0x19b3a3, side: THREE.DoubleSide }));
    tail.position.y = -1.5;
    myKite.add(a, b, tail); myKite.scale.setScalar(1.3);
    scene.add(myKite);
  }
  const myLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const myLine = new THREE.Line(myLineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }));
  scene.add(myLine);

  // ---------- lanterns (Diwali) ----------
  const LN = weak ? 40 : small ? 70 : 140;
  const lanGeo = new THREE.BufferGeometry();
  const lanPos = new Float32Array(LN * 3);
  const lanSpd = new Float32Array(LN);
  for (let i = 0; i < LN; i++) { lanPos[i * 3] = rand(-80, 220); lanPos[i * 3 + 1] = rand(5, 90); lanPos[i * 3 + 2] = rand(-160, -10); lanSpd[i] = rand(0.6, 1.6); }
  lanGeo.setAttribute('position', new THREE.BufferAttribute(lanPos, 3));
  const lanTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d')!;
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,240,200,1)'); gr.addColorStop(0.25, 'rgba(255,190,90,0.9)'); gr.addColorStop(1, 'rgba(255,120,40,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  const lanterns = new THREE.Points(lanGeo, new THREE.PointsMaterial({ size: 2.2, map: lanTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  scene.add(lanterns);

  // ---------- state ----------
  const st = {
    x: 0, y: roofs[0].h, vy: 0, grounded: true, speed: 8.2, mode: 'demo' as 'demo' | 'play',
    score: 0, lastRoof: 0, falling: 0, t: 0, run: 0,
  };
  st.x = roofs[0].x0 + 3;

  const ptr = new THREE.Vector2(0, 0), ptrS = new THREE.Vector2(0, 0);
  const G = 30, JUMP = 12.4;

  const roofAt = (x: number) => roofs.find((r) => x >= r.x0 - 0.15 && x <= r.x1 + 0.15);

  const jump = () => {
    if (st.falling) return;
    if (st.grounded) { st.vy = JUMP; st.grounded = false; }
  };
  const onTap = (e: Event) => {
    if ((e.target as HTMLElement).closest('a,button,input,label')) return;
    if (st.mode === 'demo') { st.mode = 'play'; st.score = 0; opts.onScore?.(0, 'play'); }
    jump();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.code !== 'Space' && e.code !== 'ArrowUp') return;
    if (!visible || (document.activeElement && /INPUT|TEXTAREA|BUTTON|A/.test(document.activeElement.tagName))) return;
    if (scrollY > innerHeight * 0.6) return;
    e.preventDefault();
    if (st.mode === 'demo') { st.mode = 'play'; st.score = 0; opts.onScore?.(0, 'play'); }
    jump();
  };
  const onMove = (e: PointerEvent) => {
    const r = container.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  };
  container.addEventListener('pointerdown', onTap);
  addEventListener('keydown', onKey);
  addEventListener('pointermove', onMove, { passive: true });

  // ---------- loop ----------
  const resize = () => {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 64 : 46;
    if (w / h > 1.2) camera.setViewOffset(w, h, -w * 0.16, 0, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize); ro.observe(container); resize();

  let visible = true;
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
  io.observe(container);

  const clock = new THREE.Clock();
  const camPos = new THREE.Vector3(st.x - 2, st.y + 6, 17);
  const camLook = new THREE.Vector3();
  const tmpV = new THREE.Vector3();
  let raf = 0;

  const step = (dt: number) => {
    st.t += dt;
    cityUniforms.uTime.value = st.t; skyMat.uniforms.uTime.value = st.t;

    // movement
    if (st.falling > 0) {
      st.falling -= dt;
      st.vy -= G * dt; st.y += st.vy * dt; st.x += st.speed * 0.4 * dt;
      if (st.falling <= 0) {
        const next = roofs.find((r) => r.x0 > st.x) ?? roofs[roofs.length - 1];
        st.x = next.x0 + 2; st.y = next.h; st.vy = 0; st.grounded = true;
        opts.onScore?.(st.score, st.mode);
      }
    } else {
      st.x += st.speed * dt;
      const r = roofAt(st.x);
      if (st.grounded) {
        if (!r) { st.grounded = false; st.vy = 0; }
        else if (st.mode === 'demo') {
          const next = roofs.find((q) => q.x0 > st.x);
          if (next && r.x1 - st.x < 0.9 + (next.h - r.h) * 0.08) jump();
        }
      }
      if (!st.grounded) {
        st.vy -= G * dt; st.y += st.vy * dt;
        const under = roofAt(st.x);
        if (under && st.vy <= 0 && st.y <= under.h && st.y > under.h - 1.2) {
          st.y = under.h; st.vy = 0; st.grounded = true;
          const idx = roofs.indexOf(under);
          if (idx !== st.lastRoof) { st.lastRoof = idx; st.score++; if (st.mode === 'play') opts.onScore?.(st.score, 'play'); }
        } else if (under && st.y < under.h - 1.2) {
          // hit the wall face: fall
          st.falling = 1.1; st.vy = 2; if (st.mode === 'play') opts.onScore?.(st.score, 'fall');
        } else if (st.y < (roofAt(st.x)?.h ?? 0) - 6) {
          st.falling = 0.9; if (st.mode === 'play') opts.onScore?.(st.score, 'fall');
        }
      }
    }

    // pose
    st.run += dt * (st.grounded ? 11 : 3);
    const sw = st.grounded ? Math.sin(st.run) : 0.9;
    legL.rotation.z = sw * 0.8; legR.rotation.z = -sw * 0.8;
    armL.rotation.z = -sw * 0.9; armR.rotation.z = sw * 0.9;
    torso.rotation.z = st.grounded ? -0.12 : -0.3;
    hero.position.set(st.x, st.y + (st.grounded ? Math.abs(Math.cos(st.run)) * 0.08 : 0), 0);
    hero.rotation.y = 0;
    const under = roofAt(st.x);
    blob.visible = !!under && st.falling <= 0;
    if (under) { blob.position.set(st.x, under.h + 0.02, 0); const k = 1 / (1 + Math.max(0, st.y - under.h) * 0.3); blob.scale.setScalar(k); }

    // extend lane, drop roofs behind
    while (laneEnd < st.x + 160) addRoof();
    let dropped = false;
    while (roofs.length && roofs[0].x1 < st.x - 60) {
      const r = roofs.shift()!; r.meshes.forEach((m) => { laneGroup.remove(m); (m as THREE.Mesh).geometry?.dispose?.(); });
      st.lastRoof--; dropped = true;
    }
    if (dropped || st.t % 1 < dt) rebuildBulbs();

    // wrap background around the camera
    const cx = st.x;
    for (let i = 0; i < BG; i++) {
      const b = bgData[i];
      if (b.x < cx - SPAN / 2) { placeBg(i, b.x + SPAN); bg.instanceMatrix.needsUpdate = true; }
    }
    for (let i = 0; i < FG; i++) if (fgData[i].x < cx - SPAN / 2) { placeFg(i, fgData[i].x + SPAN); fg.instanceMatrix.needsUpdate = true; }
    lm.position.x = cx + 40 + Math.sin(st.t * 0.01) * 2; minar.position.x = cx - 90; dome.position.x = cx + 150; domeBase.position.x = cx + 150;
    sky.position.set(cx, 0, 0);

    // kites drift, wrap
    for (const k of kites) {
      if (k.base.x < cx - 80) { k.base.x += 290; k.anchor.x += 290; }
      k.g.position.set(k.base.x + Math.sin(st.t * 0.6 + k.ph) * 1.6, k.base.y + Math.sin(st.t * 0.9 + k.ph * 2) * 1.2, k.base.z);
      k.g.rotation.z = Math.sin(st.t * 1.1 + k.ph) * 0.25;
      const p = k.line.geometry.attributes.position as THREE.BufferAttribute;
      p.setXYZ(0, k.g.position.x, k.g.position.y - 1, k.g.position.z); p.setXYZ(1, k.anchor.x, k.anchor.y, k.anchor.z); p.needsUpdate = true;
    }

    // lanterns rise
    const lp = lanGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < LN; i++) {
      let y = lp.getY(i) + lanSpd[i] * dt * 1.4; let x = lp.getX(i) + Math.sin(st.t + i) * 0.01;
      if (y > 95) y = 4;
      if (x < cx - 90) x += 310;
      lp.setXY(i, x, y);
    }
    lp.needsUpdate = true;

    // camera: side-on chase with pointer parallax
    ptrS.lerp(ptr, 1 - Math.pow(0.001, dt));
    const camTarget = tmpV.set(st.x + 3 + ptrS.x * 3, Math.max(st.y, under?.h ?? st.y) + 5.2 + ptrS.y * 1.6, 17 - ptrS.y * 1.5);
    camPos.lerp(camTarget, 1 - Math.pow(0.02, dt));
    camera.position.copy(camPos);
    camLook.lerp(new THREE.Vector3(st.x + 7 + ptrS.x * 4, (under?.h ?? st.y) + 2.5, -6), 1 - Math.pow(0.01, dt));
    camera.lookAt(camLook);

    // my kite follows the pointer, string to the runner
    const kp = new THREE.Vector3(ptrS.x, ptrS.y * 0.8 + 0.25, 0.5).unproject(camera);
    const dir = kp.sub(camera.position).normalize();
    const target = camera.position.clone().add(dir.multiplyScalar(26));
    myKite.position.lerp(target, 1 - Math.pow(0.05, dt));
    myKite.lookAt(camera.position);
    myKite.rotation.z += Math.sin(st.t * 2.2) * 0.15;
    const ml = myLineGeo.attributes.position as THREE.BufferAttribute;
    ml.setXYZ(0, myKite.position.x, myKite.position.y - 1.2, myKite.position.z);
    ml.setXYZ(1, hero.position.x, hero.position.y + 1.9, hero.position.z + 0.4);
    ml.needsUpdate = true;
  };

  let slow = 0, seen = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const raw = clock.getDelta();
    const dt = Math.min(raw, 1 / 20);
    if (!visible || document.hidden) return;
    if (seen < 240) {
      seen++;
      if (raw > 1 / 40) slow++;
      if (seen % 60 === 0 && slow > 30 && dpr > 0.75) { dpr = Math.max(0.75, dpr - 0.35); renderer.setPixelRatio(dpr); resize(); slow = 0; }
      if (seen % 60 === 0) slow = 0;
    }
    step(dt);
    renderer.render(scene, camera);
  };

  if (reduce) {
    for (let i = 0; i < 40; i++) step(1 / 30);
    renderer.render(scene, camera);
  } else {
    frame();
  }
  container.dataset.gl = 'on';
  if (import.meta.env.DEV) (window as any).__hero = { st, step, draw: () => renderer.render(scene, camera), camera };

  return () => {
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    container.removeEventListener('pointerdown', onTap);
    removeEventListener('keydown', onKey); removeEventListener('pointermove', onMove);
    renderer.dispose(); renderer.domElement.remove();
  };
}
