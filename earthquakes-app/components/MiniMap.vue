<template>
  <div 
    :id="mapId" 
    :style="{ height }" 
    data-testid="mini-map"
    class="mini-map-container"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Props {
  lat: number
  lon: number
  zoom?: number
  height?: string
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 6,
  height: '160px',
  interactive: false
})

const mapId = ref(`mini-map-${Math.random().toString(36).substr(2, 9)}`)
let map: L.Map | null = null
let marker: L.Marker | null = null

const initializeMap = async () => {
  await nextTick()
  
  const container = document.getElementById(mapId.value)
  if (!container) return

  // Initialize map
  map = L.map(container, {
    zoomControl: props.interactive,
    dragging: props.interactive,
    touchZoom: props.interactive,
    doubleClickZoom: props.interactive,
    scrollWheelZoom: props.interactive,
    boxZoom: props.interactive,
    keyboard: props.interactive,
    attributionControl: true
  })

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map)

  // Center map and add marker
  map.setView([props.lat, props.lon], props.zoom)
  
  // Create marker
  marker = L.marker([props.lat, props.lon]).addTo(map)
}

const updateMap = () => {
  if (!map) return
  
  map.setView([props.lat, props.lon], props.zoom)
  
  if (marker) {
    marker.setLatLng([props.lat, props.lon])
  } else {
    marker = L.marker([props.lat, props.lon]).addTo(map)
  }
}

onMounted(() => {
  initializeMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
    marker = null
  }
})

// Watch for prop changes
watch([() => props.lat, () => props.lon, () => props.zoom], () => {
  updateMap()
})
</script>

<style scoped>
.mini-map-container {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}

:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
}

:deep(.leaflet-control-zoom) {
  display: none;
}

:deep(.leaflet-control-attribution) {
  font-size: 10px;
  line-height: 1.2;
}
</style>
