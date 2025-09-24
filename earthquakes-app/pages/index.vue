<template>
  <div>
    <HeaderUserInfo />
    
    <v-main>
      <v-container fluid class="pa-4">
        <v-row>
          <v-col cols="12">
            <EarthquakeFilters
              v-if="!loading && !error"
              :model-value-timebox="timebox"
              :model-value-magnitude="magnitude"
              @update:model-value-timebox="onTimeboxChange"
              @update:model-value-magnitude="onMagnitudeChange"
            />
            
            <!-- Loading State -->
            <div v-if="loading" class="loading-container">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </div>
            
            <!-- Error State -->
            <v-alert
              v-else-if="error"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              <v-alert-title>Failed to load data</v-alert-title>
              {{ error }}
            </v-alert>
            
            <!-- Data State -->
            <EarthquakeList v-else :earthquakes="earthquakes" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeaderUserInfo from '~/components/layout/HeaderUserInfo.vue'
import EarthquakeList from '~/components/earthquakes/EarthquakeList.vue'
import EarthquakeFilters from '~/components/earthquakes/EarthquakeFilters.vue'
import { list, filterEarthquakes } from '~/earthquakes'
import type { Earthquake } from '~/earthquake'

const allEarthquakes = ref<Earthquake[]>([])
const earthquakes = ref<Earthquake[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

type TimeboxOption = 'H' | 'D' | 'W' | 'M'
type MagnitudeOption = '4.5+' | '2.5+' | '1.0+' | 'all'

let timebox = ref<TimeboxOption>('H')
let magnitude = ref<MagnitudeOption>('4.5+')

async function fetchData() {
  loading.value = true
  error.value = null
  try {
    allEarthquakes.value = await list()
    applyFilters()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred'
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  earthquakes.value = filterEarthquakes(allEarthquakes.value, timebox.value, magnitude.value)
}

function onTimeboxChange(v: TimeboxOption) {
  timebox.value = v
  applyFilters()
}

function onMagnitudeChange(v: MagnitudeOption) {
  magnitude.value = v
  applyFilters()
}

onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
</style>
