import * as THREE from '../3d/node_modules/three/build/three.module.js';
import {GLTFLoader} from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {PointerLockMovementControls} from './node_modules/three/examples/jsm/controls/PointerLockMovementControls.js';
import {PointerLockControls} from './node_modules/three/examples/jsm/controls/PointerLockControls.js';

import Stats from './stats.js-master/build/stats.module.js';
    
let scene, camera, renderer, controls, clock, obj, mixer, stats, mouse, raycaster, inControl;

let MovementControls, PointerControls, setPointer, setMovement;

function init() {

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x626262);

    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaFactor = 2.2;

    renderer.domElement.id = 'canvas';

    document.body.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    setPointer = document.getElementById('btn');
    setMovement = document.getElementById('btn2');

    // ADD MODELS

    const loader = new GLTFLoader();

    loader.load(
        '../gltf/3d/cesna-final.glb',

        function (gltf) {
            obj = gltf.scene;
            let i = 0;

            // ANIMATIONS
            mixer = new THREE.AnimationMixer(obj);

            gltf.scene.position.set(0,-1,0);
            gltf.scene.rotation.y = Math.PI / 2;
            scene.add(gltf.scene);

            function onClick() {

                event.preventDefault();
                
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                mouse.z = 0;
            
                camera.getWorldPosition(pos);
                camera.getWorldDirection(dir)
                
                raycaster = new THREE.Raycaster();
                raycaster.set( pos, dir );
                
                var intersects = raycaster.intersectObject(obj, true);
                
                if (intersects.length > 0) {

                    if ( intersects[2].object ) {

                    function flipflop() {
                        i = i ? 0 : 1;
    
                        if (i === 1) {
                        gltf.animations.forEach((clip) => {
                            var action = mixer.clipAction(clip);
                            action.timeScale = 1;
                            action.paused = false;
                            action.setLoop( THREE.LoopOnce );
                            action.clampWhenFinished = true;
                            action.play();
                        });
                        } else {
                            gltf.animations.forEach((clip) => {
                                var action = mixer.clipAction(clip);
                                action.paused = false;
                                action.timeScale = -1;
                                action.setLoop( THREE.LoopOnce );
                                action.play();
                            });
                        }
    
                            return i;
                    }
                        
                    i = flipflop();

                    }
                
                }
                    
                renderer.render(scene, camera);

            }

            document.addEventListener('click', function() {
                if ( inControl == true ) { onClick(); }
            });

        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    
        },
        function (error) {

            console.log('An error happened');

            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
            const cube = new THREE.Mesh( geometry, material );
            scene.add( cube );
    
        }
    );

    // WALL

    loader.load(
        '../gltf/3d/wall.glb',

        function (gltf) {
            obj = gltf.scene;

            gltf.scene.position.set(0,-1,0);
            gltf.scene.rotation.y = Math.PI / 2;
            scene.add(gltf.scene);

        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    
        },
        function (error) {

            console.log('An error happened');

            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial( {color: 0x000000} );
            const cube = new THREE.Mesh( geometry, material );
            scene.add( cube );
    
        }
    );

    // FLOOR

    loader.load(
        '../gltf/3d/floor.glb',

        function (gltf) {
            obj = gltf.scene;

            gltf.scene.position.set(0,-1,0);
            gltf.scene.rotation.y = Math.PI / 2;
            scene.add(gltf.scene);

        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    
        },
        function (error) {

            console.log('An error happened');

            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial( {color: 0x000000} );
            const cube = new THREE.Mesh( geometry, material );
            scene.add( cube );
    
        }
    );

    loader.load(
        '../gltf/3d/floor-wood2.glb', // WOOD FLOOR

        function (gltf) {
            obj = gltf.scene;

            gltf.scene.position.set(0,-1,0);
            gltf.scene.rotation.y = Math.PI / 2;
            scene.add(gltf.scene);

        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    
        },
        function (error) {

            console.log('An error happened');

            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial( {color: 0x000000} );
            const cube = new THREE.Mesh( geometry, material );
            scene.add( cube );
    
        }
    );

    // CONTROLS

    setPointer.addEventListener('click', function() {
        inControl = true;
        PointerControls = true;
        MovementControls = false;

        controls.dispose(); 
        controls = new PointerLockControls(camera, renderer.domElement);

        controls.lock();
    });

    setMovement.addEventListener('click', function() {
        inControl = true;
        PointerControls = false;
        MovementControls = true;

        controls.dispose(); 
        controls = new PointerLockMovementControls(camera, renderer.domElement);
        
        controls.lock();
    });


    document.onmousedown = function () {
        let e = window.event;
        document.addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
        });

        if (e.which === 3 || e.button === 2) {
            inControl = false;
            PointerControls = false;
            MovementControls = false;
            controls.unlock();
        }
    };

    // CLOCK

    clock = new THREE.Clock();

    // LIGHTS

    const light = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light);

    const pointLight = new THREE.PointLight(0x404040, 20);
    pointLight.position.z = 5;
    pointLight.position.x = -3;
    pointLight.position.y = 2;

    const pointLight3 = new THREE.PointLight(0x404040, 20);
    pointLight3.position.x = -5;
    pointLight3.position.y = 2;

    const pointLight4 = new THREE.PointLight(0x404040, 20);
    pointLight4.position.z = -5;
    pointLight4.position.x = -3;
    pointLight4.position.y = 2;

    const pointLight2 = new THREE.PointLight(0x404040, 20);
    pointLight2.position.x = 5;
    pointLight2.position.y = 2;

    const pointLight6 = new THREE.PointLight(0x404040, 20);
    pointLight6.position.z = -5;
    pointLight6.position.x = 3;
    pointLight6.position.y = 2;

    const pointLight7 = new THREE.PointLight(0x404040, 20);
    pointLight7.position.z = 5;
    pointLight7.position.x = 3;
    pointLight7.position.y = 2;

    const pointLight5 = new THREE.PointLight(0x404040, 20);
    pointLight5.position.y = 5;
    pointLight5.position.y = 2;
    scene.add(pointLight, pointLight2, pointLight3, pointLight4, pointLight5, pointLight6, pointLight7);

    // HELPERS

    /* const size = 100;
    const divisions = 100;

    const gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper ); */

    // CAMERA POSITION

    camera.position.x = -2.5;
    camera.position.y = .5;

    camera.lookAt(scene.position);

    // STATS

    stats = new Stats();
    stats.showPanel( 0 );
    document.body.appendChild( stats.dom );

    console.log(renderer.info);

}

function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    
    if ( mixer ) mixer.update( delta );

    //if ( MovementControls == true ) { controls.update( delta ); camera.position.y = .5; }

    stats.update();

    stats.begin();
    renderer.render(scene, camera);
    stats.end();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

mouse = new THREE.Vector2();

let pos = new THREE.Vector3();
let dir = new THREE.Vector3();

init();
animate();