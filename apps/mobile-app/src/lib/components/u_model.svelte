<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { onMount } from 'svelte';
	import type { CharacterAnimation } from '@/config';
	import { DEFAULT_CAMERA_POS, FRAME_RATE } from '@/config';
	import { wearings } from '@/states';
	import { getFileUrl } from '@/utils/storage';

	type Props = {
		wearingIds: string[];
		readonly?: boolean;
		animation?: CharacterAnimation;
		class?: string;
		cameraPosition?: [number, number, number];
	};

	let {
		wearingIds,
		animation,
		cameraPosition = [...DEFAULT_CAMERA_POS],
		class: className,
		readonly = false
	}: Props = $props();

	let mixer: THREE.AnimationMixer;
	let skeleton: THREE.Skeleton;

	let camera = $state<THREE.PerspectiveCamera>();
	let dom = $state<HTMLElement>();
	let body = $state<THREE.Object3D<THREE.Object3DEventMap>>();
	let modelLoaded = $state(false);

	const animating = $derived(
		body?.animations?.some((a) => mixer?.clipAction(a).isRunning()) || false
	);

	let frame = 0;
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
		$effect(() => {
			if (wearingIds && wearingGroup.children.length >= 0) {
				modelLoaded = false;
				loadWearings().then(() => {
					modelLoaded = true;
				});
			}
		});

		$effect(() => {
			if (camera) {
				setCamera();
			}
			// if (animation === 'idle') playAnimation();
		});
	}

	function setCamera() {
		if (!camera) return;
		camera.position.set(...cameraPosition);
		camera.lookAt(0, cameraPosition[1] - 0.8, -2.5);
	}

	function makeMaterial(wearing_id: string) {
		// const isNew = !$equippedWearings.includes(wearing_id);

		const url = getFileUrl('wearings', `textures/${wearing_id}`);

		return new THREE.MeshStandardMaterial({
			map: textureLoader.load(`${url}_baseColor`),
			normalMap: textureLoader.load(`${url}_normal`),
			roughnessMap: textureLoader.load(`${url}_roughness`),
			metalnessMap: textureLoader.load(`${url}_metallic`)
		});
	}

	async function loadWearings() {
		if (!body) return;
		body.children.forEach((c) => (c.visible = true));

		const promises: Promise<void>[] = [];

		for (const wearing of wearingGroup.children) {
			if (!wearingIds.includes(wearing.name)) {
				wearingGroup.children = wearingGroup.children.filter((c) => c.name !== wearing.name);
			}
		}

		for (const wearing of $wearings.filter((w) => wearingIds.includes(w.id))) {
			const { mesh, body_parts, id } = wearing;

			for (const { value: body_part } of body_parts) {
				const hidden = body.children.findIndex((c) => c.name === `${body_part}`);

				if (hidden !== -1) {
					body.children[hidden].visible = false;
				}
			}

			if (wearingGroup.children.some((c) => c.name === id)) continue;

			if (!mesh) return;
			const url = getFileUrl('meshes', `glb/${mesh}`);

			promises.push(
				new Promise((resolve, reject) => {
					loader.load(
						url,
						(gltf) => {
							const obj = gltf.scene;
							const skinnedMesh = obj.children[0].children[0] as THREE.SkinnedMesh;
							if (skeleton) skinnedMesh.skeleton = skeleton;
							if (wearing.texture_types.length > 0) skinnedMesh.material = makeMaterial(id);
							obj.name = id;

							wearingGroup.add(obj);
							resolve();
						},
						(_xhr) => {
							// console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
						},
						(_error) => {
							reject();
						}
					);
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
		await new Promise<void>((resolve, reject) => {
			loader.load(
				'/models/main_body.glb',
				(gltf) => {
					body = gltf.scene.children[0];
					body.animations = gltf.animations;

					skeleton = (body.children[0] as THREE.Object3D & { skeleton: THREE.Skeleton }).skeleton;
					body.position.setY(-1.5);
					scene.add(body);

					const skinMaterial = new THREE.MeshToonMaterial({
						color: 'pink'
					});

					for (const child of body.children as THREE.SkinnedMesh[]) {
						if (child.type === 'SkinnedMesh') {
							child.material = skinMaterial;
						}
					}

					if (!mixer) mixer = new THREE.AnimationMixer(body);

					playAnimation();
					resolve();
				},
				(_xhr) => {
					// console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
				},
				(error) => {
					console.error(error);
					reject();
				}
			);
		});
	}

	onMount(() => {
		if (!dom) return;

		loadBody().then(() => {
			loadWearings().then(() => {
				modelLoaded = true;
			});
		});

		renderer.setSize(dom.clientWidth, dom.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio / 1.5);
		dom.appendChild(renderer.domElement);
		camera = new THREE.PerspectiveCamera(100, dom.clientWidth / dom.clientHeight, 0.1, 2000);

		setCamera();

		function animate() {
			if (!camera) return;
			scene.traverse((obj) => {
				obj.frustumCulled = false;
			});

			setTimeout(() => {
				frame = requestAnimationFrame(animate);
			}, 1000 / FRAME_RATE);

			if (!animating || !modelLoaded) return;
			renderer.render(scene, camera);

			const deltaTime = clock.getDelta();
			mixer?.update(deltaTime);
		}

		animate();

		return () => {
			cancelAnimationFrame(frame);
			scene.clear();
			dom?.removeChild(renderer.domElement);
		};
	});
</script>

<div
	bind:this={dom}
	class="{className} {modelLoaded && animating ? 'opacity-100' : 'opacity-0'}"
></div>
