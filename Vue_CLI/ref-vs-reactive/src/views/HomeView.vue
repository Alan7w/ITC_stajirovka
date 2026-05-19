<template>
  <div class="home">
    <h1>Home</h1>
    <div v-if="error">{{ error }}</div>
    <!-- <p ref="p">My name is {{ name }} and i am {{ age }} years old</p>
    <button @click="handleClick">click me</button><br>

    <button @click="age++">add +1 to age</button>
    <input type="text" v-model="name"> -->

    <!-- <h2>Refs</h2>
    <p>{{ ninjaOne.name }} - {{ ninjaOne.age }} - {{ nameOne }}</p>
    <button @click="updateNinjaOne">Update ninja one</button>

    <h2>Reactive</h2>
    <p>{{ ninjaTwo.name }} - {{ ninjaTwo.age }} - {{ nameTwo }}</p>
    <button @click="updateNinjaTwo">Update ninja two</button> -->

    <!-- <p>{{ name }}</p> -->
    <!-- <input type="text" v-model="search" />
    <p>Seach term - {{ search }}</p>
    <div v-for="name in matchingNames" :key="name">{{ name }}</div>
    <button @click="handleClick">stop watching</button> -->

    <div v-if="posts.length">
      <PostList v-if="showPosts" :posts="posts"> </PostList>
    </div>
    <div v-else>Loading ...</div>


    <!-- <div>Current count: {{ counter.count }}</div>
    <button @click="counter.increment()">increment count</button> -->
  </div>

  <button @click="showPosts = !showPosts">toggle show posts</button>
  <button @click="posts.pop()">delete a post</button>
</template>

<script>
import { computed, ref, watch, watchEffect } from "vue";

// import { ref, reactive } from "vue";

import PostList from "../components/PostList";
import getPosts from "../../composables/getPosts";

// import { userCounterStore } from "../../stores/counter";

// const counter = userCounterStore()

export default {
  name: "HomeView",
  components: { PostList },

  setup() {
    // const name = ref("Mario");
    // const age = ref(23);

    // const p = ref(null);

    // const handleClick = () => {
    //   console.log("you clicked me");
    // console.log(p, p.value)
    // p.value.classList.add('test')
    // p.value.textContent = 'Hello, Asadkhon'

    //   name.value = 'Luigi'
    //   age.value = 25
    // };

    // return { name: name, age: age };
    // return { name, age, handleClick, p }; // alternative way of returning

    // const ninjaOne = ref({name: 'mario', age: 23})
    // const ninjaTwo = reactive({name: 'luigi', age: 35})

    // const nameOne = ref('mario')
    // const nameTwo = reactive('luigi')

    // const updateNinjaOne = () => {
    //   ninjaOne.value.age = 30
    // }

    // const updateNinjaTwo = () => {
    //   ninjaTwo.age = 45
    //   // nameTwo = 'mario'
    // }

    // return {ninjaOne, ninjaTwo, updateNinjaOne, updateNinjaTwo, nameTwo}

    // const name = computed(() => {
    //   return "Asadxon";
    // });

    // const search = ref("");
    // const names = ref([
    //   "mario",
    //   "yoshi",
    //   "luigi",
    //   "toad",
    //   "koppa",
    //   "peach",
    //   "bowser",
    // ]);

    // const stopWatch = watch(search, () => {
    //   console.log("watch function ran");
    // });

    // const stopEffect = watchEffect(() => {
    //   console.log("watchEffect function ran", search.value);
    // });

    // const matchingNames = computed(() => {
    //   return names.value.filter((name) => name.includes(search.value));
    // });

    // const handleClick = () => {
    //   stopWatch();
    //   stopEffect();
    // };

    // return { names, search, matchingNames, handleClick };

    const { posts, error, load } = getPosts();
    load();

    const showPosts = ref(true);
    return { posts, showPosts, error };
  },
};
</script>
