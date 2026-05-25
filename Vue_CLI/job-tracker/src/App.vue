<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <Navbar />
  <RouterView />
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  transform: 0.3s all ease;
}

a {
  text-decoration: none;
}
</style>
