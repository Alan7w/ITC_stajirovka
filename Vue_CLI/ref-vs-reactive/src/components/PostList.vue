<template>
  <div class="post-list" v-for="post in posts" :key="post.id">
    <Post :post="post"></Post>
  </div>
</template>

<script>
import { onMounted, onUnmounted, onUpdated } from "vue";
import Post from "./Post.vue";

export default {
  props: ["posts"],
  components: { Post },

  setup(props) {
    console.log(props);

    onMounted(() => console.log("component mounted"));
    onUnmounted(() => console.log("component unmounted"));
    onUpdated(() => console.log("component updated"));
  },
};
</script>

<style>
</style>