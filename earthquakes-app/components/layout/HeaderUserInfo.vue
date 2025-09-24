<template>
  <v-app-bar color="primary" dark elevation="2">
    <div class="logo-container">
      <img 
        :src="logoUrl" 
        alt="Earthquakes App Logo" 
        class="logo"
      />
    </div>
    
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
import logoUrl from '../../assets/images/logo.png'
// Header component with user info - presentation only
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  margin-left: 16px; /* Default Material-UI app bar title margin */
}

.logo {
  height: 40px; /* Appropriate size for Material-UI header */
  width: auto; /* Maintain aspect ratio */
  object-fit: contain;
}
</style>
