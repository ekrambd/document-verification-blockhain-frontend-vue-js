<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AdminLogin from './AdminLogin.vue';
import Master from './Master.vue';

const route = useRoute();
const layout = computed(() => {

  return route.path.startsWith('/admin/login') ? AdminLogin : Master;
});
</script>

<template>
  <div>
    <component :is="layout || 'router-view'" />
  </div>
</template>

<style scoped>
  /* Add your styles here */
</style>