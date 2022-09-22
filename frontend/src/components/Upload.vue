<template>
  <div>
    <v-btn @click="selectFile">Upload File</v-btn>
    <input ref="uploadFile" type="file" @change="rememberFileSelection" hidden>
    <v-overlay :value="isOverlayVisible">
      <v-progress-circular v-if="isLoading" indeterminate :size="70" :width="7"></v-progress-circular>
      <v-card v-else class="pa-4">
        <v-text-field v-model="editorId" type="number" label="User ID"></v-text-field>
        <v-text-field v-model="sopId" type="number" label="SOP ID"></v-text-field>
        <v-btn color="primary" @click="uploadFile">Continue</v-btn>
      </v-card>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { uploadDocument } from '@/services/documents';

export default defineComponent({
  name: 'upload-button',
  data: () => ({
    isOverlayVisible: false,
    fileData: undefined,
    sopId: undefined,
    selectedFile: undefined,
    isSelecting: false,
    isLoading: false,
    editorId: undefined,
  }),
  methods: {
    // Credit: https://ourcodeworld.com/articles/read/1424/how-to-use-a-button-as-a-file-uploader-with-vuetify-in-vuejs
    selectFile() {
      this.isSelecting = true;
      window.addEventListener('focus', () => {
        this.isSelecting = false;
      }, { once: true });
      this.$refs.uploadFile.click();
    },
    rememberFileSelection(event) {
      this.selectedFile = event.target.files[0];

      this.fileData = new FormData();
      this.fileData.append('file', this.selectedFile);
      this.isOverlayVisible = true;
    },
    uploadFile() {
      if (!this.sopId || !this.editorId) return;
      
      this.fileData.append('sop_id', this.sopId);
      this.fileData.append('editor_id', this.editorId);

      this.isLoading = true;

      uploadDocument(this.fileData)
      .catch((err) => {
        console.log(err);
        // TODO - handle errors properly
      })
      .finally(() => {
        
        this.isLoading = false;
        this.isOverlayVisible = false;
        this.$emit('refresh');
      });
    }
  }
});

</script>