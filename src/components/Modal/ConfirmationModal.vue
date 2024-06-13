<template>
  <Modal data-test="confirmation-modal" @close="emit('close')">
    <template #header>
      <div class="text-2xl">
        <span class="first-letter:capitalize">{{
          t('project.confirmationModalTitle')
        }}</span>
      </div>
    </template>
    <template #body>
      <div v-if="!customTitle" class="my-4 text-slate-500">
        {{ t('project.confirmationModalText') }} {{ title }}?
      </div>
      <div v-else class="my-4 text-slate-500">
        {{ customTitle }}
      </div>
    </template>
    <template #footer>
      <div class="flex gap-4">
        <button
          class="btn btn-outline-secondary w-full"
          data-test="cancel-button"
          type="button"
          @click="emit('close')"
        >
          <span class="first-letter:capitalize">{{ t('project.cancel') }}</span>
        </button>
        <button
          class="btn btn-danger w-full"
          data-test="delete-button"
          data-tw-dismiss="modal"
          type="button"
          @click.prevent="emit('confirm')"
        >
          <span class="first-letter:capitalize">{{ t('project.delete') }}</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import { useI18nWithFallback } from '../../helpers/Translations'

const { title = '', customTitle = null } = defineProps<{
  title?: string
  customTitle?: string | null
}>()

const emit = defineEmits<{ close: []; confirm: [] }>()

const { t } = useI18nWithFallback()
</script>
