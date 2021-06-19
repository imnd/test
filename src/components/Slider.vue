<template>
  <div class="slider">
    <div class="images-container">
      <transition-group name="fade" tag="div">
        <div v-for="i in [currentIndex]" :key="i">
          <div class="image" :style="imageStyle">
            <div class="num">{{ i + 1 }}</div>
          </div>
        </div>
      </transition-group>
    </div>
    <img key="prev" class="prev" @click="prev" src="../assets/img/prev.png" />
    <img key="next" class="next" @click="next" src="../assets/img/next.png" />
    <div class="text">
      <h4>Привезём точно по списку</h4>
      <p>Сборщик берëт с собой наручный терминал, на котором он видит весь список покупок для каждого заказа.</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "Slider",
  data() {
    return {
      images: [
          "image1.png", "image2.png", "image3.png", "image4.png", "image5.png",
      ],
      currentIndex: 0,
    };
  },

  methods: {
    next: function() {
      this.currentIndex = ++this.currentIndex % this.images.length;
    },
    prev: function() {
      if (this.currentIndex === 0) {
        this.currentIndex = this.images.length - 1;
      } else {
        this.currentIndex = --this.currentIndex % this.images.length;
      }
    }
  },

  computed: {
    imageStyle: function() {
      return "background-image:url('" + require("../assets/img/" + this.images[Math.abs(this.currentIndex) % this.images.length]) + "')";
    }
  }
};
</script>
<style lang="scss">
.slider {
  left: 300px;
  top: 46px;
  width: 640px;
  height: 450px;
  background: #FFFFFF;
  /* shadow */
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 34px;

  & .num {
    position: relative;
    left: -8px;
    top: -8px;
    width: 50px;
    height: 50px;
    border-radius: 26px;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 53px;
    text-align: center;

    background-color: #FFF;
    color: #7DB945;
  }

  & .images-container {
    width: 561px;
    height: 285px;
  }
  & .image {
    background-size: 561px;
    width: 561px;
    height: 285px;
  }

  & .text {
    font-size: 16px;
    margin: -17px auto 0;
    width: 500px;
    height: 88px;
    text-align: center;
    line-height: 1.7em;
  }

  & .prev, & .next {
    position: relative;
    width: 20px;
    height: 40px;
    top: -120px;
    cursor: pointer;
  }
  & .prev {
    left: -88px;
  }
  & .next {
    left: 624px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.9s ease;
  overflow: hidden;
  visibility: visible;
  position: absolute;
  width:100%;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  visibility: hidden;
  width:100%;
  opacity: 0;
}

</style>