<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title>
          {{ sop.name }}<v-spacer></v-spacer>Version
          {{ document.version_number }}
        </v-card-title>
        <v-card-subtitle>
          Original filename: {{ document.original_file_name }}
        </v-card-subtitle>
        <v-card-subtitle v-if="document.marked_for_deletion_by_user_id" class="font-weight-bold">
          Marked for deletion by user: {{ document.marked_for_deletion_by_user_id }}
        </v-card-subtitle>

        <editor :file="file" @delete-file="isShowingDeleteOverlay = true" />

        <v-overlay :value="isShowingDeleteOverlay" :z-index="100">
          <v-card v-click-outside="closeDeleteModal" class="pa-4 d-" light>
            <v-responsive
              min-width="300px"
              width="40vw"
              max-width="600px"
              class="d-flex flex-column pa-4"
            >
              <v-card-title>Deletion Confirmation</v-card-title>
              <V-card-text>
                <span class="text-body-1">
                  Are you sure that you want to mark file <strong>{{document.original_file_name}}</strong> for deletion?
                </span>
                <br />
                <br />
                <span class="text-body-2">
                  An admin must approve your request before the file will be deleted.
                </span>
              </V-card-text>
              <v-card-actions class="justify-space-between">
                <v-btn @click="closeDeleteModal">Cancel</v-btn>
                <v-btn color="primary" @click="markDocForDeletion">Mark for deletion</v-btn>
              </v-card-actions>
            </v-responsive>
          </v-card>
        </v-overlay>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { getDocument, markDeleteDocument } from '~/services/documents';
import { getFile } from '~/services/files';
import { getSOP } from '~/services/sops';

export default {
  name: 'DocumentPage',
  data() {
    return {
      isShowingDeleteOverlay: false,
    }
  },
  async asyncData({ params, error }) {
    const documentId = params.pathMatch;
    let sop, document, file;

    try {
      document = await getDocument(documentId);
      sop = await getSOP(document.sop_id);
      file = await getFile(document.location);
    } catch (err) {
      error({
        statusCode: 500,
        message: 'Something went wrong while fetching the document',
        error: err,
      });
    }

    return {
      sop,
      documentId,
      document,
      file,
    };
  },
  methods: {
    closeDeleteModal() {
      this.isShowingDeleteOverlay = false;
    },
    markDocForDeletion() {
      markDeleteDocument(this.documentId)
      .then(() => {
        this.$nuxt.refresh(); // refresh the component (and the data)
      })
      .catch((err) => {
        this.error({
          statusCode: 500,
          message: 'Something went wrong while marking the document for deletion',
          error: err,
        });
      })
    }
  },
  head() {
    return {
      title: `${this.sop?.name} - Version ${this.document?.version_number}`,
    };
  },
};
</script>
