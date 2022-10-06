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

        <editor :file="file" />

      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { getDocument } from '~/services/documents';
import { getFile } from '~/services/files';
import { getSOP } from '~/services/sops';

export default {
  name: 'DocumentPage',
  async asyncData({ params, error }) {
    const documentId = params.pathMatch;
    let sop, document, file;

    try {
      document = await getDocument(documentId);
      sop = await getSOP(document.sop_id);
      file = await getFile(document.location);
    } catch (e) {
      error({
        statusCode: 500,
        message: 'Something went wrong while fetching the document',
        error: e,
      });
    }

    return {
      sop,
      document,
      file,
    };
  },
  head() {
    return {
      title: `${this.sop?.name} - Version ${this.document?.version_number}`,
    };
  },
};
</script>
