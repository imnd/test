<template>
  <div id="app">
    <div class="container">
      <Slider />
      <Modal />
    </div>
  </div>
</template>

<script>
import Slider from './components/Slider.vue';
import Modal from './components/Modal.vue'

export default {
  name: 'App',
  components: {
    Slider,
    Modal
  }
}
</script>

<style lang="scss">
* {
  font-family: RotondaC, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  position: relative;
}
.container {
  margin: 0 auto;
  width: 640px;
}
</style>
