<template>
  <v-app dark>
    <v-navigation-drawer
      :mini-variant="false"
      v-model="isSidebarVisible"
      fixed
      app
      :width="350"
      class="d-flex flex-column justify-space-between"
    >
      <v-toolbar>
        <v-text-field
          hide-details
          prepend-icon="mdi-magnify"
          single-line
        ></v-text-field>
      </v-toolbar>
      <div v-if="isLoading" class="text-center py-12">
        <v-progress-circular indeterminate :size="70" :width="7"></v-progress-circular>
      </div>
      <v-list v-else-if="sops.length">
        <v-list-item
          v-for="(sop, i) in sops"
          :key="i"
          to=""
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="sop.name" />
            <v-list>
              <v-list-item
                v-for="(doc, j) in sop.documents"
                :key="`${sop.name}-doc-${j}`"
                to=""
                router exact
                >
                <v-list-item-title v-text="`(v${doc.version_number}) ${doc.original_file_name}`" class="pl-4" />
              </v-list-item>
            </v-list>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div v-else class="text-center">
        <p class="text-h5 py-16">No SOP's found</p>
      </div>
      <v-list class="flex-1 d-flex flex-column justify-space-around">
        <v-list-item class="mx-auto">
          <v-btn v-if="!isLoggedIn" @click="isLoggingIn = true">Login</v-btn>
        </v-list-item>
        <v-list-item class="mx-auto">
          <v-btn @click="showRegModal = true" v-if="isAdmin" align-center>
            Register User
          </v-btn>
        </v-list-item>
        <v-list-item class="mx-auto">
          <Upload @refresh="updateDocuments" />
        </v-list-item>
        <v-list-item class="mx-auto">

          <v-btn>
            <v-icon large @click="isSidebarVisible = false">mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-btn
      v-if="!isSidebarVisible"
      @click="isSidebarVisible = true"
      fab
      fixed
      bottom
      left
    >

      <v-icon large>
        mdi-chevron-right
      </v-icon>
    </v-btn>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <login-modal v-if="isLoggingIn" v-on:clearLoginModal="isLoggingIn = false"></login-modal>
    <RegisterModal v-if="showRegModal"  v-on:clearRegModal="showRegModal = false" />
    <!-- <footer-bar /> -->
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FooterBar from '@/components/FooterBar.vue';
import LoginModal from '@/components/LoginModal.vue';
import Upload from '@/components/Upload.vue';
import { SOP, Document } from '@/types';
// import { getDocuments } from '@/services/documents';
import { getSOPs } from "~/services/sops";

interface State {
  isSideBarVisible: boolean,
  isLoggedIn: boolean,
  isAdmin: boolean,
  showRegModal: boolean,
  title: String,
  sops: Array<SOP>
};

export default defineComponent({
  name: 'DefaultLayout',
  components: { LoginModal, FooterBar, Upload },
  data() {
    return {
      isSidebarVisible: true,
      isLoggedIn: true, // TODO - change this default to false
      isAdmin: true, //TODO - change this default to false, only change after check with database
      showRegModal: false,
      isLoggingIn: false,
      title: 'Vuetify.js', // TODO - make change with selected document
      sops: [],
      isLoading: true
    }
  },
  methods: {
    updateDocuments() {
      // TODO - loading stuff
      this.isLoading = true;
      getSOPs()
        .then((sops) => {
          this.sops = sops;
        })
        .catch((err) => {
          // TODO - actual error handling here
          console.log('error:', err)
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.updateDocuments();
  }
});
</script>
