<template>
    <v-card v-if="file">
      <v-card-title class="headline justify-space-between" >
        <v-btn color="primary" @click="this.selectFile">Upload new version</v-btn>
        <input
          ref="uploadNew"
          type="file"
          hidden
          @change="this.rememberFileSelection"
        />
      </v-card-title>
      <v-card-title class="headline justify-space-between" >
        <v-btn color="primary" @click="this.editFile">{{editingFile ? "Cancel" : "Edit"}}</v-btn>
        <v-btn v-if="!editingFile" @click="this.emitDeletion" :disabled="Boolean(document.marked_for_deletion_by_user_id)" fab color="secondary" small>
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
        <v-btn color="primary" v-if="editingFile" @click="this.editFile">Save</v-btn>
      </v-card-title>
      <v-card-text :class="{ hide: (file == null || !editingFile) }">
        <div ref="quillEditor"></div>
      </v-card-text>
      <v-card-text :class="{ hide: (file == null || editingFile) }">
        <div ref="quillViewer"></div>
      </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { updateExisting } from "~/services/documents";

export default defineComponent({
    name: 'Editor',
    props: {
      file: undefined,
      document: undefined,
    },
    data() {
      return {
        editingFile: false,
        isShowingDeleteOverlay: false,
        selectedFile: undefined,
        fileData: undefined,
        isSelecting: false,
        toolbarOptions: [
          [{ 'font': [] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          [{ 'align': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['blockquote', 'code-block'],
          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          ['clean']                                         // remove formatting button
        ]
      }
    },
    methods: {
        editFile() {
          this.editingFile = !this.editingFile;
          if(this.editingFile === false) {
            this.quillViewer.setContents(this.quillEditor.getContents());
          }
        },
        saveFile() {
          
        },
        emitDeletion() {
          this.$emit('delete-file');
        },

        selectFile() {
          this.isSelecting = true;
          window.addEventListener(
            'focus',
            () => {
              this.isSelecting = false;
            },
            { once: true }
          );
          this.$refs.uploadNew.click();
        },
        rememberFileSelection(event) {
          this.selectedFile = event.target.files[0];
          this.fileData = new FormData();
          this.fileData.append('file', this.selectedFile);
          this.uploadNew();
        },
        uploadNew() {
          this.fileData.append('sop_id', this.document['sop_id']);
          this.fileData.append('editor_id', 1);
          this.fileData.append('directory_name', this.document.location.split('/')[0])
          updateExisting(this.fileData)
            .catch((err) => {
              console.log(err);
              // TODO - handle errors properly
            })
            .finally(() => {
              this.$emit('refresh');
            });
        },

    },
    mounted() {
      if(this.file) {
        this.quillEditor = new Quill(this.$refs.quillEditor, {
          modules: {
            toolbar: this.toolbarOptions
          },
          readOnly: false,
          theme: "snow"
        })

        this.quillViewer = new Quill(this.$refs.quillViewer, {
          modules: {
            toolbar: false
          },
          readOnly: true,
          theme: "snow"
        })
          this.quillEditor.setContents( this.quillEditor.clipboard.convert(this.file), 'silent');
          this.quillViewer.setContents( this.quillViewer.clipboard.convert(this.file), 'silent');
      }
    }
});
</script>

<style>
.hide {
  display: none !important;
}
</style>
