<div class="checkmark-loader">
  <div class="checkmark"></div>
</div>

<style>
.checkmark-loader {
  animation: 600ms ease forwards loader-spin, 500ms linear 500ms forwards border-fill;
  border: 3.5px solid rgba(0, 0, 0, 0.2);
  border-left-color: #fff;
  border-radius: 50%;
  display: inline-block;
  height: 38px;
  position: relative;
  width: 38px;
}

.checkmark {
  animation: 800ms ease 1s forwards checkmark;
  border-right: 3.5px solid #fff;
  border-top: 3.5px solid #fff;
  height: 1rem;
  left: 6px;
  opacity: 0;
  position: absolute;
  top: 16px;
  transform: scaleX(-1) rotate(135deg);
  transform-origin: left top;
  width: 10px;
}

@keyframes loader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes border-fill {
  0% {
    border-color-top: none;
    border-color-right: none;
    border-color-bottom: none;
  }
  90% {
    border-color-top: rgba(247, 148, 30, .1);
    border-color-right: rgba(247, 148, 30, .1);
    border-color-bottom: rgba(247, 148, 30, .1);
  }
  100% {
    border-color: #fff;
  }
}

@keyframes checkmark {
  0% {
    height: 0;
    width: 0;
    opacity: 0;
  }
  20% {
    height: 0;
    width: 10px;
    opacity: 1;
  }
  40% {
    height: 17px;
    width: 10px;
    opacity: 1;
  }
  100% {
    height: 17px;
    width: 10px;
    opacity: 1;
  }
}
</style>