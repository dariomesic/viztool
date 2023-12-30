<template>
  <div class="indicator-mask">
    <div class="indicator">
        <span class="text-indicator">Loading...</span>
        <div class="items-indicator">
            <span class="loader-indicator"/>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
};
</script>
<style scoped>
.indicator-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    visibility: visible;
    opacity: 1;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    transition: opacity 0.3s, visibility 0.3s;
}
.items-indicator{
    vertical-align: middle;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.indicator{
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -25px 0 0 -25px;
    width: 222px;
    height: 90px;
    z-index: 100;
    transition: all 0s ease 0s;
    padding: 10px;
    text-align: center;
    user-select: none;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 6px 12px rgba(0,0,0,.25);
}
.text-indicator{
    position: absolute;
    bottom: 20px;
    right: 0;
    left: 0;
}
.loader-indicator {
    margin-top: 17px;
    font-size: 7px;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    position: relative;
    text-indent: -9999em;
    animation: mulShdSpin 1.1s infinite ease;
    transform: translateZ(0);
}
@keyframes mulShdSpin {
  0%,
  100% {
    box-shadow: 0em -2.6em 0em 0em rgb(100, 100, 100), 1.8em -1.8em 0 0em rgba(128, 128, 128, 0.2), 2.5em 0em 0 0em rgba(128, 128, 128, 0.2), 1.75em 1.75em 0 0em rgba(128, 128, 128, 0.2), 0em 2.5em 0 0em rgba(128, 128, 128, 0.2), -1.8em 1.8em 0 0em rgba(128, 128, 128, 0.2), -2.6em 0em 0 0em rgba(128, 128, 128, 0.5), -1.8em -1.8em 0 0em rgba(128, 128, 128, 0.7);
  }
  12.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(128, 128, 128, 0.7), 1.8em -1.8em 0 0em rgb(100, 100, 100), 2.5em 0em 0 0em rgba(128, 128, 128, 0.2), 1.75em 1.75em 0 0em rgba(128, 128, 128, 0.2), 0em 2.5em 0 0em rgba(128, 128, 128, 0.2), -1.8em 1.8em 0 0em rgba(128, 128, 128, 0.2), -2.6em 0em 0 0em rgba(128, 128, 128, 0.2), -1.8em -1.8em 0 0em rgba(128, 128, 128, 0.5);
  }
  25% {
    box-shadow: 0em -2.6em 0em 0em rgba(128, 128, 128, 0.5), 1.8em -1.8em 0 0em rgba(128, 128, 128, 0.7), 2.5em 0em 0 0em rgb(100, 100, 100), 1.75em 1.75em 0 0em rgba(128, 128, 128, 0.2), 0em 2.5em 0 0em rgba(128, 128, 128, 0.2), -1.8em 1.8em 0 0em rgba(128, 128, 128, 0.2), -2.6em 0em 0 0em rgba(128, 128, 128, 0.2), -1.8em -1.8em 0 0em rgba(128, 128, 128, 0.2);
  }
  37.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(128, 128, 128, 0.2), 1.8em -1.8em 0 0em rgba(128, 128, 128, 0.5), 2.5em 0em 0 0em rgba(128, 128, 128, 0.7), 1.75em 1.75em 0 0em rgb(100, 100, 100), 0em 2.5em 0 0em rgba(128, 128, 128, 0.2), -1.8em 1.8em 0 0em rgba(128, 128, 128, 0.2), -2.6em 0em 0 0em rgba(128, 128, 128, 0.2), -1.8em -1.8em 0 0em rgba(128, 128, 128, 0.2);
  }
  50% {
    box-shadow: 0em -2.6em 0em 0em rgba(128, 128, 128, 0.2), 1.8em -1.8em 0 0em rgba(128, 128, 128, 0.2), 2.5em 0em 0 0em rgba(128, 128, 128, 0.5), 1.75em 1.75em 0 0em rgba(128, 128, 128, 0.7), 0em 2.5em 0 0em rgb(100, 100, 100), -1.8em 1.8em 0 0em rgba(128, 128, 128, 0.2), -2.6em 0em 0 0em rgba(128, 128, 128, 0.2), -1.8em -1.8em 0 0em rgba(128, 128, 128, 0.2);
  }
  62.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(128, 128, 128, 0.2), 1.8em -1.8em 0 0em rgba(128, 128, 128, 0.2), 2.5em 0em 0 0em rgba(128, 128, 128, 0.2), 1.75em 1.75em 0 0em rgba(128, 128, 128, 0.5), 0em 2.5em 0 0em rgba(128, 128, 128, 0.7), -1.8em 1.8em 0 0em rgb(100, 100, 100), -2.6em 0em 0 0em rgba(128, 128, 128, 0.2), -1.8em -1.8em 0 0em rgba(128, 128, 128, 0.2);
  }
  75% {
    box-shadow: 0em -2.6em 0em 0em rgba(128, 128, 128, 0.2), 1.8em -1.8em 0 0em rgba(128, 128, 128, 0.2), 2.5em 0em 0 0em rgba(128, 128, 128, 0.2), 1.75em 1.75em 0 0em rgba(128, 128, 128, 0.2), 0em 2.5em 0 0em rgba(128, 128, 128, 0.5), -1.8em 1.8em 0 0em rgba(128, 128, 128, 0.7), -2.6em 0em 0 0em rgb(100, 100, 100), -1.8em -1.8em 0 0em rgba(128, 128, 128, 0.2);
  }
  87.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(128, 128, 128, 0.2), 1.8em -1.8em 0 0em rgba(128, 128, 128, 0.2), 2.5em 0em 0 0em rgba(128, 128, 128, 0.2), 1.75em 1.75em 0 0em rgba(128, 128, 128, 0.2), 0em 2.5em 0 0em rgba(128, 128, 128, 0.2), -1.8em 1.8em 0 0em rgba(128, 128, 128, 0.5), -2.6em 0em 0 0em rgba(128, 128, 128, 0.7), -1.8em -1.8em 0 0em rgb(100, 100, 100);
  }
}

</style>