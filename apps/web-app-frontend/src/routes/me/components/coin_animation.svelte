<script lang="ts">
  
</script>

<div
      class="coin coin--animated"
      style="--coin-to-x: calc(-100px + 24px); --coin-to-y: calc(-105px + 24px); --coin-delay: 0.3s;"
    ></div>
    <div
      class="coin coin--animated"
      style="--coin-to-x: calc(-70px + 24px); --coin-to-y: -90px; --coin-delay: 0.1s;"
    ></div>
    <div
      class="coin coin--animated"
      style="--coin-to-x: calc(-30px + 24px); --coin-to-y: -125px; --coin-delay: 0s;"
    ></div>
    <div
      class="coin coin--animated"
      style="--coin-to-x: calc(10px + 24px); --coin-to-y: -130px; --coin-delay: 0.2s;"
    ></div>
    <div
      class="coin coin--animated"
      style="--coin-to-x: calc(30px + 24px); --coin-to-y: -100px; --coin-delay: 0.1s;"
    ></div>
    <div
      class="coin coin--animated"
      style="--coin-to-x: calc(70px + 24px); --coin-to-y: -95px; --coin-delay: 0.4s;"
    ></div>
    <div
      class="coin coin--animated"
      style="--coin-to-x: calc(100px + 24px); --coin-to-y: -100px; --coin-delay: 0.2s;"
    ></div>
<style>
  .coin {
    position: absolute;
    top: var(--coin-from-x, 24px);
    left: 50%;
    z-index: 100;
    opacity: 0;
  }

  .coin::after {
    content: "$";
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    font-size: 10px;
    color: rgb(237, 196, 107);
    background: rgb(227, 162, 23);
    border: 2px solid rgb(237, 196, 107);
    border-radius: 50%;
    opacity: 0;
  }

  .coin--animated,
  .coin--animated::after {
    animation-delay: var(--coin-delay, 0s);
    animation-duration: var(--coin-duration, 1.5s);
    animation-direction: normal;
    animation-fill-mode: both;
    animation-play-state: running;
    animation-iteration-count: infinite;
  }

  .coin--animated {
    animation-name: coin-x-axis;
    animation-timing-function: ease-in;
  }

  .coin--animated::after {
    animation-name: coin-y-axis-and-flip;
    animation-timing-function: ease-out;
  }

  @keyframes coin-x-axis {
    30% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    to {
      left: calc(var(--coin-to-x) * 1.5);
    }
  }

  @keyframes coin-y-axis-and-flip {
    30% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    to {
      transform: translateY(calc(var(--coin-to-y) * 1.5)) rotate3d(1, 1, 1, 1080deg);
    }
  }
</style>