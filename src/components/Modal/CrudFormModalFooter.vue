<template>
  <div class="flex gap-2 xl:mt-0">
    <button
      class="btn btn-outline-secondary grow mr-1"
      type="button"
      @click="emit('cancel-click')"
    >
      <span class="first-letter:capitalize">{{ t('project.cancel') }}</span>
    </button>
    <LoadingButton
      class="grow"
      :loading="isLoading"
      @click="emit('proceed-click')"
    >
      <span class="first-letter:capitalize">{{ buttonText }}</span>
    </LoadingButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingButton from '../LoadingButton.vue'

import { useI18nWithFallback } from '../../helpers/Translations'

const { isLoading, iri = null } = defineProps<{
  isLoading: boolean
  iri?: string | null
}>()

const emit = defineEmits<{ 'cancel-click': []; 'proceed-click': [] }>()

const { t } = useI18nWithFallback()

const buttonText = computed(() =>
  iri ? t('project.save') : t('project.create'),
)
</script>
