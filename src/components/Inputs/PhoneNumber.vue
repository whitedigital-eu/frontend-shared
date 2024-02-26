<template>
  <vue-tel-input v-model="value" class="z-[10]" v-bind="vueTelInputProps" />
</template>

<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import _ from 'lodash'
import { PhoneNumberFieldConfig } from '../../types/InputFields'

const props = withDefaults(
  defineProps<{
    label?: string | null
    config?: PhoneNumberFieldConfig
  }>(),
  {
    label: null,
    config: () => ({}),
  },
)

const value = defineModel<string | null>()

const vueTelInputProps = _.merge(
  {
    dropdownOptions: {
      showDialCodeInSelection: true,
      showFlags: true,
    },
    inputOptions: {
      placeholder: props.label,
      showDialCode: true,
    },
    mode: 'international',
    onlyCountries: ['ee', 'lv', 'lt'],
    validCharactersOnly: true,
  },
  props.config.vueTelInputProps ?? {},
)
</script>
