<script setup lang="ts">
const deviceInfo = ref(checkDeviceType())

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
