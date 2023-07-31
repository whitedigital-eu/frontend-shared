<template>
  <button
    class="btn btn-primary px-7 w-auto"
    :class="{ 'pr-1': loading }"
    :disabled="loading"
  >
    <slot></slot>
    <LoadingIcon
      v-if="loading"
      class="h-4 ml-2 w-4"
      color="white"
      data-test="btn-loading-icon"
      icon="oval"
    />
  </button>
</template>

<script setup lang="ts">
import LoadingIcon from './LoadingIcon.vue'

const { loading = false } = defineProps<{ loading?: boolean }>()
</script>
