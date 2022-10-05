<template>
  <v-card v-if="file">
    <v-card-title class="headline"> </v-card-title>
    <v-card-text>
      <div v-html="file"></div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// interface State {
//   fileHtml: HTMLElement;
// }

export default defineComponent({
  name: 'Editor',
  props: {
    file: undefined,
  },
});
</script>
