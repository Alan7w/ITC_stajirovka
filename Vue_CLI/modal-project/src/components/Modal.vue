<template>
  <div class="backdrop" @click.self="hideModal">
    <div class="modal" :class="{ sale: theme == 'sale' }">
      <slot>Default slot content</slot>
      <div class="actions">
        <slot name="links"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["theme"],
  methods: {
    hideModal() {
      this.$emit("hide");
    },
  },
};
</script>

<style>
.modal {
  width: 400px;
  padding: 20px;
  margin: 100px auto;
  background: white;
  border-radius: 10px;
}

.backdrop {
  position: fixed;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}

h1 {
  color: aquamarine;
  border: none;
  padding: 0;
}

.sale {
  background-color: crimson;
  color: white;
}

.sale h1 {
  color: white;
}

.actions {
  text-align: center;
  margin: 30px 0 10px 0;
  color: #333;
}

.modal .actions a {
  color: #333;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  text-decoration: none;
  margin: 10px;
}
</style>