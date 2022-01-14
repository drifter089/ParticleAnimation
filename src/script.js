import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const parTexture = textureLoader.load("textures/particles/2.png");

/**
 * Particles
 */
// geometry
// const particleGeo = new THREE.SphereBufferGeometry(1, 32, 32);

const count = 25000;
const particleGeo = new THREE.BufferGeometry();

const verData = new Float32Array(count * 3);
const colooor = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  const a = (Math.random() - 0.5) * 10;
  verData[i] = a;
  colooor[i] = Math.random();
}

const posAttribute = new THREE.BufferAttribute(verData, 3);
particleGeo.setAttribute("position", posAttribute);

const colAttribute = new THREE.BufferAttribute(colooor, 3);
particleGeo.setAttribute("color", colAttribute);
console.log(particleGeo);

// Material
const particleMat = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  //   color: "red",
  transparent: true,
  alphaMap: parTexture,
  alphaTest: 0.001,
});

particleMat.blending = THREE.AdditiveBlending;
particleMat.vertexColors = true;

// particleMat.depthTest = false;
// particleMat.depthWrite = false;
// just to check depth test
// const cube = new THREE.Mesh(
//   new THREE.BoxBufferGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

// Points

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Particles
  particles.rotation.x = elapsedTime * 0.2;
  particles.rotation.y = elapsedTime * 0.2;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const x = particleGeo.attributes.position.array[i3];
    particleGeo.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
  }

  particleGeo.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
