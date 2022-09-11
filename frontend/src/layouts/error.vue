<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/"> Home page </NuxtLink>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface State {
  pageNotFound?: String,
  otherError?: String
}

export default defineComponent({
  name: 'ErrorLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data(): State {
    return {
      pageNotFound: 'Page Not Found',
      otherError: 'An error occurred',
    }
  },
  head(): Object {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return { title }
  },
});
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
