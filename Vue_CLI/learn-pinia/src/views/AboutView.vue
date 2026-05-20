<template>
  <div class="about">
    <h1>About Page</h1>
    <button class="counter-button" @click="storeCounter.increment">
      {{ storeCounter.count }}
    </button>
  </div>
</template>

<script setup>
import { useCounterStore } from "@/stores/counter";

const storeCounter = useCounterStore();
</script>

<style>
.counter-button {
  font-size: 50px;
}
</style>