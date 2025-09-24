<template>
  <div>
    <v-row v-if="earthquakes.length > 0">
      <v-col
        v-for="earthquake in earthquakes"
        :key="earthquake.id"
        cols="12"
        md="6"
      >
        <EarthquakeCard :earthquake="earthquake" />
      </v-col>
    </v-row>
    
    <v-container v-else class="text-center py-16">
      <v-card class="mx-auto" max-width="400" elevation="2">
        <v-card-text class="pa-8">
          <v-icon size="80" color="grey-lighten-1">mdi-earthquake</v-icon>
          <h3 class="text-h5 mt-4 mb-2">No earthquakes found</h3>
          <p class="text-body-1 text-grey">There are no earthquake records to display.</p>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import EarthquakeCard from './EarthquakeCard.vue'
import type { Earthquake } from '~/earthquake'

interface Props {
  earthquakes: Earthquake[]
}

defineProps<Props>()
</script>
