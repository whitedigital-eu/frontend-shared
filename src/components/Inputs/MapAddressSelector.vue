<template>
  <div class="relative" :class="{ 'overflow-hidden': isEmpty && !hasFocus }">
    <FormFieldLabel
      v-if="label"
      :is-placeholder="isEmpty && !hasFocus"
      @click.native="handleLabelClick"
    >
      {{ props.label }}
    </FormFieldLabel>
    <input
      id="autocomplete-input"
      ref="inputRef"
      v-model="value"
      class="form-control sm:min-w-[200px] w-full"
      :class="{ 'sm:min-w-[416px]': long }"
      placeholder=""
      :readonly="readonly"
      type="text"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    />
    <div id="map" class="map-container">
      <div ref="map" class="map"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import FormFieldLabel from '../FormFieldLabel.vue'
import { watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: { address: string; lat: number; lng: number } | undefined
    label?: string | null
    mapData?: {
      googleApi: string
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
  }
)

const emit = defineEmits(['update:modelValue'])

const handleFocus = () => {
  if (props.readonly) return
  hasFocus.value = true
}
const handleBlur = () => (hasFocus.value = false)

const inputRef = ref<HTMLInputElement | undefined>()
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

let googleMap: google.maps.Map | null = null
let marker: google.maps.Marker | null = null

const loadGoogleMapsAPI = () => {
  const existingScript = document.querySelector(`script[src="https://maps.googleapis.com/maps/api/js?key=${props.mapData?.googleApi}&libraries=places"]`);
  if (existingScript) {
    initMap();
    return;
  }
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${props.mapData?.googleApi}&libraries=places`;
  script.onload = initMap;
  document.head.appendChild(script);
};

const initMap = () => {
  const mapElement = document.getElementById('map')

  if (mapElement && props.mapData) {
    const mapOptions: google.maps.MapOptions = {
      center: new google.maps.LatLng(
          props.modelValue?.lat ? props.modelValue.lat : props.mapData.initialLat,
          props.modelValue?.lng ? props.modelValue.lng : props.mapData?.initialLng
      ),
      zoom: 12,
    }

    googleMap = new google.maps.Map(mapElement, mapOptions)
    marker = new google.maps.Marker({
      position: mapOptions.center,
      map: googleMap,
      draggable: true,
    })

    marker.addListener('dragend', onMarkerDragEnd)

    if (inputRef.value) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.value)
      autocomplete.setFields(['formatted_address', 'geometry'])
      autocomplete.addListener('place_changed', onPlaceChanged)
    }
  }
}
const onPlaceChanged = () => {
  value.value = (<HTMLInputElement>document.getElementById('autocomplete-input')).value
  handleAddressAutocomplete()
}

const handleAddressAutocomplete = () => {
  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address: value.value }, (results, status) => {
    if (
      status === google.maps.GeocoderStatus.OK &&
      results &&
      results?.length > 0
    ) {
      const location = results[0].geometry.location
      const address = results[0].formatted_address
      const position = {address: address, lat: location.lat(), lng: location.lng() }
      emit('update:modelValue', position)
      marker?.setPosition(location)
      googleMap?.setCenter(location)
    }
  })
}

const onMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
  const { lat, lng } = event.latLng?.toJSON() || {};
  const position = { address: value.value, lat, lng };
  emit('update:modelValue', position);
};

onMounted(() => {
  inputRef.value = document.getElementById(
    'autocomplete-input'
  ) as HTMLInputElement
  if (props.mapData) {
    loadGoogleMapsAPI()
  }
})

watch(
    () => props.modelValue?.address,
    (n) => (value.value = n as string),
    { immediate: true }
)
</script>

<style lang="scss" scoped>
input {
  display: block;
  appearance: none;
  transition: all 0.2s ease-in-out;
}
.map-container {
  width: 100%;
  height: 400px;
}

.map {
  width: 100%;
  height: 100%;
}
</style>
