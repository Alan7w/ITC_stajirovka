<template>
  <h1>my first project: {{ title }}</h1>
  <br />

  <input type="text" ref="name" />
  <button @click="handleClick">click me</button>

  <div v-if="showModal">
    <Modal theme="" @hide="toggleShowModal">
      <h1>Modal title</h1>
      <h2>{{ header2 }}</h2>
      <p>{{ text }}</p>
      <p>modal content</p>
      <span>{{ sampleList }}</span>
      <template v-slot:links>
        <a href="">sign up</a>
        <a href="">more info</a>
      </template>
    </Modal>
  </div>
  <br />

  <teleport to="#modals" v-if="showModal2">
    <Modal @hide="toggleShowModal2">
      <h1>This the second modal</h1>
      <template v-slot:links>
        <a href="">sign up</a>
        <a href="">more info</a>
      </template>
    </Modal>
  </teleport>
  <br />
  <button @click.alt="toggleShowModal">show modal 1(alt)</button>
  <button @click.shift="toggleShowModal2">show modal 2 (shift)</button>
</template>

<script>
import Modal from "./components/Modal.vue";

export default {
  name: "App",
  components: { Modal },
  data() {
    return {
      title: "This is the title",
      header2: "This is a prop named 'header2'",
      text: "This is another prop named text",
      sampleList: [1, 2, 3],
      showModal: false,
      showModal2: true,
    };
  },
  methods: {
    handleClick() {
      console.log(this.$refs.name);
      this.$refs.name.classList.add("active");
      this.$refs.name.focus();
    },
    toggleShowModal() {
      this.showModal = !this.showModal;
    },
    toggleShowModal2() {
      this.showModal2 = !this.showModal2;
    },
  },
};
</script>

<style>
#app, #modals {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  border-bottom: 1px solid #ddd;
  display: inline-block;
  padding-bottom: 10px;
}
</style>
