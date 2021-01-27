import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'https://unpkg.com/three@0.124.0/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.124.0/examples/jsm/loaders/OBJLoader.js';
import { Reflector } from 'https://unpkg.com/three@0.124.0/examples/jsm/objects/Reflector.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@0.124.0/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'https://unpkg.com/three@0.124.0/examples/jsm/helpers/RectAreaLightHelper.js';
import { ARButton } from 'https://unpkg.com/three@0.124.0/examples/jsm/webxr/ARButton.js';
let scene, camera, renderer, cameraControls;
let geometry;
let rectLight_1, rectLight_1Helper, rectLight_2, rectLight_2Helper;
let pos;
let turnLight_point = true;
let turnLight_spot = false;
let turnLight_rect = true;
let container = new THREE.Object3D();

let controller;

			let reticle;

			let hitTestSource = null;
         let hitTestSourceRequested = false;
         let xr = false;


function init() {
   renderer = new THREE.WebGLRenderer({ antialias: true });
   renderer.setPixelRatio(window.devicePixelRatio);
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.shadowMapType = THREE.PCFSoftShadowMap;
   renderer.shadowMap.enabled = true;

   renderer.xr.enabled = true;
   
   scene = new THREE.Scene();

   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.z = 3;

   cameraControls = new OrbitControls(camera, renderer.domElement);
   cameraControls.target.set(0, 0, 0);
   cameraControls.maxDistance = 5;
   cameraControls.minDistance = 0.3;
   cameraControls.minPolarAngle = Math.PI * 1 / 4;
   cameraControls.maxPolarAngle = Math.PI * 3 / 4;
   cameraControls.update();

   document.body.appendChild(renderer.domElement);

   document.body.appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );

   //

   const geometry = new THREE.CylinderBufferGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );
   function onSelect() {

      if ( reticle.visible ) {
         container.scale.set(0.2,0.2,0.2);
         container.visible = true;
         container.position.setFromMatrixPosition( reticle.matrix );     
      }

   }

   controller = renderer.xr.getController( 0 );
   controller.addEventListener( 'select', onSelect );
   scene.add( controller );

   reticle = new THREE.Mesh(
      new THREE.RingBufferGeometry( 0.1, 0.2, 4 ).rotateX( - Math.PI / 2 ),
      new THREE.MeshBasicMaterial()
   );
   reticle.matrixAutoUpdate = false;
   reticle.visible = false;
   scene.add( reticle );

   //

   window.addEventListener( 'resize', onWindowResize, false );

}
function onWindowResize() {

   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();

   renderer.setSize( window.innerWidth, window.innerHeight );

}


let buttons = document.getElementsByTagName("button");
buttons[0].addEventListener("click", onClickPointL, false);
buttons[1].addEventListener("click", onClickSpotL, false);
buttons[2].addEventListener("click", onClickRectL, false);

function onClickPointL(event) {
   if (turnLight_point) {
      let selectedObject = scene.getObjectByName("point_light");
      selectedObject.visible = false;
      turnLight_point = false;
   }
   else {
      let selectedObject = scene.getObjectByName("point_light");
      selectedObject.visible = true;
      turnLight_point  = true;
   }
}
function onClickSpotL(event) {
   if (turnLight_spot) {
      let selectedObject = scene.getObjectByName("spot_light");
      let room = scene.getObjectByName("Room");
      room.traverse(child => {
         if(child.name =="Cylinder.003_Cylinder.003_table_lamp_3")
         {
            child.material.emissiveIntensity = 0;
         }
      });
      selectedObject.visible = false;
      turnLight_spot = false;
   }
   else {
      let selectedObject = scene.getObjectByName("spot_light");
      let room = scene.getObjectByName("Room");
      room.traverse(child => {
         if(child.name =="Cylinder.003_Cylinder.003_table_lamp_3")
         {
            child.material.emissiveIntensity = 1;
         }
      });
      selectedObject.visible = true;
      turnLight_spot = true;
      //scene.add(selectedObject);
      //animate();
   }
}
function onClickRectL(event) {
   if (turnLight_rect) {
      let selectedObject = scene.getObjectByName("rect1_light");
      selectedObject.visible = false;
      selectedObject = scene.getObjectByName("rect2_light");
      selectedObject.visible = false;
      //scene.remove(selectedObject);
      //animate();
      turnLight_rect = false;
   }
   else {
      let selectedObject = scene.getObjectByName("rect1_light");
      selectedObject.visible = true;
      selectedObject = scene.getObjectByName("rect2_light");
      selectedObject.visible = true;
      turnLight_rect = true;
      //scene.add(selectedObject);
      //animate();
   }
}

function createObject() {
   //room
   var mtlLoader = new MTLLoader();
   mtlLoader.setPath("models/");
   mtlLoader.load("room.mtl", function (materials) {
      materials.preload();
      var objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('models/');
      objLoader.load('room.obj', function (object) {
         object.traverse(child => {
            child.receiveShadow = true;
            child.castShadow = true;
            if (child.material) {
               switch (child.material.name) {
                  case "floor":
                     child.material.map.repeat.set(10, 10);
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.6, metalness: 0.4, map: child.material.map });
                     break;
                  case "Cupboard":
                  case "shelf_wall":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.6, metalness: 0.2, color: '#c7681a' });
                     break;
                  case "Mat":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.9, metalness: 0.2, map: child.material.map });
                     child.material.map.repeat.x = 3;
                     break;
                  case "Mat_2":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.9, metalness: 0.2, map: child.material.map });
                     child.material.map.repeat.x = 5;
                     break;
                  case "Mat_border":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.9, metalness: 0.2, color: '#6bff75' });
                     break;
                  case "mat_2_border":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.9, metalness: 0.2, color: '#6bb0ff' });
                     break;
                  case "Table":
                  case "chair":
                  case "bed_cup":
                  case "bed":
                  case "frame_mirror":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.6, metalness: 0.4, color: '#c77c1a' });
                     break;
                  case "cover":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.9, metalness: 0.2, map: child.material.map, polygonOffsetFactor: 10 });
                     child.material.map.repeat.set(10, 10);
                     break;
                  case "curtain":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.6, metalness: 0.4, color: '#ff7d7d' });
                     break;
                  case "door":
                  case "window":
                  case "shelf":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.8, metalness: 0.68, color: '#757575' });
                     break;
                  case "garter":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.6, metalness: 0.4, color: '#ff4545' });
                     break;
                  case "lamp_glass":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, transparent: true, opacity: 0.5 });
                     break;
                  case "lamp_leg":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.3, metalness: 0.8, color: '#757575' });
                     break;
                  case "mat":
                  case "pillow":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.6, metalness: 0.2, color: '#ffffff' });
                     break;
                  case "roof":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 1, metalness: 0, color: '#ffffff' });
                     break;
                  case "chair_2":
                  case "table_leg":
                  case "table_leg_2":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.3, metalness: 0.8, color: '#757575' });
                     break;
                  case "wall":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 1, metalness: 0, color: '#bdffe0' });
                     break;
                  case "table_lamp":
                  case "leg_mirror":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 0.8, metalness: 0.6, color: '#757575' });
                     break;
                  case "table_lamp_2":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 1, metalness: 0.3, color: '#ff6421' });
                     break;
                  case "table_lamp_3":
                     child.material = new THREE.MeshStandardMaterial({ name: child.material.name, roughness: 1, metalness: 0.9, color: '#ffffff', emissive: 0xffffee, emissiveIntensity: 0 });
                     break;
               }
            }
         });
         object.position.set(0, 0, 0);
         object.scale.set(1, 1, 1);
         object.name = "Room";
         container.add(object);
         // scene.add(object);
      });
   });

   //mirror
   var objLoader = new OBJLoader();
   objLoader.setPath('models/');
   objLoader.load('mirror.obj', function (object) {
      object.traverse(child => {
         if (child.geometry) {
            child.geometry.computeBoundingSphere();
            pos = child.geometry.boundingSphere.center;
            geometry = new THREE.PlaneBufferGeometry(0.276, 0.559);
            let Mirror = new Reflector(geometry, {
               clipBias: 0.003,
               textureWidth: window.innerWidth * window.devicePixelRatio,
               textureHeight: window.innerHeigh * window.devicePixelRatio,
               color: 0x889999
            });
            Mirror.rotation.x = -8.644 * Math.PI / 180;
            Mirror.position.set(pos.x, pos.y, pos.z);
            Mirror.scale.set(1, 1, 1);
            container.add(Mirror);
            // scene.add(Mirror);
         }
      });
   });

   //light
      //point light
   let color = 0xFFFFFF;
   let intensity = 0.4;
   let bulbGeometry = new THREE.SphereBufferGeometry(0.02, 16, 8);
   let bulbMat = new THREE.MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000
   });
   let light = new THREE.PointLight(color, intensity);
   light.position.set(0, -0.1, -0.216);
   light.castShadow = true;
   light.shadowMapWidth = 512;
   light.shadowMapHeight = 512;
   light.name = "point_light";
   light.add(new THREE.Mesh(bulbGeometry, bulbMat));
   // scene.add(light);
   container.add(light);

   // var boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
   // var basicMaterial = new THREE.MeshBasicMaterial({color: 0x0095DD});
   // var cube = new THREE.Mesh(boxGeometry, basicMaterial);
   // cube.position.set(0.3, -0.98, 0);
   // scene.add(cube);


      //spot light
   let spot_intensity = 1;
   let spot_light = new THREE.SpotLight(color, spot_intensity, 4);
   spot_light.position.set(-0.83, -0.45, -0.76);
   spot_light.target.position.set(0.3, -0.98, 0);
   spot_light.penumbra = 1;
   spot_light.angle = 0.6;
   spot_light.name = "spot_light";
   spot_light.castShadow = true;
   spot_light.shadowMapWidth = 512;
   spot_light.shadowMapHeight = 512;
   spot_light.visible = false;
   container.add(spot_light);
   container.add(spot_light.target);
   // scene.add(spot_light);
   // scene.add(spot_light.target);

//    const helper = new THREE.SpotLightHelper(spot_light);
// scene.add(helper);
   
      //rect light
   RectAreaLightUniformsLib.init();
   let rectLight_intensity = 1;
   rectLight_1 = new THREE.RectAreaLight(color, rectLight_intensity, 0.6, 0.4);
   rectLight_1.position.set(0, -0.365, 0.58);
   rectLight_1.name = "rect1_light";
   // scene.add(rectLight_1);
   container.add(rectLight_1);
   rectLight_1Helper = new RectAreaLightHelper(rectLight_1);
   rectLight_1.add(rectLight_1Helper);

   rectLight_2 = new THREE.RectAreaLight(color, rectLight_intensity, 0.5, 0.8);
   rectLight_2.position.set(1, -0.57, 0.025);
   rectLight_2.rotation.y = THREE.MathUtils.degToRad(90);
   rectLight_2.name = "rect2_light";
   container.add(rectLight_2);
   // scene.add(rectLight_2);
   rectLight_2Helper = new RectAreaLightHelper(rectLight_2);
   rectLight_2.add(rectLight_2Helper);

   scene.add(container);
}

function update(timestamp, frame) {
   //requestAnimationFrame(update);
   if ( frame ) {
      const referenceSpace = renderer.xr.getReferenceSpace();
      const session = renderer.xr.getSession();

      if ( hitTestSourceRequested === false ) {
         container.visible = false;
         session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {

            session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {

               hitTestSource = source;

            } );

         } );

         session.addEventListener( 'end', function () {

            hitTestSourceRequested = false;
            hitTestSource = null;

         } );

         hitTestSourceRequested = true;

      }

      if ( hitTestSource ) {

         const hitTestResults = frame.getHitTestResults( hitTestSource );

         if ( hitTestResults.length ) {

            const hit = hitTestResults[ 0 ];
            reticle.visible = true;
            
            reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );

         } else {

            reticle.visible = false;

         }

      }

   }
   else
   {
      container.visible = true;
      container.scale.set(1,1,1);
      container.position.set(0,0,0);
      reticle.visible = false;
   }

   renderer.render(scene, camera);

}
function animate() {

   renderer.setAnimationLoop( update );

}

init();
createObject();
animate();