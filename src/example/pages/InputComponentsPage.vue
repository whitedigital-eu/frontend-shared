<template>
  <form class="mt-4 flex flex-col gap-4 w-[500px] mr-auto">
    <Text label="Full name" v-model="fullName" />
    <Decimal label="Price" v-model="price" />
    <TextEditor id="notes-editor" label="Notes" v-model="notes" />
    <Checkbox label="Is active" v-model="isActive" />
    <Slider label="Probability" v-model="probability" />
    <SimpleSelect
      id="role-select"
      label="Select role"
      v-model="role"
      :config="{ options: roleOptions }"
    />
    <DataFetchingSelect
      :axios-instance="axiosInstance"
      id="user-select"
      label="Select user"
      v-model="user"
      :config="userSelectConfig"
    />
    <Datepicker label="Date of birth" v-model="dateOfBirth" />
    <DateTimePicker label="Event starts at" v-model="eventStartTime" />
    <RangeDatepicker label="Event duration" v-model="eventDuration" />
    <FileUpload
      :axios-instance="axiosInstance"
      label="Profile picture"
      v-model="profilePicture"
    />
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import Text from '../../components/Inputs/Text.vue'
import Decimal from '../../components/Inputs/Decimal.vue'
import TextEditor from '../../components/Inputs/TextEditor.vue'
import Checkbox from '../../components/Inputs/Checkbox.vue'
import Slider from '../../components/Inputs/Slider.vue'
import SimpleSelect from '../../components/Inputs/Selects/SimpleSelect.vue'
import DataFetchingSelect from '../../components/Inputs/Selects/DataFetchingSelect.vue'
import Datepicker from '../../components/Inputs/Datepicker.vue'
import DateTimePicker from '../../components/Inputs/DateTimePicker.vue'
import FileUpload from '../../components/Inputs/FileUpload/FileUpload.vue'
import RangeDatepicker from '../../components/Inputs/RangeDatepicker.vue'
import { SelectOption } from '../../models/SelectOption'

const fullName = ref('')
const price = ref()
const notes = ref('')
const isActive = ref(false)
const probability = ref(60)
const role = ref('')
const user = ref('')
const dateOfBirth = ref()
const eventStartTime = ref('')
const eventDuration = ref()
const profilePicture = ref()

const axiosInstance = axios.create()

const roleOptions = [
  new SelectOption('User', 'ROLE_USER'),
  new SelectOption('Admin', 'ROLE_ADMIN'),
  new SelectOption('Super admin', 'ROLE_SUPER_ADMIN'),
]
const userSelectConfig = {
  requestUrlGenerator: (searchValue: string) =>
    `https://randomuser.me/api?name=${searchValue}`,
  responseMapFunction: (data) => new SelectOption('test', 'test'),
}
</script>
