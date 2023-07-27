<template>
  <div class="flex gap-2 xl:mt-0">
    <button
      class="btn btn-outline-secondary grow mr-1"
      type="button"
      @click="emit('cancel-click')"
    >
      {{ projectSettings.global.$t('common.cancel') }}
    </button>
    <LoadingButton
      class="grow"
      :loading="isLoading"
      @click="emit('proceed-click')"
    >
      {{ buttonText }}
    </LoadingButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingButton from '../LoadingButton.vue'
import { ProjectSettings } from '../Forms/shared'

const {
  isLoading,
  iri = null,
  projectSettings,
} = defineProps<{
  isLoading: boolean
  iri?: string | null
  projectSettings: ProjectSettings
}>()

const emit = defineEmits<{
  'cancel-click': []
  'proceed-click': []
}>()

const buttonText = computed(() =>
  iri
    ? projectSettings.global.$t('common.save')
    : projectSettings.global.$t('common.create'),
)
</script>
