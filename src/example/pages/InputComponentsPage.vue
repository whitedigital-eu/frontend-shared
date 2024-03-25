<template>
  <div class="flex flex-wrap gap-4 mt-8">
    <form class="basis-[500px] flex flex-col gap-4">
      {{ $t('translation', 'test', 'Context') }}
      <Text v-model="fullName" label="Full name" />
      <Text
        v-model="favouriteFood"
        :config="{
          wrapperAttributes: { 'data-test': 'input-wrapper' },
          labelAttributes: { style: 'background-color: gainsboro' },
          inputAttributes: { class: 'text-red-500' },
        }"
        label="Favourite food"
      />
      <Text
        v-model="count"
        :config="{ inputAttributes: { type: 'number' } }"
        label="Count"
      />
      <TextList v-model="textArrayList" label="Text List" />
      <KeyAndValueList
        v-model="keyAndValueArrayList"
        :texts="{
          keyLabel: 'title',
          valueLabel: 'value',
          addField: 'Add field',
          formLabel: 'Forma',
        }"
      />
      <MultipleTextFields
        v-model="multipleTextArrayList"
        label="Work times"
        :label-array="[
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ]"
      />
      <Decimal v-model="price" :config="{ maxDecimals: 2 }" label="Price" />
    </form>
    <form class="basis-[500px] flex flex-col gap-4">
      <TextEditor v-model="notes" label="Notes" />
      <HtmlContentEditor
        v-model="htmlContent"
        api-origin="/"
        label="Html content"
      />
      <Checkbox v-model="isActive" label="Is active" />
      <Checkbox v-model="isBlocked" label="Is blocked" readonly />
    </form>
    <form class="basis-[500px] flex flex-col gap-4">
      <Slider v-model="probability" label="Probability" />
      <div class="flex gap-4 items-center">
        <SimpleSelect
          id="role-select"
          v-model="role"
          class="basis-[200px]"
          :config="roleSelectConfig"
          label="Select role"
        />
        <button
          class="btn btn-primary"
          type="button"
          @click="
            () => {
              roleSelectConfig.tomSelectSettings.options = otherRoleOptions
            }
          "
        >
          Change select options
        </button>
      </div>
      <DataFetchingSelect
        id="user-select"
        v-model="user"
        :axios-instance="axiosInstance"
        :config="userSelectConfig"
        label="Select user"
      />
      <Datepicker v-model="dateOfBirth" label="Date of birth" />
      <DateTimePicker v-model="eventStartTime" label="Event starts at" />
      <RangeDatepicker v-model="eventDuration" label="Event duration" />
      <FileUpload
        v-model="profilePicture"
        :config="{
          axiosInstance: axios,
          hostUrl: 'www.example.com',
          allowDownload: true,
          allowEdit: true,
          endpointUrl: '/api/storage_items',
        }"
        label="Profile picture"
      />

      <FlatpickrTimePicker
        id="flatpickr-time-picker"
        v-model="attendanceTime"
        label="Flatpickr time picker"
      />
      <Map
        v-model="mapDataArray"
        label="Input address"
        :map-data="{
          googleApiKey: googleMapsApiKey,
          initialLat: 56.946285,
          initialLng: 24.105078,
        }"
      />
      <PlainTextarea v-model="textareaValue" label="Plain textarea" />

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
            v-model="role2"
            :config="{ tomSelectSettings: { options: roleOptions } }"
            label="Select role"
          />
        </div>
      </div>
    </form>
    <div class="flex flex-wrap gap-4 items-start">
      <button
        class="btn btn-primary"
        @click="showHeartbeatPopup = !showHeartbeatPopup"
      >
        Toggle heartbeat popup
      </button>
      <HeartbeatPopup v-if="showHeartbeatPopup" bg-class="bg-red-500" />

      <button
        class="btn btn-success"
        @click="showSuccessMessage('Changes saved!')"
      >
        Show success message
      </button>
      <button
        class="btn btn-danger"
        @click="showGlobalError('Something went wrong!')"
      >
        Show error message
      </button>
    </div>
  </div>
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
import Datepicker from '../../components/Inputs/Datepicker.vue'
import DateTimePicker from '../../components/Inputs/DateTimePicker.vue'
import FileUpload from '../../components/Inputs/FileUpload/FileUpload.vue'
import RangeDatepicker from '../../components/Inputs/RangeDatepicker.vue'
import FlatpickrTimePicker from '../../components/Inputs/FlatpickrTimePicker.vue'
import { DataFetchingSelectConfig } from '../../types/InputFields'
import HtmlContentEditor from '../../components/Inputs/HtmlContentEditor.vue'
import TextList from '../../components/Inputs/TextList.vue'
import KeyAndValueList from '../../components/Inputs/KeyAndValueList.vue'
import MultipleTextFields from '../../components/Inputs/MultipleTextFields.vue'
import Map from '../../components/Inputs/MapAddressSelector.vue'
import PlainTextarea from '../../components/Inputs/PlainTextarea.vue'
import { useTranslation } from '../../i18n/Stores/useTranslation'
import HeartbeatPopup from '../../components/Heartbeat/HeartbeatPopup.vue'
import { SelectOption } from '../../models/FormFields'
import {
  showGlobalError,
  showSuccessMessage,
} from '../../helpers/FlashMessages'
import DataFetchingSelect from '../../components/Inputs/Selects/DataFetchingSelect.vue'

const fullName = ref('')
const favouriteFood = ref('Pasta')
const count = ref(0)
const price = ref('5')
const notes = ref(`
<h2 class="test-class">Heading 1</h2>
<h3 style="color:red">Heading 2</h3>
<h4>Heading 3</h4>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium ad alias blanditiis consectetur consequuntur delectus deleniti, est et fugit illum incidunt nemo, quam quas quo sint, tempore temporibus vel velit. </p>
<ul>
  <li>Stuff</li>
  <li>And</li>
  <li>Things</li>
</ul>
<ol>
   <li>Stuff</li>
   <li>And</li>
   <li>Things</li>
</ol>
<a href="www.example.com">Example link</a>
`)
const isActive = ref(false)
const isBlocked = ref(true)
const probability = ref(60)
const role = ref('')
const role2 = ref('')
const user = ref('')
const dateOfBirth = ref()
const eventStartTime = ref('')
const eventDuration = ref()
const profilePicture = ref()
const attendanceTime = ref('12:34')
const textArrayList = ref(['test', 'test2', 'test3'])
const keyAndValueArrayList = ref([{ key: 'test', value: 'test2' }])
const multipleTextArrayList = ref(['12:30', '13:30', '14:40'])
const mapDataArray = ref({
  address: 'Slokas iela 193',
  lat: 10.0,
  lng: 10.0,
})

const { t } = useTranslation()

const showSelect = ref(true)
watch(showSelect, (n) => {
  if (!n) role2.value = ''
})

const axiosInstance = axios.create()

const roleOptions: SelectOption[] = [
  new SelectOption('User', 'ROLE_USER'),
  new SelectOption('Admin', 'ROLE_ADMIN'),
  new SelectOption('Super admin', 'ROLE_SUPER_ADMIN'),
  new SelectOption(
    t('admin', 'coolAdmin', 'select option'),
    'ROLE_SUPER_ADMIN_TRANSLATE',
  ),
]
const otherRoleOptions: SelectOption[] = [
  new SelectOption('Test role', 'ROLE_TEST'),
]

const roleSelectConfig = ref({ tomSelectSettings: { options: roleOptions } })

const userSelectConfig: DataFetchingSelectConfig = {
  requestUrlGenerator: (searchValue: string) =>
    `https://randomuser.me/api?name=${searchValue}`,
  responseMapFunction: () => new SelectOption('test', 'test'),
}

const htmlContent = ref(`
<h2 class="test-class">Heading 1</h2>
<h3 style="color:red">Heading 2</h3>
<h4>Heading 3</h4>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium ad alias blanditiis consectetur consequuntur delectus deleniti, est et fugit illum incidunt nemo, quam quas quo sint, tempore temporibus vel velit. </p>
<ul>
  <li>Stuff</li>
  <li>And</li>
  <li>Things</li>
</ul>
<ol>
   <li>Stuff</li>
   <li>And</li>
   <li>Things</li>
</ol>
<a href="www.example.com">Example link</a>
`)

const textareaValue = ref('Lorem ipsum dolor sit amet...')

// @ts-ignore
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string

const showHeartbeatPopup = ref(false)
</script>
