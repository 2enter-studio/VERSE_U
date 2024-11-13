<script lang="ts">

let { text, class:className }:{ text:string, class:string } = $props();

</script>

<div class="fade-out-up {className} w-full text-center">
  {text}
</div>

<style>
@keyframes fadeOutUp {
	0% {
		opacity: 1;
		transform: translateY(0);
	}
	100% {
		opacity: 0;
		transform: translateY(-20px);
	}
}

.fade-out-up {
	animation: fadeOutUp 1.8s ease-in-out;
}
</style>