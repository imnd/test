<template>
  <div class="button-container">
    <button class="button" @click="showModal = true">
      К покупкам
    </button>
    <transition name="fade" appear>
      <div class="modal-overlay" v-if="showModal" @click="showModal = false"></div>
    </transition>
    <transition name="slide" appear>
      <div class="modal" v-if="showModal">
        <div class="row">
          <input type="text" placeholder="email" v-model="email" />
        </div>
        <button class="button" @click="send">
          отправить
        </button>
        <button class="button close" @click="showModal = false">
          закрыть
        </button>
        <div class="result" :style="{ color: result.color }">{{ result.text }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  data() {
    return {
      showModal: false,
      email: '',
      result: {
        text: '',
        color: '',
      }
    }
  },
  methods: {
    send() {
      if (this.validateEmail()) {
        let promise = new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.email);
          }, 1000);
        });
        promise
            .then(
                result => {
                  console.log(result);
                  this.result = {
                    text : "спасибо",
                    color : "green"
                  }
                }
            );
      } else {
        this.result = {
          text : "поле email заполнено с ошибками",
          color : "red"
        }
      }
    },
    validateEmail() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    }
  }
}
</script>

<style lang="scss">
.button-container {
  width: 340px;
  margin: 72px auto;
}
.button {
  background: linear-gradient(0deg, #7DB945, #7DB945),
  linear-gradient(0deg, #7DB945, #7DB945);
  width: 340px;
  height: 70px;
  padding: 15px 25px;
  font-size: 22px;
  font-weight: 700;
  color: #FFF;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.3);
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;

  width: 100%;
  max-width: 400px;
  background-color: #FFF;
  border-radius: 16px;

  padding: 25px;

  & .button {
    width: 45%;
    height: 40px;
    padding: 5px 5px;
    &.close {
      background: red;
      margin-left: 10%;
    }
  }
  & .result {
    margin-top: 12px;
  }
}

.row {
  clear: both;
  margin: 24px 0;
  & input {
    width: 100%;
    height: 32px;
    border-radius: 4px;
    border: solid 1px #DDD;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform .5s;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(-50%) translateX(100vw);
}
</style>
