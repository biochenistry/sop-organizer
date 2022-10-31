<template>
  <v-row justify="center" align="center">
    <v-col>
      <v-card>
        <v-card-title>
          {{ sop.name }}<v-spacer></v-spacer>
          <v-select
            v-model="selectedVersion"
            :items="versions"
            item-text="version_number"
            return-object
            outlined
            @change="onVersionChange($event)"
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn
            v-if="isAdmin && versions.length > 1"
            color="primary"
            small
            @click="isShowingAdminDeleteOverlay = true"
          >
            Delete version<v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle>
          Original filename: {{ document.original_file_name }}
        </v-card-subtitle>
        <v-card-subtitle v-if="deleter" class="font-weight-bold">
          Marked for deletion by user: {{ deleter.name }}
        </v-card-subtitle>

        <editor
          :file="file"
          :document="document"
          @delete-file="isShowingDeleteOverlay = true"
        />

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
                  Are you sure that you want to mark file
                  <strong>{{ document.original_file_name }}</strong> for
                  deletion?
                </span>
                <br />
                <br />
                <span class="text-body-2">
                  An admin must approve your request before the file will be
                  deleted.
                </span>
              </V-card-text>
              <v-card-actions class="justify-space-between">
                <v-btn @click="closeDeleteModal">Cancel</v-btn>
                <v-btn
                  v-if="!isAwaitingDeletionCall"
                  color="primary"
                  @click="markDocForDeletion"
                  >Mark for deletion</v-btn
                >
                <v-progress-circular
                  v-if="isAwaitingDeletionCall"
                  indeterminate
                  :size="40"
                  :width="4"
                  color="primary"
                  class="mr-4"
                ></v-progress-circular>
              </v-card-actions>
            </v-responsive>
          </v-card>
        </v-overlay>

        <v-overlay :value="isShowingAdminDeleteOverlay" :z-index="100">
          <v-card v-click-outside="closeAdminDeleteModal" class="pa-4 d-" light>
            <v-responsive
              min-width="300px"
              width="40vw"
              max-width="600px"
              class="d-flex flex-column pa-4"
            >
              <v-card-title>Deletion Confirmation</v-card-title>
              <V-card-text>
                <span class="text-body-1">
                  Are you sure that you want to delete
                  <strong>{{ document.version_number }}</strong
                  >?
                </span>
              </V-card-text>
              <v-card-actions class="justify-space-between">
                <v-btn @click="closeAdminDeleteModal">Cancel</v-btn>
                <v-btn
                  v-if="!isAwaitingAdminDeletionCall"
                  color="primary"
                  @click="adminDeleteDoc"
                  >Delete</v-btn
                >
                <v-progress-circular
                  v-if="isAwaitingAdminDeletionCall"
                  indeterminate
                  :size="40"
                  :width="4"
                  color="primary"
                  class="mr-4"
                ></v-progress-circular>
              </v-card-actions>
            </v-responsive>
          </v-card>
        </v-overlay>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  getDocument,
  getDocuments,
  markDeleteDocument,
  deleteDocument,
  getDocumentsWithSopId,
} from '~/services/documents';
import { getFile } from '~/services/files';
import { getSOP } from '~/services/sops';
import { getUser } from '~/services/users';

export default {
  name: 'DocumentPage',
  async asyncData({ params, error }) {
    const documentId = params.pathMatch;
    const isAdmin = window.localStorage.getItem('isAdmin');
    let sop, document, file, selectedVersion, versions, deleter;

    try {
      document = await getDocument(documentId);
      sop = await getSOP(document.sop_id);
      file = await getFile(
        `${document.location}${document.version_number}.html`
      );
      if (document.marked_for_deletion_by_user_id) {
        deleter = await getUser(document.marked_for_deletion_by_user_id);
      }
      versions = await getDocumentsWithSopId(sop.id);
      versions.map((doc_version) => {
        doc_version.version_number = 'Version ' + doc_version.version_number;
      });
      selectedVersion = document;
      selectedVersion.version_number =
        'Version ' + selectedVersion.version_number;
    } catch (err) {
      error({
        statusCode: 500,
        message: 'Something went wrong while fetching the document',
        error: err,
      });
    }

    return {
      isAdmin,
      sop,
      documentId,
      document,
      file,
      versions,
      selectedVersion,
      deleter,
    };
  },
  data() {
    return {
      isShowingDeleteOverlay: false,
      isAwaitingDeletionCall: false,
      isShowingAdminDeleteOverlay: false,
      isAwaitingAdminDeletionCall: false,
      versions: [],
      selectedVersion: {},
    };
  },
  head() {
    return {
      title: `${this.sop?.name} - Version ${this.document?.version_number}`,
    };
  },
  methods: {
    closeDeleteModal() {
      this.isShowingDeleteOverlay = false;
    },
    markDocForDeletion() {
      this.isAwaitingDeletionCall = true;
      markDeleteDocument(this.documentId)
        .then(() => {
          this.$nuxt.refresh(); // refresh the component (and the data)
          this.closeDeleteModal();
        })
        .catch((err) => {
          this.error({
            statusCode: 500,
            message:
              'Something went wrong while marking the document for deletion',
            error: err,
          });
        })
        .finally(() => {
          this.isAwaitingDeletionCall = false;
        });
    },
    closeAdminDeleteModal() {
      this.isShowingAdminDeleteOverlay = false;
    },
    async adminDeleteDoc() {
      this.isAwaitingAdminDeletionCall = true;
      deleteDocument(this.documentId)
        .then(async (latestDocument) => {
          this.versions = await getDocumentsWithSopId(this.sop.id);
          this.versions.map((doc_version) => {
            doc_version.version_number =
              'Version ' + doc_version.version_number;
          });
          this.$router.push(`/document/${latestDocument.id}`);
          this.closeAdminDeleteModal();
        })
        .catch((err) => {
          this.error({
            statusCode: 500,
            message: 'Something went wrong while deleting this version.',
            error: err,
          });
        })
        .finally(() => {
          this.isAwaitingAdminDeletionCall = false;
        });
    },
    onVersionChange(event) {
      this.$router.push(`/document/${event.id}`);
    },
  },
};
</script>
