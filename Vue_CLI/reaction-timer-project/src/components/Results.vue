<template>
  <p>
    Your reaction time: <span>{{ score }}</span>
  </p>
</template>

<script>
export default {
  props: ["score"],
};
</script>

<style>
p {
    padding: 10px;
    margin-top: 10px;
}
span {
    color: green;
    font-weight: bold;
    font-size: 20px;
}
</style>
