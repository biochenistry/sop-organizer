<template>
  <div>
    <v-container>
      <v-row align-v="center">
        <v-col cols=1 align="left" align-self="center">📁</v-col>
        <v-col cols=1 align="left" align-self="center" > {{directoryName}} </v-col>
        <v-col align="right" align-self="center">
          <v-btn small @click="selectFile(directoryName)">+</v-btn>
        </v-col>
      </v-row>
      
    </v-container>
    <input
      ref="uploadFile"
      type="file"
      hidden
      @change="rememberFileSelection"
    />
    <v-overlay :value="isOverlayVisible">
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        :size="70"
        :width="7"
      ></v-progress-circular>
      <v-card v-else class="pa-4">
        <v-text-field
          v-model="editorId"
          type="number"
          label="User ID"
        ></v-text-field>
        <v-text-field
          v-model="sopId"
          type="number"
          label="SOP ID"
        ></v-text-field>
        <v-btn color="primary" @click="uploadFile">Continue</v-btn>
      </v-card>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { uploadNew } from '@/services/documents';

export default defineComponent({
  name: 'UploadButton',
  props: {
    directoryName: String
  },
  data: () => ({
    isOverlayVisible: false,
    fileData: undefined,
    sopId: undefined,
    selectedFile: undefined,
    isSelecting: false,
    isLoading: false,
    editorId: undefined,
    selectedDirectoryName: undefined
  }),
  methods: {
    // Credit: https://ourcodeworld.com/articles/read/1424/how-to-use-a-button-as-a-file-uploader-with-vuetify-in-vuejs
    selectFile(selectedDirectoryName) {
      this.selectedDirectoryName = selectedDirectoryName;
      console.log(selectedDirectoryName);
      this.isSelecting = true;
      window.addEventListener(
        'focus',
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );
      this.$refs.uploadFile.click();
    },
    rememberFileSelection(event) {
      this.selectedFile = event.target.files[0];

      this.fileData = new FormData();
      this.fileData.append('file', this.selectedFile);
      this.isOverlayVisible = true;
    },
    uploadFile() {
      this.fileData.append('directory_name', this.selectedDirectoryName);
      this.fileData.append('editor_id', 1); // placeholder for now 

      this.isLoading = true;

      uploadNew(this.fileData)
        .catch((err) => {
          console.log(err);
          // TODO - handle errors properly
        })
        .finally(() => {
          this.isLoading = false;
          this.isOverlayVisible = false;
          this.$emit('refresh');
        });
    },
  },
});
</script>
