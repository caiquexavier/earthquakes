<template>
  <v-card class="detail-map-card" elevation="2">
    <div 
      :id="mapId" 
      class="detail-map" 
      data-testid="detail-map"
    ></div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Props {
  lat: number
  lon: number
  depthKm?: number
  zoom?: number
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 8
})

const mapId = ref(`detail-map-${Math.random().toString(36).substr(2, 9)}`)
let map: L.Map | null = null
let marker: L.Marker | null = null

const initializeMap = async () => {
  await nextTick()
  
  const container = document.getElementById(mapId.value)
  if (!container) return

  // Initialize map
  map = L.map(container, {
    zoomControl: true,
    dragging: true,
    touchZoom: true,
    doubleClickZoom: true,
    scrollWheelZoom: true,
    boxZoom: true,
    keyboard: true,
    attributionControl: true
  })

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map)

  // Center map and add marker
  map.setView([props.lat, props.lon], props.zoom)
  
  // Create marker with custom icon
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-pin"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 20]
  })
  
  marker = L.marker([props.lat, props.lon], { icon: customIcon }).addTo(map)
}

const updateMap = () => {
  if (!map) return
  
  map.setView([props.lat, props.lon], props.zoom)
  
  if (marker) {
    marker.setLatLng([props.lat, props.lon])
  } else {
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div class="marker-pin"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 20]
    })
    marker = L.marker([props.lat, props.lon], { icon: customIcon }).addTo(map)
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
.detail-map-card {
  height: 500px;
  padding: 0;
  overflow: hidden;
}

.detail-map {
  width: 100%;
  height: 100%;
  height: 500px;
}

:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
}

:deep(.custom-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-pin) {
  width: 20px;
  height: 20px;
  background: #f24949;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  position: relative;
}

:deep(.marker-pin::after) {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #f24949;
}
</style>
