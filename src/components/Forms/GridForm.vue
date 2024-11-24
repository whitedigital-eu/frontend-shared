<template>
  <div
    class="gap-4 grid grid-cols-1 relative"
    :class="computedGridColsClass"
    data-role="grid-form"
  >
    <div
      v-for="(formSection, i) in formDataInLayout"
      :key="i"
      class="grid-item-container"
    >
      <div
        v-for="(formField, j) in formSection"
        :key="j"
        :data-has-error="formField.errors && formField.errors.length > 0"
      >
        <component
          :is="
            projectSettings.form.getComponent(
              formField.type as keyof typeof projectSettings.form.inputTypeToComponent,
            )
          "
          v-bind="projectSettings.form.getComponentAttributes(formField)"
          v-model="formField.value"
          class="my-4"
          v-on="projectSettings.form.getEventHandlers(formField, emit)"
        />
        <ul v-if="formField.errors?.length">
          <li
            v-for="(message, k) in formField.errors"
            :key="k"
            class="-mt-3 mb-4 text-danger wd-form-error"
          >
            {{ message }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed, Ref, UnwrapRef } from 'vue'
import { ProjectSettings } from './shared'
import { FormData } from '../../types/FormData'
import { GridFormCols } from '../../types/AccordionLayout'
import { AnyFormField } from '../../models/FormFields'

const { cols = 2, ...props } = defineProps<{
  formData: FormData
  formLayout: string[][]
  cols?: GridFormCols
  projectSettings: ProjectSettings
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', formData: Ref<UnwrapRef<FormData>>): void
  (e: 'select-create-new-item', fieldName: string, item: string): void
  (
    e: 'remove-file',
    fieldName: string,
    fileIri: string,
    callback: (...args: any[]) => void,
  ): void
  (e: 'edit-file', fieldName: string, fileIri: string): void
}>()

const formData = ref<FormData>(props.formData)

const formDataInLayout = computed(() =>
  props.formLayout.map(
    (gridItem) =>
      gridItem
        .map((key) => {
          if (!('value' in formData.value[key])) {
            console.error(
              'Entity translations are currently not supported by this component!',
            )
            return
          }
          return formData.value[key]
        })
        .filter(Boolean) as AnyFormField[],
  ),
)

watch(formData, () => emit('update:modelValue', formData), { deep: true })

const computedGridColsClass = computed(() => {
  switch (cols) {
    case 1:
      return 'sm:grid-cols-1'
    case 2:
      return 'sm:grid-cols-2'
    case 3:
      return 'sm:grid-cols-3'
    case 4:
      return 'sm:grid-cols-4'
    case 5:
      return 'sm:grid-cols-5'
    default:
      return ''
  }
})
</script>
