<template>
  <v-row justify="center" align="center">
    <v-col cols="auto">
      <v-card>
        <editor />

        <v-card-text>
          Additional text
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Editor from '@/components/Editor.vue';
export default {
    name: "IndexPage",
    components: { Editor }
}
</script>
