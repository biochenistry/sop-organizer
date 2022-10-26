<template>
  <div>
    <v-container>
      <v-row align-v="center">
        <v-col cols="1" align="left" align-self="center"
          ><v-icon>mdi-folder-open</v-icon></v-col
        >
        <v-col cols="1" align="left" align-self="center">
          {{ directoryName }}
        </v-col>
        <v-col v-if="isLoggedIn" align="right" align-self="center">
          <v-btn small @click="selectFile(directoryName)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <input
      ref="uploadFile"
      type="file"
      hidden
      @change="rememberFileSelection"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { uploadNew } from '@/services/documents';

export default defineComponent({
  name: 'UploadButton',
  props: {
    directoryName: String,
    isLoggedIn: Boolean,
  },
  data: () => ({
    fileData: undefined,
    sopId: undefined,
    isSelecting: false,
    isLoading: false,
    editorId: undefined,
    selectedDirectoryName: undefined,
  }),
  methods: {
    // Credit: https://ourcodeworld.com/articles/read/1424/how-to-use-a-button-as-a-file-uploader-with-vuetify-in-vuejs
    selectFile(selectedDirectoryName) {
      this.selectedDirectoryName = selectedDirectoryName;
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
      this.fileData = new FormData();
      this.fileData.append('file', event.target.files[0]);
      this.uploadFile();
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
          this.$emit('refresh');
        });
    },
  },
});
</script>
