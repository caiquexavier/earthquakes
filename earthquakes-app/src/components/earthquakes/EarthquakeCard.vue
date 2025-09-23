<template>
  <v-card class="earthquake-card" elevation="2" hover>
    <v-img
      :src="earthquake.image"
      height="200"
      cover
      class="align-end"
    >
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </template>
      <v-card-title class="text-white text-shadow">{{ earthquake.title }}</v-card-title>
    </v-img>
    
    <v-card-subtitle class="pa-4 pb-2">
      <v-chip size="small" color="primary" variant="outlined">
        <v-icon start>mdi-map-marker</v-icon>
        {{ earthquake.geo_id }}
      </v-chip>
    </v-card-subtitle>
    
    <v-card-text class="pt-0">
      <p class="text-body-2">{{ earthquake.description }}</p>
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
import { useRouter } from 'vue-router'
import type { Earthquake } from '../../types/earthquake'

interface Props {
  earthquake: Earthquake
}

const props = defineProps<Props>()
const router = useRouter()

function goToDetails() {
  router.push(`/earthquakes/${props.earthquake.id}`)
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
</style>
