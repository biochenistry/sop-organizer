<template>
    <v-card>
      <v-card-title class="headline" >
      </v-card-title>
      <v-card-text>
        <div v-html="fileHtml"></div>
      </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface State {
  fileHtml: HTMLElement,
}

export default defineComponent({
    name: 'editor',
    data() {
      return {
        fileHtml: null
      }
    },
    mounted() {
      this.$nuxt.$on('fileHtml', data => {
        console.log(data);
        this.fileHtml = data; 
      })
    }
});

</script>