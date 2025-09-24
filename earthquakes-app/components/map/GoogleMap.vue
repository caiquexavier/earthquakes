<template>
  <div ref="mapEl" style="width: 100%; height: 360px;"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

interface Props {
  lat: number
  lon: number
  zoom?: number
}

const props = defineProps<Props>()
const mapEl: Ref<HTMLDivElement | null> = ref(null)
let map: google.maps.Map | null = null
let marker: google.maps.Marker | null = null

async function initMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (!apiKey) return
  const loader = new Loader({ apiKey, version: 'weekly' })
  await loader.load()
  if (!mapEl.value) return
  const center = { lat: props.lat, lng: props.lon }
  map = new google.maps.Map(mapEl.value, {
    center,
    zoom: props.zoom ?? 7,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  })
  marker = new google.maps.Marker({ position: center, map })
}

onMounted(initMap)

watch(() => [props.lat, props.lon] as const, ([lat, lon]) => {
  if (map && marker) {
    const pos = { lat, lng: lon }
    map.setCenter(pos)
    marker.setPosition(pos)
  }
})
</script>

<style scoped>
</style>


