<template><component :is="iconName" /></template>

<script setup lang="ts">
import { computed } from 'vue'
import * as usedIcons from './usedIcons'

const props = defineProps<{ name: keyof typeof usedIcons }>()
const iconName = computed(() => usedIcons[props.name])
</script>
