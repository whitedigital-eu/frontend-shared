<template>
  <main class="container">
    <TimePicker v-model="model" type="hours" />
  </main>
</template>

<script lang="ts" setup>
import TimePicker from './components/Inputs/TimePicker.vue'
import { ref } from 'vue'
const model = ref(0)
</script>

<style lang="scss">
.container {
  width: 1000px;
  margin: auto;
}

.relative {
  position: relative;
}
</style>
