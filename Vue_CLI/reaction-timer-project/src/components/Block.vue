<template>
  <!-- <div class="block" v-if="showBlock">click me</div> -->
  <div class="block" v-if="showBlock" @click="stopTimer">click me</div>
</template>

<script>
import { stop } from "vue";

export default {
  props: ["delay"],
  data() {
    return {
      showBlock: false,
      timer: null,
      reactionTime: 0,
    };
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.reactionTime += 10;
      }, 10);
    },

    stopTimer() {
      console.log(this.reactionTime);
      clearInterval(this.timer);
      this.$emit('end', this.reactionTime)
    },
  },
  mounted() {
    console.log("block mounted");
    setTimeout(() => {
      this.showBlock = true;
      console.log(this.delay);
      this.startTimer()
    }, this.delay);
  },
//   updated() {
//     this.startTimer();
//     console.log("block updated");
//   },
//   unmounted() {
//     console.log(this.reactionTime);
//     clearInterval(this.timer);
//     console.log("block unmounted");
//     this.$emit('end', this.reactionTime)
//   },
};
</script>

<style>
.block {
  width: 400px;
  border-radius: 20px;
  background: #0faf87;
  color: white;
  text-align: center;
  padding: 100px 0;
  margin: 40px auto;
}
</style>