<template>
  <v-card class="earthquake-card" elevation="2" hover>
    <!-- Mini Map Section - Now at the top -->
    <div v-if="earthquake.coordinates" class="mini-map-section">
      <MiniMap 
        :lat="earthquake.coordinates.lat" 
        :lon="earthquake.coordinates.lon" 
        :zoom="6" 
        :interactive="false" 
        height="160px"
        data-testid="feature-mini-map"
      />
    </div>
    
    <v-card-text class="pt-4 pb-0">
      <div class="d-flex align-center justify-space-between">
        <h3 class="text-h6 heading-spaced">{{ earthquake.title }}</h3>
        <v-chip :style="badgeStyle" size="small" variant="flat">
          M {{ earthquake.magnitude ?? '?' }}
        </v-chip>
      </div>
      <div class="text-body-2 mt-1">
        <strong>Magnitude:</strong>
        <span :class="magnitudeTextClass">{{ earthquake.magnitude ?? '—' }}</span>
      </div>
      <div class="text-body-2 text-medium-emphasis">
        <span v-if="earthquake.coordinates">{{ earthquake.coordinates.lat?.toFixed(2) }}, {{ earthquake.coordinates.lon?.toFixed(2) }}</span>
        <span v-if="earthquake.coordinates?.depthKm !== undefined"> • Depth {{ earthquake.coordinates.depthKm.toFixed(1) }} km</span>
      </div>
      <div class="text-body-2 text-medium-emphasis" v-if="earthquake.time">
        {{ new Date(earthquake.time).toLocaleString() }}
      </div>
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="elevated"
        prepend-icon="mdi-eye"
        @click="goToDetails"
      >
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
 </template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Earthquake } from '~/earthquake'
import MiniMap from '../MiniMap.vue'

interface Props {
  earthquake: Earthquake
}

const props = defineProps<Props>()

// Removed unused magnitudeClass computed property

const magnitudeTextClass = computed(() => {
  const mag = props.earthquake.magnitude
  if (mag == null) return 'mono-gray'
  if (mag < 2.5) return 'mono-gray'
  if (mag < 4.5) return 'mono-yellow'
  return 'mono-green'
})

const badgeStyle = computed(() => {
  const mag = props.earthquake.magnitude
  // Colors per spec: >=4.5 #f24949; >2.5 && <4.5 #edf249; <=2.5 #49a3f2
  if (mag == null) return { backgroundColor: '#49a3f2', color: '#000' }
  if (mag >= 4.5) return { backgroundColor: '#f24949', color: '#fff' }
  if (mag > 2.5) return { backgroundColor: '#edf249', color: '#000' }
  return { backgroundColor: '#49a3f2', color: '#fff' }
})

function goToDetails() {
  if (props.earthquake.detailUrl) {
    navigateTo(`/EarthquakeDetailsPage?detail=${encodeURIComponent(props.earthquake.detailUrl)}`)
  }
}
</script>

<style scoped>
.earthquake-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out;
}

.earthquake-card:hover {
  transform: translateY(-4px);
}

.earthquake-card .v-card-text {
  flex-grow: 1;
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.mono-gray { color: #000000; }
.mono-yellow { color: #7A6A00; }
.mono-green { color: #0F3D0F; }

.mini-map-section {
  margin: 0;
  border-radius: 0;
  overflow: hidden;
  border-bottom: 1px solid #e0e0e0;
}
</style>
