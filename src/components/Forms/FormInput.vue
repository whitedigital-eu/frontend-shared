<template>
  <component
    :is="
      projectSettings.form.getComponent(
        formField.type as keyof typeof projectSettings.forms.inputTypeToComponent,
      ) as any
    "
    v-bind="projectSettings.form.getComponentAttributes(formField)"
    v-model="formField.value"
    class="my-2"
    :class="cssClasses"
    v-on="projectSettings.form.getEventHandlers(formField, emit)"
  />
  <ul v-if="formField.errors && formField.errors.length">
    <li
      v-for="(message, j) in formField.errors"
      :key="j"
      class="mb-4 text-danger wd-form-error"
    >
      {{ message }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ProjectSettings } from './shared'
import { Ref, UnwrapRef } from 'vue'
import { AnyFormField } from '../../models/FormFields'
import { FormData } from '../../types/FormData'

defineProps<{
  formField: AnyFormField
  cssClasses?: string | string[] | Record<string, boolean>
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
}>()
</script>
