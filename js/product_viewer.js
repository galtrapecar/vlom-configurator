import * as THREE from '../3d/node_modules/three/build/three.module.js';
import {GLTFLoader} from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from './node_modules/three/examples/jsm/loaders/RGBELoader.js';

let camera2, scene2, renderer2, controls2;

let canvas = document.querySelector('.gui_object_info');

// MacOS Test

let IS_MacOS;

function MacOSTest() {
    if ( window.navigator.platform == 'MacIntel' || window.navigator.platform == 'MacPPC' || window.navigator.platform == 'Mac68K' ) {
        IS_MacOS = true;
    } else {
        IS_MacOS = false;
    }
}

window.onload = MacOSTest();

// INIT

function init2() {

    scene2 = new THREE.Scene();

    camera2 = new THREE.PerspectiveCamera(
        75, 
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );

    renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer2.outputEncoding = THREE.sRGBEncoding;
    renderer2.setSize( canvas.clientWidth, canvas.clientHeight );
    if (! IS_MacOS ) renderer.setPixelRatio( window.devicePixelRatio );
    if ( IS_MacOS ) renderer.setPixelRatio( window.devicePixelRatio / 2 );
    renderer2.gammaFactor = 2.2;
    renderer2.toneMapping = THREE.ReinhardToneMapping;
    renderer2.toneMappingExposure = 2.3;

    renderer2.domElement.style.borderRadius = '0 0px 5px 5px';
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.zIndex = '999';

    canvas.appendChild( renderer2.domElement );

    // MODEL LOADER

    const loader2 = new GLTFLoader();

    loader2.load(

        '../gltf/3d/narvik.glb',

        function ( gltf ) {

            gltf.scene.name = 'narvik';
            scene.add( gltf.scene );

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

    // HDR

    new RGBELoader()
        .setDataType( THREE.UnsignedByteType )
        .setPath( '../hdr/' )
        .load( 'kloppenheim_06_1k.hdr', ( texture ) => {

            const pmremGenerator = new THREE.PMREMGenerator( renderer );

            const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

            scene.environment = envMap;

            texture.dispose();
			pmremGenerator.dispose();

    });

    // CONTROLS

    controls2 = new OrbitControls( camera, renderer.domElement );

    // CAMERA POSITION

    camera2.position.x = -5;

    camera2.lookAt( scene.position );

    // LIGHTS

    const light = new THREE.AmbientLight( 0xffffff, 0.7 ); // soft white light
    scene.add( light );

    const light2  = new THREE.DirectionalLight( 0xffffff, 0.6);
    light2.position.set(0.5, 0, 0.866);
    scene.add( light2 );

}

function animate2() {

    requestAnimationFrame( animate );
    
    renderer2.render( scene, camera );

}

function onWindowResize2() {

    camera2.aspect = canvas.clientWidth / canvas.clientHeight;
    camera2.updateProjectionMatrix();

    renderer2.setSize( canvas.clientWidth, canvas.clientHeight );

}

window.addEventListener( 'resize', onWindowResize2, false );

init2();
animate2();