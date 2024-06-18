<script lang="ts">
	import type { StorageProps } from '@/components/form/types';

	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	import { onDestroy } from 'svelte';
	import { FileViewer } from '@/components';

	let { bucket, filename, filetype }: StorageProps & { filetype: 'glb' | 'fbx' } = $props();

	const loader = filetype === 'fbx' ? new FBXLoader() : new GLTFLoader();

	const renderer = new THREE.WebGLRenderer({ alpha: true });
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
	const controls = new OrbitControls(camera, renderer.domElement);
	const light = new THREE.DirectionalLight('white', 1);
	const subLight = new THREE.DirectionalLight('white', 0.3);
	const axesHelper = new THREE.AxesHelper(100);

	let model = $state<THREE.Group>();
	let parentDom = $state<HTMLLabelElement>();
	let frame = $state<number>();
	let skeletonHelper = $state<THREE.SkeletonHelper>();

	async function blobToModel(blob: Blob) {
		const url = URL.createObjectURL(blob);
		const result = await loader.loadAsync(url);
		return (result as { scene: THREE.Group }).scene ?? (result as THREE.Group);
	}

	function setModel(newModel: THREE.Group) {
		if (model) scene.remove(model);
		if (skeletonHelper) scene.remove(skeletonHelper);

		model = newModel;
		skeletonHelper = new THREE.SkeletonHelper(model);
		if (filetype === 'fbx') model.scale.set(0.01, 0.01, 0.01);
		scene.add(skeletonHelper);
		scene.add(model);
	}

	async function reloadFile(input: Blob) {
		const newModel = await blobToModel(input);
		setModel(newModel);
	}

	function init() {
		if (!model || !parentDom) return;
		camera.position.set(1, 2, 2);
		camera.lookAt(1, 1, 1);
		light.position.set(10, 20, 0).normalize();
		subLight.position.set(-10, -20, 0);

		scene.add(model);
		scene.add(light);
		scene.add(subLight);
		scene.add(axesHelper);

		renderer.setPixelRatio(window.devicePixelRatio * 1.3);
		renderer.setSize(parentDom.clientWidth, parentDom.clientHeight);
		parentDom.appendChild(renderer.domElement);

		function animate() {
			frame = requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		}

		animate();
	}

	onDestroy(() => {
		if (frame) cancelAnimationFrame(frame);
		if (parentDom) parentDom.innerHTML = '';
	});
</script>

<div class="flex flex-row justify-end items-end gap-1">
	<label
		bind:this={parentDom}
		for="{bucket}-{filename}"
		class="size-60 bg-white/30 bg-center bg-contain bg-no-repeat cursor-pointer hover:opacity-80"
	>
	</label>

	<FileViewer {bucket} {filename} accept=".{filetype}" {reloadFile} {init} />
</div>
