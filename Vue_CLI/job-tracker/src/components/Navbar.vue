<template>
  <nav>
    <RouterLink to="/">Home</RouterLink> |
    <RouterLink to="/applications">Applications</RouterLink>
  </nav>
</template>

<script setup>
</script>

<style scoped lang="scss">
nav {
  text-align: center;
  padding: 20px;
  background-color: #eee;

  a {
    border-radius: 5px;
    padding: 7px 12px;

    &.router-link-exact-active {
      background-color: #72bd57;
      color: white;
      font-weight: bold;
    }
  }
}
</style>