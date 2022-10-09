<template>
  <form class="mt-4 flex flex-col gap-4 w-[500px] mr-auto">
    <Text label="Full name" v-model="fullName" />
    <Decimal v-model="price" />
    <div class="flex wrap gap-4">
      <button class="btn btn-primary" type="button" @click="setPriceEmpty">
        Set price empty
      </button>
      <button class="btn btn-primary" type="button" @click="setPriceNull">
        Set price null
      </button>
      <button class="btn btn-primary" type="button" @click="setPriceWithComma">
        Set price with comma
      </button>
      <button class="btn btn-primary" type="button" @click="setPriceWithDot">
        Set price with dot
      </button>
    </div>
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

    <FlatpickrTimePicker
      label="Flatpickr time picker"
      v-model="attendanceTime"
    />

    <div class="mb-[300px]">
      <button
        class="btn btn-primary"
        type="button"
        @click="showSelect = !showSelect"
      >
        Show/hide select
      </button>
      <div v-if="showSelect">
        <SimpleSelect
          id="role-select-2"
          label="Select role"
          v-model="role2"
          :config="{ options: roleOptions }"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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
import FlatpickrTimePicker from '../../components/Inputs/FlatpickrTimePicker.vue'
import { SelectOption } from '../../models/SelectOption'

const fullName = ref('')
const price = ref('9912,22')
const notes = ref('')
const isActive = ref(false)
const probability = ref(60)
const role = ref('')
const role2 = ref('')
const user = ref('')
const dateOfBirth = ref()
const eventStartTime = ref('')
const eventDuration = ref()
const profilePicture = ref()
const attendanceTime = ref(null)

const setPriceEmpty = () => (price.value = '')
const setPriceNull = () => (price.value = null)
const setPriceWithComma = () => (price.value = '123,61')
const setPriceWithDot = () => (price.value = '132.2')

const showSelect = ref(true)
watch(showSelect, (n) => {
  if (!n) role2.value = ''
})

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
