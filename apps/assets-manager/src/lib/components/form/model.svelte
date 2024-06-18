<script lang="ts">
	import type { StorageProps } from '@/components/form/types';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { onDestroy, onMount } from 'svelte';
	import { FileViewer } from '@/components';
	let { bucket, filename, filetype }: StorageProps & { filetype: 'glb' | 'fbx' } = $props();

	const loadingManager = new THREE.LoadingManager();
	const loader =
		filetype === 'fbx' ? new FBXLoader(loadingManager) : new GLTFLoader(loadingManager);

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

	async function bufferToModel(buffer: ArrayBuffer) {
		return new Promise<THREE.Group>((resolve, reject) => {
			loader.parse(
				buffer,
				'',
				(res) => {
					console.log(filetype, ' loaded');
					console.log(res.scene);
					resolve(res.scene);
				},
				(err) => {
					console.log('error while buffer to model');
					reject(err);
				}
			);
		});
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

	async function reloadFile(input: ArrayBuffer) {
		const newModel = await bufferToModel(input);
		setModel(newModel);
	}

	onMount(async () => {
		if (!parentDom) return;
		const result = await loader.loadAsync(`/api/storage/${bucket}/${filename}`);
		setModel(filetype === 'glb' ? result.scene : result);

		if (!model) return;

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
	});

	onDestroy(() => {
		if (frame) cancelAnimationFrame(frame);
		if (parentDom) parentDom.innerHTML = '';
	});
</script>

<div class="flex flex-row justify-end items-end gap-1">
	<label
		bind:this={parentDom}
		for="{bucket}-{filename}"
		class="size-60 bg-white/40 bg-center bg-contain bg-no-repeat cursor-pointer hover:opacity-80"
	>
	</label>

	<FileViewer {bucket} {filename} accept=".{filetype}" {reloadFile} />
</div>
