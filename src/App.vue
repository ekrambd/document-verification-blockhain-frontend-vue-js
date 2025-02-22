<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from './components/admin/AdminLayout.vue';
import FrontendLayout from './components/frontends/Home.vue';

const route = useRoute();

// Dynamically set layout based on route
const layout = computed(() => {
  return route.path.startsWith('/admin') ? AdminLayout : FrontendLayout;
});
</script>

<template>
  <div>
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<style scoped>

</style>  
