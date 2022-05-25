<template>
  <main class="container">
    <Slider />
    <Text label="test" />
    <Decimal label="test2" />
    <TextEditor label="test3" v-model="textEditorValue" id="text-editor-1" />
    <FileUpload label="test3" v-model="textEditorValue" />
    <Datepicker id="test" label="test" v-model="testValue" />
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const textEditorValue = ref('')
const testValue = ref(null)

import {
  Text,
  TextEditor,
  Decimal,
  SimpleSelect,
  DataFetchingSelect,
  Datepicker,
  DateTimePicker,
  FileUpload,
  Checkbox,
  Slider,
} from './Components'
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
