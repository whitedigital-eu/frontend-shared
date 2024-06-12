<template>
  <div v-if="!isEditMode">
    <div class="max-w-[300px] mx-auto relative w-full">
      <img v-if="initialValue" alt="Paraksts" :src="initialValue" />
      <div v-else class="h-16"></div>
      <div
        class="-inset-2 absolute bg-[rgba(0,0,0,0.3)] flex items-center justify-center rounded-md"
      >
        <button
          class="btn btn-primary"
          data-test="sign-btn"
          type="button"
          @click="isEditMode = true"
        >
          {{ initialValue ? 'Mainīt parakstu' : 'Parakstīties' }}
        </button>
      </div>
    </div>
  </div>
  <div v-else-if="!isMobile" class="m-auto relative signature-container">
    <FormFieldLabel class="-ml-1 mt-[44px] z-[1]" title-offset-top="-60px">
      {{ label }}
    </FormFieldLabel>
    <VueSignaturePad
      v-if="isReady"
      ref="signaturePad"
      :height="dimensions.height"
      :options="{ onEnd: emitUpdate }"
      :width="dimensions.width"
    />
    <slot :clear-and-emit="clearAndEmit" name="desktop-edit-mode-footer">
      <div class="border-t flex gap-4 justify-center p-2">
        <button
          class="btn btn-danger-soft btn-rounded btn-sm"
          type="button"
          @click="clearAndEmit"
        >
          Notīrīt
        </button>
      </div>
    </slot>
  </div>
  <Modal
    v-else
    body-class="px-1"
    :show-footer="false"
    size="cover"
    @close="isEditMode = false"
  >
    <template #body>
      <div
        id="fullscreen-signature-container"
        class="fullscreen-signature-container"
      >
        <div class="mx-auto signature-container">
          <div class="signature-wrapper">
            <VueSignaturePad
              ref="signaturePad"
              :height="mobileHeight"
              scale-to-device-pixel-ratio
            />
          </div>
          <slot
            :clear="clear"
            :emit-update="emitUpdate"
            name="mobile-footer"
            :turn-off-edit-mode="turnOffEditMode"
          >
            <div class="border-t flex gap-4 justify-center p-2">
              <button
                class="btn btn-danger-soft btn-rounded btn-sm"
                type="button"
                @click="clear"
              >
                Notīrīt
              </button>
              <button
                class="btn btn-primary-soft btn-rounded btn-sm"
                type="button"
                @click="emitUpdate"
              >
                Apstiprināt
              </button>
              <button
                class="btn btn-rounded btn-secondary-soft btn-sm"
                type="button"
                @click="turnOffEditMode"
              >
                Atcelt
              </button>
            </div>
          </slot>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import FormFieldLabel from '../../FormFieldLabel.vue'
import Modal from '../../Modal/Modal.vue'
import useSignatureDesktopDimensions from './useSignatureDimensions'
import useSignatureMobileHeight from './useSignatureMobileHeight'
import useIsMobile from '../../../composables/useIsMobile'
import { SignatureConfig } from '../../../types/InputFields'
import _ from 'lodash'

const props = defineProps<{
  modelValue?: string
  label: string
  config: SignatureConfig
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

defineSlots<{
  'desktop-edit-mode-footer': {
    clearAndEmit: () => void
  }
  'mobile-footer': {
    clear: () => void
    emitUpdate: () => void
    turnOffEditMode: () => void
  }
}>()

const { isMobile } = useIsMobile()
const { isReady, dimensions } = useSignatureDesktopDimensions()
const { height: mobileHeight } = useSignatureMobileHeight()

const computedConfig = computed(() =>
  _.merge({ editMode: false, readonly: false }, props.config),
)

const initialValue = ref(props.modelValue)
const isEditMode = ref(false)

watchEffect(() => (isEditMode.value = computedConfig.value.editMode))

const signaturePad = ref()

const emitUpdate = () => {
  const { isEmpty, data } = signaturePad.value.saveSignature()
  const valToEmit = isEmpty ? null : data
  emit('update:modelValue', valToEmit)

  if (isMobile.value) {
    initialValue.value = valToEmit
    isEditMode.value = false
  }
}

const clear = () => signaturePad.value?.clearSignature()
const clearAndEmit = () => {
  clear()
  emitUpdate()
}
const turnOffEditMode = () => (isEditMode.value = false)
</script>

<style scoped lang="scss">
.signature-container {
  @apply rounded-md border-2 border-slate-200/60 border-dashed dark:bg-darkmode-600;
}

.fullscreen-signature-container {
  height: 100%;
  padding: 4px 0;
  margin: auto;

  .signature-container {
    height: 100%;
  }
}

.signature-wrapper {
  height: calc(100% - 47px);
}
</style>
