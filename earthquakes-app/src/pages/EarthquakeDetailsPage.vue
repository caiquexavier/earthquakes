<template>
  <div>
    <v-app-bar color="primary" dark>
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-app-bar-title>Earthquake Details</v-app-bar-title>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="text-h6 mt-4">Loading earthquake details...</p>
        </div>
        
        <!-- Error State -->
        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          <v-alert-title>Failed to load earthquake</v-alert-title>
          {{ error }}
        </v-alert>
        
        <!-- Data State -->
        <v-row v-else-if="earthquake" justify="center">
          <v-col cols="12" md="8" lg="6">
            <v-card elevation="4">
              <v-img
                :src="earthquake.image"
                height="400"
                cover
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                </template>
              </v-img>
              
              <v-card-title class="text-h4">{{ earthquake.title }}</v-card-title>
              
              <v-card-subtitle class="text-h6">
                <span class="font-mono">{{ earthquake.geo_id }}</span>
              </v-card-subtitle>
              
              <v-card-text>
                <p class="text-body-1">{{ earthquake.description }}</p>
              </v-card-text>
              
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  variant="outlined"
                  @click="goBack"
                >
                  Back to List
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Not Found State -->
        <v-container v-else class="text-center py-8">
          <v-icon size="64" color="error">mdi-alert-circle</v-icon>
          <h3 class="text-h6 mt-4">Earthquake not found</h3>
          <p class="text-body-2 text-grey">The requested earthquake could not be found.</p>
          <v-btn color="primary" @click="goBack" class="mt-4">
            Back to List
          </v-btn>
        </v-container>
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getById } from '../services/earthquakes'
import type { Earthquake } from '../types/earthquake'

interface Props {
  id: string
}

const props = defineProps<Props>()
const router = useRouter()
const earthquake = ref<Earthquake | undefined>()
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    const id = parseInt(props.id)
    earthquake.value = await getById(id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred'
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push('/')
}
</script>
