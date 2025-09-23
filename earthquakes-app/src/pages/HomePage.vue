<template>
  <div>
    <HeaderUserInfo />
    
    <v-main>
      <v-container fluid class="pa-4">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center mb-6">
              <v-icon size="32" color="primary" class="mr-3">mdi-chart-line</v-icon>
              <h1 class="text-h4">Earthquake Data</h1>
            </div>
            
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              <p class="text-h6 mt-4">Loading earthquake data...</p>
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
import HeaderUserInfo from '../components/layout/HeaderUserInfo.vue'
import EarthquakeList from '../components/earthquakes/EarthquakeList.vue'
import { list } from '../services/earthquakes'
import type { Earthquake } from '../types/earthquake'

const earthquakes = ref<Earthquake[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    earthquakes.value = await list()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred'
  } finally {
    loading.value = false
  }
})
</script>
