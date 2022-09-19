<template>
  <div>
    <v-btn @click="selectFile">Upload File</v-btn>
    <input ref="uploadFile" type="file" @change="uploadFile" hidden>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: 'upload-button',
  
  methods: {        
    // Credit: https://ourcodeworld.com/articles/read/1424/how-to-use-a-button-as-a-file-uploader-with-vuetify-in-vuejs
    selectFile() {
      this.isSelecting = true;
      window.addEventListener('focus', () => {
        this.isSelecting = false;
      }, { once: true });
      this.$refs.uploadFile.click();
    },
    uploadFile(e) {
      this.selectedFile = e.target.files[0];
      var data = new FormData();
      data.append('file', this.selectedFile);
      data.append('user', 'hubot');

      fetch('http://localhost:2468/upload', {
        method: 'POST',
        body: data
      });
    }
  }
});

</script>