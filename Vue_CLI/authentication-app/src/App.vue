<script setup lang="ts"></script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#335CFF',
        colorBorder: '#EBEBEB',
        colorError: '#FB3748',
        borderRadiusLG: 10,
        borderRadius: 10,
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>

<style scoped lang="scss">
</style>
