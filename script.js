import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


let scene, camera, renderer, controls;
let pointLight, gui, moonLight, ghost1, ghost2, ghost3;

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Enable shadow maps in the renderer
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor("#262837");
  document.body.appendChild(renderer.domElement);


  // Controls
  controls = new OrbitControls(camera, renderer.domElement);

  // Fogs
  const fog = new THREE.Fog("#262837", 1, 20);
  scene.fog = fog;

  // Texture Loader
  const textureLoader = new THREE.TextureLoader();
  const planeTexture = textureLoader.load("static/grass/color.png");
  const planeroughTexture = textureLoader.load("static/grass/rough.png");
  const planeambientTexture = textureLoader.load("static/grass/amb.png");
  const planenoramalTexture = textureLoader.load("static/grass/nor.png");

  // Commented out code for texture wrapping
  // planeTexture.repeat.set(8, 8);
  // planeroughTexture.repeat.set(8, 8);
  // planeambientTexture.repeat.set(8, 8);
  // planenoramalTexture.repeat.set(8, 8);

  // planeTexture.wrapS = THREE.RepeatWrapping;
  // planeroughTexture.wrapS = THREE.RepeatWrapping;
  // planeambientTexture.wrapS = THREE.RepeatWrapping;
  // planenoramalTexture.wrapS = THREE.RepeatWrapping;

  // planeTexture.wrapT = THREE.RepeatWrapping;
  // planeroughTexture.wrapT = THREE.RepeatWrapping;
  // planeambientTexture.wrapT = THREE.RepeatWrapping;
  // planenoramalTexture.wrapT = THREE.RepeatWrapping;

  const doorTexture = textureLoader.load("static/door/door2.jpg");

  const bricksColorTexture = textureLoader.load("static/bricks/1.png");
  const ambientColorBricks = textureLoader.load("static/bricks/ambient.png");
  const normalColorBricks = textureLoader.load("static/bricks/noramol.png");
  const roughColorBricks = textureLoader.load("static/bricks/rough.png");

  // House
  const house = new THREE.Group();
  scene.add(house);

  // Walls
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
      map: bricksColorTexture,
      aoMap: ambientColorBricks,
      normalMap: normalColorBricks,
      roughness: roughColorBricks,
    })
  );
  walls.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
  );
  walls.castShadow = true;
  walls.position.y = 1.251;
  house.add(walls);

  // Roof
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: "#b35f45" })
  );
  roof.position.y = 2.5 + 0.5;
  roof.rotation.y = Math.PI * 0.25;
  house.add(roof);

  // Door
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({
      map: doorTexture,
    })
  );
  door.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
  );
  door.position.y = 1;
  door.position.z = 2 + 0.01;
  house.add(door);

  // Bushes
  const bushGeo = new THREE.SphereGeometry(1, 16, 16);
  const bushmat = new THREE.MeshStandardMaterial({ color: "#89c854" });

  const bush1 = new THREE.Mesh(bushGeo, bushmat);
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);
  bush1.castShadow = true;

  const bush2 = new THREE.Mesh(bushGeo, bushmat);
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);
  bush2.castShadow = true;


  const bush3 = new THREE.Mesh(bushGeo, bushmat);
  bush3.scale.set(0.15, 0.15, 0.15);
  bush3.position.set(-1, 0.05, 2.6);
  bush3.castShadow = true;


  const bush4 = new THREE.Mesh(bushGeo, bushmat);
  bush4.scale.set(0.4, 0.4, 0.4);
  bush4.position.set(-0.8, 0.1, 2.2);
  bush4.castShadow = true;


  house.add(bush1, bush2, bush3, bush4);

  // Graves Group
  const graves = new THREE.Group();
  scene.add(graves);

  // Graves
  const gravegeo = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const gravemat = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const grave = new THREE.Mesh(gravegeo, gravemat);
    grave.position.set(x, 0.3, z);
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;
    graves.add(grave);
  }

  // Add Plane
  const planeGeometry = new THREE.PlaneGeometry(20, 20);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: planeTexture,
    aoMap: planeambientTexture,
    roughnessMap: planeroughTexture,
    normalMap: planenoramalTexture,
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI * 0.5;
  plane.receiveShadow = true; // Enable the plane to receive shadows
  scene.add(plane);

  // Ambient Light
  const ambientLight = new THREE.AmbientLight("#b9d5ff", 0);
  scene.add(ambientLight);

  // Point Light
  pointLight = new THREE.PointLight("#ff7d46", 1, 7);
  pointLight.position.set(0, 1.1, 2.7);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 256;
  pointLight.shadow.mapSize.height = 256;
  pointLight.shadow.camera.far = 7;


  scene.add(pointLight);

  // Moonlight
  moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
  moonLight.position.set(4, 5, -2);
  moonLight.castShadow = true;
  scene.add(moonLight);

  // Ghosts
  ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
  ghost1.castShadow = true;
  ghost1.shadow.mapSize.width = 256;
  ghost1.shadow.mapSize.height = 256;
  ghost1.shadow.camera.far = 7;
  scene.add(ghost1);

  ghost2 = new THREE.PointLight('#00ffff', 2, 3);
  ghost2.castShadow = true;
  ghost2.shadow.mapSize.width = 256;
  ghost2.shadow.mapSize.height = 256;
  ghost2.shadow.camera.far = 7;
  scene.add(ghost2);

  ghost3 = new THREE.PointLight('#ffff00', 2, 3);
  ghost3.castShadow = true;
  ghost3.shadow.mapSize.width = 256;
  ghost3.shadow.mapSize.height = 256;
  ghost3.shadow.camera.far = 7;
  scene.add(ghost3);

  

  // Resize listener
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts movement
  if (ghost1) {
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3) ;
  } else {
    console.warn('ghost1 is not defined');
  }

  if (ghost2) {
    const ghost2Angle = -elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  }

  if (ghost3) {
    const ghost3Angle = - elapsedTime * 0.18;
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * .32));
    ghost3.position.z = Math.sin(ghost3Angle) *(7 + Math.sin(elapsedTime * .32));
    ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);
  }

  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

init();
