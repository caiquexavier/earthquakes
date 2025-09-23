<template>
  <v-app-bar color="primary" dark elevation="2">
    <v-app-bar-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-earthquake</v-icon>
      earthquakes-app
    </v-app-bar-title>
    
    <v-spacer></v-spacer>
    
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          class="d-flex align-center"
        >
          <v-avatar size="32" class="mr-2">
            <v-img src="https://via.placeholder.com/32x32/1976d2/ffffff?text=U" alt="User Avatar"></v-img>
          </v-avatar>
          <div class="text-left d-none d-sm-block">
            <div class="text-subtitle2">John Doe</div>
            <div class="text-caption">john.doe@example.com</div>
          </div>
          <v-icon class="ml-1">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      
      <v-list>
        <v-list-item>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
// Header component with user info - presentation only
</script>
