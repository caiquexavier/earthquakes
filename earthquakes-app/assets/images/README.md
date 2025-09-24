# Assets Images

This directory contains image assets for the earthquakes application.

## Logo

- **File**: `logo.svg`
- **Description**: Custom earthquake-themed logo with seismic wave patterns
- **Usage**: Displayed in the application header
- **Dimensions**: 32x32 pixels
- **Colors**: Blue (#1976d2) and red (#f24949) on transparent background

## Logo Design

The logo features:
- Seismic wave lines representing earthquake activity
- Central epicenter dot in red
- Clean, minimal design suitable for header display
- Scalable SVG format for crisp display at any size

## Usage in Code

```vue
<template>
  <img :src="logoUrl" alt="Earthquakes App Logo" class="logo" />
</template>

<script setup>
import logoUrl from '../../assets/images/logo.svg'
</script>

<style>
.logo {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1); /* White for dark headers */
}
</style>
```
