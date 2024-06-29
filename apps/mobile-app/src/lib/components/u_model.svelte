<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { onDestroy, onMount } from 'svelte';
	import { watch } from 'runed';

	import { DEFAULT_CAMERA_POS, FRAME_RATE, type CharacterAnimation } from '@/config';
	import { gameState, sysState } from '@/states';
	import { getFileUrl } from '@/utils';

	type Props = {
		wearingIds: string[];
		readonly?: boolean;
		animation?: CharacterAnimation;
		class?: string;
		cameraPosition?: [number, number, number];
		selfRotate?: boolean;
	};

	let {
		wearingIds,
		animation,
		cameraPosition = [...DEFAULT_CAMERA_POS],
		class: className,
		readonly = false,
		selfRotate = false
	}: Props = $props();

	let frame = 0;
	let mixer: THREE.AnimationMixer;
	let skeleton: THREE.Skeleton;
	let loadProgress = $state(0);
	let subLoadProgress = $state(0);

	let camera = $state<THREE.PerspectiveCamera>();
	let dom = $state<HTMLElement>();
	let body = $state<THREE.Object3D<THREE.Object3DEventMap>>();
	let modelLoaded = $derived(loadProgress >= 1);

	const animating = $derived(
		body?.animations?.some((a) => mixer?.clipAction(a).isRunning()) || false
	);

	const loader = new GLTFLoader();
	const renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
	const textureLoader = new THREE.TextureLoader();
	const wearingGroup = new THREE.Group();
	const scene = new THREE.Scene();
	const clock = new THREE.Clock();
	const light = new THREE.DirectionalLight('white', 3.3);

	light.position.set(1, 1, 1);
	renderer.domElement.id = 'u-model-renderer';
	scene.add(light);
	scene.add(wearingGroup);

	if (!readonly) {
		watch(
			() => wearingIds,
			() => {
				if (!body) {
					// console.error('body not found');
					return;
				}
				// modelLoaded = false;
				console.log('reloading wearings');
				loadWearings()
					// .then(() => {
					// 	modelLoaded = true;
					// })
					.catch((error) => {
						console.error(error);
					});
			}
		);
		watch(
			() => selfRotate,
			() => {
				if (body) body.rotation.set(0, 0, 0);
			}
		);

		watch(() => camera, setCamera);
	}

	function setCamera() {
		if (!camera) return;
		camera.position.set(...cameraPosition);
		camera.lookAt(0, cameraPosition[1] - 0.8, -2.5);
	}

	async function makeMaterial(wearing_id: string) {
		// const isNew = !$equippedWearings.includes(wearing_id);

		const url = getFileUrl('wearings', `textures/${wearing_id}`);

		try {
			const map = await textureLoader.loadAsync(`${url}_baseColor`);
			const normalMap = await textureLoader.loadAsync(`${url}_normal`);
			const roughnessMap = await textureLoader.loadAsync(`${url}_roughness`);
			const metalnessMap = await textureLoader.loadAsync(`${url}_metallic`);

			map.flipY = false;
			normalMap.flipY = false;
			roughnessMap.flipY = false;
			metalnessMap.flipY = false;

			return new THREE.MeshStandardMaterial({
				map,
				normalMap,
				roughnessMap,
				metalnessMap
			});
		} catch (error) {
			console.error(error);
			return new THREE.MeshBasicMaterial();
		}
	}

	async function loadWearings() {
		loadProgress = 0;

		if (!body) {
			console.log('body not found');
			return;
		}
		body.children.forEach((c) => (c.visible = true));

		for (const wearing of wearingGroup.children) {
			if (!wearingIds.includes(wearing.name)) {
				wearingGroup.children = wearingGroup.children.filter((c) => c.name !== wearing.name);
			}
		}

		// for (const wearing of gameState.wearings.filter((w) => wearingIds.includes(w.id))) {
		for (const wearing of wearingIds.map((id) => gameState.wearings.find((w) => w.id === id))) {
			if (!wearing) {
				return;
			}
			const { mesh, body_parts, id } = wearing;

			for (const { value: body_part } of body_parts) {
				const hidden = body.children.findIndex((c) => c.name === `${body_part}`);

				if (hidden !== -1) {
					body.children[hidden].visible = false;
				}
			}

			if (wearingGroup.children.some((c) => c.name === id)) {
				loadProgress += 1 / wearingIds.length;
				continue;
			}

			const url = getFileUrl('meshes', `glb/${mesh}`);

			const gltf = await loader.loadAsync(url, (progress) => {
				console.log(progress);
				const { loaded, total } = progress;
				subLoadProgress = loaded / total;
			});
			const obj = gltf.scene;
			const skinnedMesh = obj.children[0].children[0] as THREE.SkinnedMesh;

			if (skeleton) skinnedMesh.skeleton = skeleton;
			if (wearing.texture_types.length > 0) {
				skinnedMesh.material = await makeMaterial(id);
			}
			obj.name = id;
			wearingGroup.add(obj);
			subLoadProgress = 0;
			loadProgress += 1 / wearingIds.length;
		}
	}

	function playAnimation() {
		if (!body || !mixer) return;
		mixer.stopAllAction();
		const action = body.animations.find((a) => a.name === animation);
		if (action) mixer.clipAction(action).play();
	}

	async function loadBody() {
		const gltf = await loader.loadAsync('/models/main_body.glb');
		body = gltf.scene.children[0];
		body.animations = gltf.animations;

		skeleton = (body.children[0] as THREE.Object3D & { skeleton: THREE.Skeleton }).skeleton;
		body.position.setY(-1.5);
		scene.add(body);

		const skinMaterial = new THREE.MeshToonMaterial({
			color: 'pink'
		});

		for (const child of body.children.filter(
			(c) => c.type === 'SkinnedMesh'
		) as THREE.SkinnedMesh[]) {
			child.material = skinMaterial;
		}

		if (!mixer) mixer = new THREE.AnimationMixer(body);

		playAnimation();
	}

	onMount(async () => {
		if (!dom) return;

		await loadBody();
		console.log('body loaded');
		await loadWearings();
		console.log('wearings loaded');

		// modelLoaded = true;

		renderer.setSize(dom.clientWidth, dom.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio / 1.5);
		dom.appendChild(renderer.domElement);
		camera = new THREE.PerspectiveCamera(100, dom.clientWidth / dom.clientHeight, 0.1, 2000);

		setCamera();

		function animate() {
			scene.traverse((obj) => {
				obj.frustumCulled = false;
			});

			if (animating && modelLoaded && camera) {
				if (body && selfRotate) body.rotateY(-0.1);
				const deltaTime = clock.getDelta();
				if (mixer) mixer.update(deltaTime);
				renderer.render(scene, camera);
			}

			setTimeout(() => {
				frame = requestAnimationFrame(animate);
			}, 1000 / FRAME_RATE);
		}

		animate();
	});

	onDestroy(() => {
		cancelAnimationFrame(frame);
		scene.clear();
		if (dom) dom.removeChild(renderer.domElement);
	});
</script>

<div
	bind:this={dom}
	class="{className} {modelLoaded && animating ? 'opacity-100' : 'opacity-0'}"
></div>

{#if !modelLoaded}
	<div class="full-screen center-content pointer-events-none flex flex-col gap-1">
		<span>
			loading{'.'.repeat(sysState.now.getTime() % 4)}
		</span>
		<div class="flex h-2 w-[80vw] flex-row bg-white">
			<div
				class="h-full bg-rose-800 transition-all duration-500"
				style="width: {(100 * loadProgress).toFixed(2)}%"
			></div>
			<div class="flex flex-row" style="width: {100 / wearingIds.length}%;">
				<div
					class="h-full bg-cyan-800 transition-all duration-100"
					style="width: {(100 * subLoadProgress).toFixed(2)}%"
				></div>
			</div>
		</div>
	</div>
{/if}
