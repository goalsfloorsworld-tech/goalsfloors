/**
 * VOXEL SHATTER ENGINE V32 (THE SMOOTH OPERATOR)
 * Logic: Balanced Resolution (400) + Faster Buffer Init.
 * Design: High-FPS Voxel Shuffle, Zero-Jank Initialization.
 */

(function() {
    'use strict';

    const CONFIG = {
        gridX: 450,        // Golden Balance (High enough for logo, low enough for 60FPS)
        cubeDepth: 8,      
        shatterForce: 130, 
        gravity: -380,      
        navDelay: 3500,    
        logos: {
            light: '/images/goals floors logo.svg',
            dark: '/images/goals-floors-logo-white.svg'
        },
        libs: {
            three: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js',
            gsap: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'
        }
    };

    const style = document.createElement('style');
    style.id = 'v-v32-css';
    style.innerHTML = `
        #v-container { position: fixed; inset: 0; z-index: 2147483647; background: transparent; visibility: hidden; pointer-events: none; opacity: 1; transition: opacity 0.8s; }
        #v-container.v-active { visibility: visible; }
        #v-container.v-fade-out { opacity: 0; }
        #v-canvas { width: 100%; height: 100%; display: block; }
        body.v-shut-now > *:not(#v-container):not(script) { visibility: hidden !important; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'v-container';
    document.body.appendChild(container);

    const canvas = document.createElement('canvas');
    canvas.id = 'v-canvas';
    container.appendChild(canvas);

    let isAnimating = false;
    let libsReady = false;

    async function loadLibs() {
        const s = (src) => new Promise((res) => {
            const sc = document.createElement('script'); sc.src = src; 
            sc.async = true; sc.crossOrigin = "anonymous"; sc.onload = res;
            document.head.appendChild(sc);
        });
        await Promise.all(Object.values(CONFIG.libs).map(s));
        libsReady = true;
    }

    function isDarkMode() {
        const h = document.documentElement;
        if (h.classList.contains('dark') || document.body.classList.contains('dark')) return true;
        const bg = getComputedStyle(document.body).backgroundColor;
        const rgb = bg.match(/\d+/g);
        if (rgb) {
            const b = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            return b < 128;
        }
        return false;
    }

    class Engine {
        constructor() {
            this.scene = null; this.camera = null; this.renderer = null; 
            this.mesh = null; this.startTime = 0;
        }

        async ignite(target) {
            if (isAnimating || !libsReady) return;
            isAnimating = true;

            const isDark = isDarkMode();
            const logoSrc = isDark ? CONFIG.logos.dark : CONFIG.logos.light;
            const cubeColor = isDark ? new THREE.Color(0x000000) : new THREE.Color(0xffffff);

            // Trigger navigation trigger - but stay on top
            if (window.nextRouter) window.nextRouter.push(target);

            const tex = await new Promise((res) => {
                new THREE.TextureLoader().load(logoSrc, res);
            });

            container.classList.remove('v-fade-out');
            container.classList.add('v-active');
            container.style.background = isDark ? '#000' : '#fff';
            document.body.classList.add('v-shut-now');

            if (!this.renderer) {
                this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.scene = new THREE.Scene();
                this.scene.background = null; 
                const aspect = window.innerWidth / window.innerHeight;
                const z = (window.innerHeight / 2) / Math.tan((45/2) * (Math.PI/180));
                this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000);
                this.camera.position.z = z;
                this.scene.add(new THREE.AmbientLight(0xffffff, 2.0));
            }

            // SMART DENSITY
            let nx = Math.min(CONFIG.gridX, window.innerWidth < 768 ? 200 : 450);
            const ny = Math.round(nx / (window.innerWidth / window.innerHeight));
            const size = window.innerWidth / nx;
            const total = nx * ny;

            const box = new THREE.BoxGeometry(size * 0.9, size * 0.9, CONFIG.cubeDepth);
            const geo = new THREE.InstancedBufferGeometry().copy(box);
            geo.instanceCount = total;

            const startPos = new Float32Array(total * 3);
            const velocity = new Float32Array(total * 3);
            const delay = new Float32Array(total);
            const rando = new Float32Array(total * 3);
            
            const sX = -window.innerWidth / 2 + size / 2;
            const sY = window.innerHeight / 2 - size / 2;

            // Hyper-optimized loop
            for (let i = 0; i < total; i++) {
                const i3 = i * 3;
                const row = Math.floor(i / nx);
                startPos[i3] = sX + (i % nx) * size;
                startPos[i3+1] = sY - row * size;
                
                velocity[i3] = (Math.random() - 0.5) * 35; 
                velocity[i3+1] = CONFIG.shatterForce * (0.4 + Math.random() * 0.6);
                velocity[i3+2] = Math.random() * 70;
                
                delay[i] = (row / ny) * 1.5 + Math.random() * 0.25; 
                rando[i3] = Math.random(); rando[i3+1] = Math.random(); rando[i3+2] = Math.random();
            }

            geo.setAttribute('aStartPos', new THREE.InstancedBufferAttribute(startPos, 3));
            geo.setAttribute('aVelocity', new THREE.InstancedBufferAttribute(velocity, 3));
            geo.setAttribute('aDelay', new THREE.InstancedBufferAttribute(delay, 1));
            geo.setAttribute('aRando', new THREE.InstancedBufferAttribute(rando, 3));

            const mat = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 }, uTex: { value: tex }, uGravity: { value: CONFIG.gravity },
                    uCubeColor: { value: cubeColor }
                },
                vertexShader: `
                    attribute vec3 aStartPos; attribute vec3 aVelocity; attribute float aDelay; attribute vec3 aRando;
                    uniform float uTime; uniform float uGravity;
                    varying vec2 vU;
                    void main() {
                        float t = max(0.0, uTime - aDelay);
                        vec3 p = aStartPos;
                        p.x += aVelocity.x * t; p.y += aVelocity.y * t + 0.5 * uGravity * t * t; p.z += aVelocity.z * t;
                        float ang = t * 3.5; float s = sin(ang + aRando.x); float c = cos(ang + aRando.y);
                        mat2 r = mat2(c, -s, s, c);
                        vec3 pos = position; pos.xz = r * pos.xz; pos.yz = r * pos.yz;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + p, 1.0);
                        float resX = float(${nx}); float resY = float(${ny});
                        float lSize = resX * 0.45;
                        vU = vec2((mod(float(gl_InstanceID), resX) - (resX - lSize) / 2.0) / lSize, 1.0 - (floor(float(gl_InstanceID) / resX) - (resY - lSize) / 2.0) / lSize);
                    }
                `,
                fragmentShader: `
                    varying vec2 vU; uniform sampler2D uTex; uniform vec3 uCubeColor;
                    void main() {
                        vec4 tC = vec4(0.0);
                        if (vU.x >= 0.0 && vU.x <= 1.0 && vU.y >= 0.0 && vU.y <= 1.0) tC = texture2D(uTex, vU);
                        gl_FragColor = vec4(mix(uCubeColor, tC.rgb, tC.a), 1.0);
                    }
                `,
                transparent: true
            });

            if (this.mesh) this.scene.remove(this.mesh);
            this.mesh = new THREE.Mesh(geo, mat);
            this.scene.add(this.mesh);
            this.startTime = performance.now();
            this.loop();

            const onRouteReady = () => {
                container.style.background = 'transparent';
                document.body.classList.remove('v-shut-now');
                window.removeEventListener('voxel-route-ready', onRouteReady);
            };
            window.addEventListener('voxel-route-ready', onRouteReady);

            setTimeout(() => {
                container.classList.add('v-fade-out');
                setTimeout(() => { isAnimating = false; }, 800);
            }, CONFIG.navDelay - 800);
        }

        loop() {
            if (!isAnimating) return;
            this.mesh.material.uniforms.uTime.value = (performance.now() - this.startTime) / 1000;
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(() => this.loop());
        }
    }

    async function bootstrap() {
        await loadLibs();
        const engine = new Engine();
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (!a || e.button !== 0) return;
            const h = a.getAttribute('href');
            if (h && (h.startsWith('/') || h.startsWith(window.location.origin)) && !h.includes('#')) {
                e.preventDefault(); e.stopImmediatePropagation();
                engine.ignite(h);
            }
        }, true);
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', bootstrap); } else { bootstrap(); }
})();