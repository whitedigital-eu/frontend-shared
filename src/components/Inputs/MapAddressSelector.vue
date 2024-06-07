<template>
  <div class="relative" :class="{ 'overflow-hidden': isEmpty && !hasFocus }">
    <FormFieldLabel
      v-if="label"
      :is-placeholder="isEmpty && !hasFocus"
      @click="handleLabelClick"
    >
      {{ props.label }}
    </FormFieldLabel>
    <input
      id="autocomplete-input"
      ref="inputRef"
      v-model="value"
      class="appearance-none block form-control sm:min-w-[200px] w-full"
      :class="{ 'sm:min-w-[416px]': long }"
      placeholder=""
      :readonly="readonly"
      type="text"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    />
    <div id="map" class="h-[400px] w-full">
      <GoogleMap
        ref="mapRef"
        :api-key="mapData?.googleApiKey"
        :center="center"
        class="h-full w-full"
        :zoom="12"
      >
        <Marker
          ref="markerRef"
          :options="{ position: center, draggable: true }"
          @dragend="onMarkerDragEnd"
        />
      </GoogleMap>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import FormFieldLabel from '../FormFieldLabel.vue'
import { MapCoordinateSelectorFieldValue } from './ValueTypes'

const props = withDefaults(
  defineProps<{
    modelValue?: MapCoordinateSelectorFieldValue
    label?: string | null
    mapData?: {
      googleApiKey: string
      initialLat: number
      initialLng: number
    } | null
    readonly?: boolean
    long?: boolean
  }>(),
  {
    modelValue: undefined,
    label: null,
    mapData: null,
    readonly: false,
    long: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: MapCoordinateSelectorFieldValue]
}>()

const mapRef = ref<typeof GoogleMap | null>(null)
const markerRef = ref<typeof Marker | null>(null)

const center = computed(() =>
  props.mapData
    ? { lat: props.mapData.initialLat, lng: props.mapData.initialLng }
    : undefined,
)

const handleFocus = () => {
  if (props.readonly) return
  hasFocus.value = true
}
const handleBlur = () => (hasFocus.value = false)

const inputRef = ref<HTMLInputElement>()
const value = ref('')
const hasFocus = ref(false)
const isEmpty = computed(() => !value.value)

const handleInput = (e: Event) => {
  value.value = (e.target as HTMLInputElement).value
}

const handleLabelClick = () => {
  if (props.readonly) return
  inputRef.value?.focus()
}

const handleAddressAutocomplete = () => {
  if (!markerRef.value || !mapRef.value) {
    console.error('Marker or map not found', markerRef.value, mapRef.value)
    return
  }

  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address: value.value }, (results, status) => {
    if (
      status === google.maps.GeocoderStatus.OK &&
      results &&
      results?.length > 0
    ) {
      const location = results[0].geometry.location
      const address = results[0].formatted_address
      const position = {
        address: address,
        lat: location.lat(),
        lng: location.lng(),
      }
      emit('update:modelValue', position)
      markerRef.value!.marker.setPosition(location)
      mapRef.value!.map.setCenter(location)
    }
  })
}

const onMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
  const coords = event.latLng?.toJSON()
  const position = {
    address: value.value,
    lat: coords?.lat ?? 0,
    lng: coords?.lng ?? 0,
  }
  emit('update:modelValue', position)
}

watch(
  () => props.modelValue?.address,
  (n) => (value.value = n as string),
  { immediate: true },
)

watch(
  () => mapRef.value?.ready,
  async (n) => {
    if (!n || !mapRef.value || !inputRef.value) return

    const placesApi = await mapRef.value.api.importLibrary('places')

    if (!placesApi) return

    new placesApi.Autocomplete(inputRef.value!, {
      types: ['address'],
      fields: ['formatted_address', 'geometry'],
    }).addListener('place_changed', () => {
      value.value = inputRef.value!.value
      handleAddressAutocomplete()
    })
  },
)
</script>

<style lang="scss" scoped>
input {
  transition: all 0.2s ease-in-out;
}
</style>
