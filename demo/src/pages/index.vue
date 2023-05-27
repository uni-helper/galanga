<script setup lang="ts">
const deviceInfo = ref(checkDeviceType())

console.log(clipboard.read())
</script>

<template>
  <Logos />
  <InputEntry />
  {{ deviceInfo }}
</template>

<style></style>

<route type="home" lang="json">
{}
</route>
