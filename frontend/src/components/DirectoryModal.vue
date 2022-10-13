<template>
  <v-overlay :value="isVisible" :z-index="100">
    <v-card v-click-outside="closeModal" class="pa-4 d-" light>
      <v-btn fab small color="grey" @click="closeModal">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
      <v-responsive
        min-width="300px"
        width="40vw"
        max-width="600px"
        class="d-flex flex-column pa-4"
      >
        <v-text-field :id="name" v-model="name" label="Name"></v-text-field>
        <v-btn color="primary" class="float-right" @click="addDirectory"
          >Create Directory</v-btn
        >
      </v-responsive>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Directory } from '../types/index';
import { createDirectories } from '~/services/directories';

export default defineComponent({
  name: 'DirectoryModal',
  data() {
    return {
      name: '',
      errors: [],
      isModalVisible: false,
      isLoading: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit('clearDirModal');
    },

    validatateDirectory() {
      var regex = /^[a-zA-Z0-9-]*$/
      return regex.test(this.name);
    },

    addDirectory() {
      if (!this.name) return;
      if(!this.validatateDirectory()){
        this.errors.push("No Special Characters in Directory Name.");
        console.log("No Special Characters in Directory Name.");
        return;
      }

      this.isLoading = true;
      const newDir: Directory = { name: `${this.name}` };

      createDirectories(newDir)
        .catch((err) => {
          console.log(err);
          // TODO - handle errors properly
        })
        .finally(() => {
          this.isLoading = false;
          this.closeModal();
          this.$emit('refresh');
        });
    },
  },
});
</script>
