<template>
  <div>
    <HeaderUserInfo />
    
    <v-main>
      <v-container fluid class="pa-4">
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center mb-4">
              <v-btn 
                icon 
                @click="goBack" 
                variant="text"
                class="back-button"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </div>

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
              <v-alert-title>Failed to load earthquake</v-alert-title>
              {{ error }}
            </v-alert>

            <!-- Data State - 2 Column Layout -->
            <v-row v-else-if="feature" no-gutters>
              <!-- Left Column - Map Card -->
              <v-col cols="12" lg="6" class="pr-lg-4">
                <DetailMapCard 
                  v-if="coords"
                  :lat="coords.lat" 
                  :lon="coords.lon" 
                  :depth-km="coords.depthKm"
                  :zoom="8"
                />
              </v-col>
              
              <!-- Right Column - GeoJSON Details -->
              <v-col cols="12" lg="6" class="pl-lg-4">
                <div class="details-content">
                  <h2 class="text-h5 mb-4">{{ title }}</h2>
                  
                  <div class="text-body-2 text-medium-emphasis mb-4">
                    <span v-if="coords">{{ coords.lat?.toFixed(4) }}, {{ coords.lon?.toFixed(4) }}</span>
                    <span v-if="coords?.depthKm !== undefined"> • Depth {{ coords.depthKm.toFixed(1) }} km</span>
                  </div>

                  <v-divider class="mb-4"></v-divider>

                  <div class="details-section">
                    <h3 class="text-h6 mb-3">Basic Information</h3>
                    <div class="detail-grid">
                      <div class="detail-item">
                        <span class="detail-label">Magnitude:</span>
                        <span class="detail-value">{{ properties.mag ?? '—' }} {{ properties.magType ?? '' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Place:</span>
                        <span class="detail-value">{{ properties.place ?? '—' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">{{ formattedTime }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Updated:</span>
                        <span class="detail-value">{{ formattedUpdated }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">{{ properties.status ?? '—' }}</span>
                      </div>
                    </div>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="details-section">
                    <h3 class="text-h6 mb-3">Technical Details</h3>
                    <div class="detail-grid">
                      <div class="detail-item">
                        <span class="detail-label">Tsunami:</span>
                        <span class="detail-value">{{ properties.tsunami ?? '—' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Significance:</span>
                        <span class="detail-value">{{ properties.sig ?? '—' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Network:</span>
                        <span class="detail-value">{{ properties.net ?? '—' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Code:</span>
                        <span class="detail-value">{{ properties.code ?? '—' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Types:</span>
                        <span class="detail-value">{{ properties.types ?? '—' }}</span>
                      </div>
                    </div>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="details-section">
                    <h3 class="text-h6 mb-3">Raw GeoJSON Data</h3>
                    <v-expansion-panels variant="accordion">
                      <v-expansion-panel>
                        <v-expansion-panel-title>
                          <v-icon class="mr-2">mdi-code-json</v-icon>
                          View Complete GeoJSON
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <pre class="json-display">{{ JSON.stringify(feature, null, 2) }}</pre>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>

                  <div class="mt-6">
                    <v-btn 
                      v-if="properties.url" 
                      :href="properties.url" 
                      target="_blank" 
                      rel="noopener"
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-open-in-new"
                    >
                      Open on USGS
                    </v-btn>
                    <v-btn 
                      color="primary" 
                      variant="elevated" 
                      prepend-icon="mdi-arrow-left"
                      @click="goBack"
                      class="ml-2"
                    >
                      Back to List
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- No Data State -->
            <v-container v-else class="text-center py-8">
              <v-icon size="64" color="error">mdi-alert-circle</v-icon>
              <h3 class="text-h6 mt-4">No detail available</h3>
              <p class="text-body-2 text-grey">The requested earthquake detail could not be loaded.</p>
              <v-btn color="primary" @click="goBack" class="mt-4">Back to List</v-btn>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from '#app'
import HeaderUserInfo from '~/components/layout/HeaderUserInfo.vue'
import DetailMapCard from '~/components/map/DetailMapCard.vue'
import { fetchDetail } from '~/earthquakes'
import type { GeoJsonFeature } from '~/earthquake'

const route = useRoute()
const router = useRouter()

const feature = ref<GeoJsonFeature | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const detailUrl = typeof route.query.detail === 'string' ? route.query.detail : ''
  if (!detailUrl) {
    error.value = 'Missing detail URL in query parameter'
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  const data = await fetchDetail(detailUrl)
  feature.value = data
  if (!data) {
    error.value = 'Failed to load detail from USGS'
  }
  loading.value = false
})

const properties = computed(() => feature.value?.properties ?? {})
const coords = computed(() => {
  const geom: any = feature.value?.geometry
  if (geom && geom.type === 'Point' && Array.isArray(geom.coordinates)) {
    const [lon, lat, depth] = geom.coordinates as [number, number, number?]
    return { lat, lon, depthKm: depth }
  }
  return undefined
})

const title = computed(() => {
  const p: any = properties.value
  const mag = typeof p.mag === 'number' ? p.mag : undefined
  const place = typeof p.place === 'string' ? p.place : undefined
  const t = typeof p.title === 'string' ? p.title : undefined
  return t ?? `M ${mag ?? '?'} - ${place ?? 'Unknown location'}`
})

const formattedTime = computed(() => {
  const t = (properties.value as any).time
  return typeof t === 'number' ? new Date(t).toLocaleString() : '—'
})
const formattedUpdated = computed(() => {
  const u = (properties.value as any).updated
  return typeof u === 'number' ? new Date(u).toLocaleString() : '—'
})

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.details-content {
  padding: 0;
}

.details-section {
  margin-bottom: 1.5rem;
}

.detail-grid {
  display: grid;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #666;
  min-width: 120px;
}

.detail-value {
  color: #333;
  text-align: right;
  word-break: break-word;
}

.json-display {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  line-height: 1.4;
  max-height: 400px;
  overflow-y: auto;
  margin: 0;
}

.heading-spaced {
  letter-spacing: 0.5px;
}

.back-button {
  box-shadow: none !important;
  background: transparent !important;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.04) !important;
  box-shadow: none !important;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .detail-value {
    text-align: left;
  }
}
</style>
