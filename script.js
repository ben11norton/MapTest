// Setup scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(0, 50, 100);
camera.lookAt(0, 0, 0);

// Setup renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('map').appendChild(renderer.domElement);

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, 50);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

// Fake elevation data
const size = 64;
const elevationData = [];
for (let i = 0; i < size * size; i++) {
  const x = i % size;
  const y = Math.floor(i / size);
  elevationData.push(Math.sin(x * 0.2) * Math.cos(y * 0.2) * 5);
}

// Create terrain geometry
const geometry = new THREE.PlaneGeometry(100, 100, size - 1, size - 1);
const vertices = geometry.attributes.position.array;

for (let i = 0, j = 0; i < elevationData.length; i++, j += 3) {
  vertices[j + 2] = elevationData[i]; // Set Z elevation
}

geometry.computeVertexNormals();

const material = new THREE.MeshLambertMaterial({
  color: 0x88cc88,
  wireframe: false,
});

const terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the terrain slowly so you can see it in 3D
  // terrain.rotation.z += 0.002;

  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function zoomOnMap(){
 // Zoom in by moving the camera closer on Z axis
  camera.position.z = Math.max(camera.position.z - 100, 10); // don't get too close, min 10

  // Rotate the terrain a bit around Y axis (for a nice twist)
  // terrain.rotation.y += 0.1;

    terrain.rotation.x -= 0.7;

  // Optional: update camera lookAt if you want to keep focus
  camera.lookAt(0, 0, 0);

  // Re-render immediately after change
  renderer.render(scene, camera);
}
