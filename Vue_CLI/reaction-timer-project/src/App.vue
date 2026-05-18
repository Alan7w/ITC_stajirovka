<template>
  <h1>Reaction Timer</h1>

  <button @click="play" :disabled="isPlaying">Play</button>

  <div v-if="isPlaying">
    <Block :delay="delay" @end="endGame"></Block>
  </div>
  <div v-if="score">
    <Results :score="score"> </Results>
  </div>
</template>

<script>
import Block from "./components/Block.vue";
import Results from "./components/Results.vue";

export default {
  name: "App",
  components: { Block, Results },
  data() {
    return {
      isPlaying: false,
      delay: null,
      score: null,
    };
  },
  methods: {
    play() {
      this.delay = 200 + Math.random() * 5000;
      this.isPlaying = true;
      this.score = null
    },
    endGame(reactionTime) {
      this.isPlaying = false;
      this.score = reactionTime;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #444;
  margin-top: 60px;
}

button {
  background-color: green;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
}
button:disabled {
  background-color: color-mix(in srgb, green 50%, white 50%);
}
</style>
