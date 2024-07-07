<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { onDestroy, onMount } from 'svelte';
	import { watch } from 'runed';

	import { DEFAULT_CAMERA_POS, FRAME_RATE, type CharacterAnimation } from '@/config';
	import { gameState, sysState } from '@/states';
	import { getFileUrl } from '@/utils';
	import { DEFAULT_SKIN_COLOR } from '@repo/shared/config';

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
	// let loadProgress = $state(0);
	let subLoadProgress = $state([0, 0]);

	let camera = $state<THREE.PerspectiveCamera>();
	let dom = $state<HTMLElement>();
	let body = $state<THREE.Object3D<THREE.Object3DEventMap>>();

	const animating = $derived(
		body?.animations?.some((a) => mixer?.clipAction(a).isRunning()) || false
	);

	const wearingGroup = new THREE.Group();
	const loader = new GLTFLoader();
	const renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
	const textureLoader = new THREE.TextureLoader();
	const scene = new THREE.Scene();
	const clock = new THREE.Clock();
	const light = new THREE.DirectionalLight('white', 3.3);

	// const loadProgress = $derived(wearingGroup?.children.length / wearingIds.length);
	// const modelLoaded = $derived(loadProgress >= 1);

	let ready = $state(false);
	let loaded = $state(0);

	light.position.set(1, 1, 1);
	renderer.domElement.id = 'u-model-renderer';
	scene.add(light);
	scene.add(wearingGroup);

	if (!readonly) {
		watch(
			() => wearingIds,
			() => {
				if (!body) return;
				console.log('reloading wearings');
				loadWearings().catch((error) => {
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

		watch(() => cameraPosition, setCamera);
	}

	function setCamera() {
		if (!camera) return;
		camera.position.set(...cameraPosition);
		camera.lookAt(0, cameraPosition[1] - 0.8, -2.5);
	}

	async function makeMaterial(wearing_id: string, is_expression: boolean) {
		// const isNew = !$equippedWearings.includes(wearing_id);
		try {
			subLoadProgress[1] = 0;
			const TEXTURE_TYPES = is_expression
				? ['baseColor']
				: ['baseColor', 'metallic', 'roughness', 'normal'];

			//@ts-ignore
			let result: Record<(typeof TEXTURE_TYPES)[number], THREE.Texture> = {};
			await Promise.all(
				TEXTURE_TYPES.map(
					(texture_type) =>
						new Promise<void>(async (resolve) => {
							const { data } = await getFileUrl(
								'wearings',
								`textures/${wearing_id}_${texture_type}`,
								'image/webp'
							);
							result[texture_type] = await textureLoader.loadAsync(data);
							result[texture_type].flipY = false;
							subLoadProgress[1] += 0.25;
							resolve();
						})
				)
			);

			return is_expression
				? new THREE.MeshStandardMaterial({
						map: result.baseColor,
						transparent: true
						// side: THREE.DoubleSide
					})
				: new THREE.MeshStandardMaterial({
						map: result.baseColor,
						normalMap: result.normal,
						roughnessMap: result.roughness,
						metalnessMap: result.metallic
					});
		} catch (error) {
			console.error(error);
			return new THREE.MeshBasicMaterial();
		}
	}

	async function loadWearings() {
		// loadProgress = wearingIds.length > 0 ? 0 : 1;

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

		const promises: Promise<void>[] = [];

		for (const wearing of wearingIds.map((id) => gameState.wearings.find((w) => w.id === id))) {
			if (!wearing) {
				console.error(`wearing ${wearing.id} not found`);
				loaded++;
				return;
			}

			const mesh = gameState.meshes.find((m) => m.id === wearing.mesh);
			if (!mesh) {
				console.error(`mesh of wearing ${wearing.id} not found`);
				loaded++;
				return;
			}

			const { body_parts } = mesh;
			const { id } = wearing;

			for (const { value: body_part } of body_parts) {
				const hidden = body.children.findIndex((c) => c.name === `${body_part}`);

				if (hidden !== -1) {
					body.children[hidden].visible = false;
				}
			}

			if (wearingGroup.children.some((c) => c.name === id)) {
				// loadProgress += 1 / wearingIds.length;
				loaded++;
				continue;
			}

			promises.push(
				new Promise<void>(async (resolve) => {
					const { data } = await getFileUrl('meshes', `glb/${mesh.id}`, 'model/gltf-binary');

					const gltf = await loader.loadAsync(data, (progress) => {
						const { loaded, total } = progress;
						subLoadProgress[0] = loaded / total;
					});
					const obj = gltf.scene;
					const skinnedMesh = obj.children[0].children[0] as THREE.SkinnedMesh;

					if (skeleton) skinnedMesh.skeleton = skeleton;
					const { is_expression } = wearing.category;
					if (wearing.texture_types.length > 0) {
						skinnedMesh.material = await makeMaterial(id, is_expression);
					}
					obj.name = id;
					wearingGroup.add(obj);
					subLoadProgress[0] = 0;
					loaded++;
					// loadProgress += 1 / (wearingIds.length - 1);
					resolve();
				})
			);
		}
		await Promise.all(promises);
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
			color: new THREE.Color(
				`rgb(${DEFAULT_SKIN_COLOR.X}, ${DEFAULT_SKIN_COLOR.Y}, ${DEFAULT_SKIN_COLOR.Z})`
			),
			emissive: 'red',
			emissiveIntensity: 0.4
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

		renderer.setSize(dom.clientWidth, dom.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio / 1.5);
		dom.appendChild(renderer.domElement);
		camera = new THREE.PerspectiveCamera(100, dom.clientWidth / dom.clientHeight, 0.1, 2000);

		setCamera();

		await loadBody();
		await loadWearings();
		ready = true;

		animate();

		function animate() {
			scene.traverse((obj) => {
				obj.frustumCulled = false;
			});

			if (animating && ready && camera) {
				if (body && selfRotate) body.rotateY(-0.1);
				const deltaTime = clock.getDelta();
				if (mixer) mixer.update(deltaTime);
				renderer.render(scene, camera);
			}

			setTimeout(() => {
				frame = requestAnimationFrame(animate);
			}, 1000 / FRAME_RATE);
		}
	});

	onDestroy(() => {
		cancelAnimationFrame(frame);
		scene.clear();
		if (dom) dom.removeChild(renderer.domElement);
	});
</script>

<div bind:this={dom} class="{className} "></div>

{#if !ready}
	<div class="full-screen center-content pointer-events-none flex flex-col gap-1">
		<span>
			loading{'.'.repeat(sysState.now.getTime() % 4)}
		</span>
		<div class="flex h-3 w-[80vw] flex-row bg-white">
			<div
				class="h-full bg-rose-800 transition-all duration-500"
				style="width: {(100 * (loaded / wearingIds.length)).toFixed(2)}%"
			></div>
			{#each { length: 2 } as _, i}
				<div class="flex flex-row" style="width: {50 / wearingIds.length}%;">
					<div
						class="h-full bg-cyan-800 transition-all duration-100"
						style="width: {(100 * subLoadProgress[i]).toFixed(2)}%"
					></div>
				</div>
			{/each}
		</div>
	</div>
{/if}
