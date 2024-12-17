import './style.css';
import * as THREE from './three.js-r145/build/three.module.js';
import { OrbitControls } from './three.js-r145/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);
renderer.render(scene, camera);

// Create controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);

// Function to add stars to the scene
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  
  // Randomly position the star
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  
  scene.add(star);
}

// Populate the scene with 200 stars
Array(200).fill().forEach(addStar);

// Load background texture
const spaceTexture = new THREE.TextureLoader().load('SPACENEBULA.jpg', (texture) => {
  console.log('Background texture loaded successfully!');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  scene.background = texture;
}, undefined, () => {
  console.error('Error loading space.jpg. Check the path or file.');
});

// Load moon texture
const moonTexture = new THREE.TextureLoader().load('moon.jpg', () => {
  console.log('Moon texture loaded successfully!');
}, undefined, (err) => {
  console.error('Error loading moon texture', err);
});

// Load normal map (optional)
const normalTexture = new THREE.TextureLoader().load('Normal.jpg');

// Create moon material with normal map
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,         // Base texture
  normalMap: normalTexture, // Normal map for surface detail
  emissive: new THREE.Color(0xffffff),  // Make it glow slightly
  emissiveIntensity: 0.1,   // Adjust emissive intensity for a more natural look
  roughness: 0.3,           // Adjust roughness for better lighting
  metalness: 0.0            // Keep it non-metallic
});

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Increased intensity
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Decreased intensity, increased range
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Stronger directional light
directionalLight.position.set(25, 10, 10);
scene.add(directionalLight);

const backLight = new THREE.PointLight(0xffffff, 0.5, 100);  // Soft light
backLight.position.set(-40, 0, 0);  // Position it behind Saturn
scene.add(backLight);

// Create moon mesh and add it to the scene
const moon = new THREE.Mesh(new THREE.SphereGeometry(3, 64, 64), moonMaterial);
moon.position.set(20, 0, 0);  // Position the moon so it's within the camera view
scene.add(moon);

moon.position.z = 30;
moon.position.setX(10);

// Saturn Texture and Ring
const saturnTexture = new THREE.TextureLoader().load('SaturnTExture2.jpeg');  // Saturn's body texture

// Create Saturn's body
const saturnMaterial = new THREE.MeshStandardMaterial({
  map: saturnTexture,          // Base texture for Saturn
  roughness: 0.5,
  metalness: 0.0
});

const saturn = new THREE.Mesh(new THREE.SphereGeometry(5, 64, 64), saturnMaterial);
saturn.position.set(-15, 0, 0);  // Position Saturn to the left
scene.add(saturn);

// Load a ring texture for Saturn's rings
const ringTexture = new THREE.TextureLoader().load('PngItem_328195.png'); // Replace with the path to your texture

// Create Saturn's rings using RingGeometry
const saturnRingGeometry = new THREE.RingGeometry(6, 12, 64);  // Inner radius, outer radius, segments
const saturnRingMaterial = new THREE.MeshBasicMaterial({
  map: ringTexture,      // Use the ring texture
  side: THREE.DoubleSide, // Make sure it renders on both sides
  transparent: true,     // Enable transparency for the texture
  opacity: 0.8           // Adjust opacity if needed
});

// Create the ring mesh and add it to the scene
const saturnRings = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRings.rotation.x = Math.PI / 2;  // Rotate to align rings horizontally
saturnRings.position.set(-15, 0, 0);   // Position the rings around Saturn
scene.add(saturnRings);

// Function to move the camera with scroll
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05; 
  moon.rotation.y += 0.075; 
  moon.rotation.z += 0.05; 

  saturn.rotation.x += 0.02;
  saturn.rotation.y += 0.03;

  saturnRings.rotation.z += 0.01; // Rotate rings continuously

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002; 
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();
