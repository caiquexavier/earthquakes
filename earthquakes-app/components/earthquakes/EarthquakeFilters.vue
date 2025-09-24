<template>
  <div class="d-flex align-center justify-space-between mb-4" style="gap: 16px; flex-wrap: wrap;">
    <div class="d-flex align-center" style="gap: 8px;">
      <span class="text-body-2" style="color: var(--nasa-blue);">Time</span>
      <v-btn-toggle
        density="compact"
        rounded="xl"
        :model-value="modelValueTimebox"
        @update:model-value="(v: TimeboxOption) => emit('update:modelValueTimebox', v)"
      >
        <v-btn value="H" size="small">H</v-btn>
        <v-btn value="D" size="small">D</v-btn>
        <v-btn value="W" size="small">W</v-btn>
        <v-btn value="M" size="small">M</v-btn>
      </v-btn-toggle>
    </div>

    <div class="d-flex align-center" style="gap: 8px;">
      <span class="text-body-2" style="color: var(--nasa-blue);">Magnitude</span>
      <v-btn-toggle
        density="compact"
        rounded="xl"
        :model-value="modelValueMagnitude"
        @update:model-value="(v: MagnitudeOption) => emit('update:modelValueMagnitude', v)"
      >
        <v-btn value="4.5+" size="small">4.5+</v-btn>
        <v-btn value="2.5+" size="small">2.5+</v-btn>
        <v-btn value="1.0+" size="small">1.0+</v-btn>
        <v-btn value="all" size="small">all</v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script setup lang="ts">
type TimeboxOption = 'H' | 'D' | 'W' | 'M'
type MagnitudeOption = '4.5+' | '2.5+' | '1.0+' | 'all'

interface Props {
  modelValueTimebox: TimeboxOption
  modelValueMagnitude: MagnitudeOption
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValueTimebox', value: TimeboxOption): void
  (e: 'update:modelValueMagnitude', value: MagnitudeOption): void
}>()

// Presentational only
</script>

<style scoped>
</style>


