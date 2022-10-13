<template>
  <v-app :style="{ background: $vuetify.theme.themes.light.background }">
    <v-navigation-drawer
      v-model="isSidebarVisible"
      :mini-variant="false"
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
        <v-progress-circular
          indeterminate
          color="secondary"
          :size="70"
          :width="7"
        ></v-progress-circular>
      </div>
      <v-list v-else-if="directories.length">
        <v-list-item v-for="(directory, i) in directories" :key="i" to="" router exact>
          <v-list-item-content>
            <Upload :directory-name=directory.name :is-logged-in="isLoggedIn" @refresh="updateDocuments" />
            <v-list>
              <v-list-item
                v-for="(sop, j) in directory.sops"
                :key="`${directory}-${sop.name}-${j}`"
                :to="`/document/${sop.latest_version_document_id}`"
                router  
                exact
              >
                <v-list-item-title
                  class="pl-4"
                  style="max-width: 100%; text-overflow: ellipsis"
                >
                <v-icon>mdi-file-document</v-icon> {{sop.name}}
                </v-list-item-title>
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
          <div v-else class="text-center">
            <p>Logged in as {{ username }}</p>
            <v-btn @click="logout">Logout</v-btn>
          </div>
        </v-list-item>
        <v-list-item v-if="!isLoggedIn" class="mx-auto">
          <v-btn v-if="isAdmin" align-center @click="showRegModal = true">
            Register User
          </v-btn>
        </v-list-item>
        <v-list-item v-if="isLoggedIn && isAdmin" class="mx-auto">
          <v-btn @click="showDirModal = true" align-center>
            Create Directory
          </v-btn>        
        </v-list-item>
        <v-list-item class="mx-auto">

          <v-btn>
            <v-icon large @click="isSidebarVisible = false"
              >mdi-chevron-left</v-icon
            >
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-btn
      v-if="!isSidebarVisible"
      fab
      fixed
      bottom
      left
      @click="isSidebarVisible = true"
    >
      <v-icon large> mdi-chevron-right </v-icon>
    </v-btn>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <login-modal
      v-if="isLoggingIn"
      @clearLoginModal="isLoggingIn = false"
      @authenticationChange="checkAuthentication"
    ></login-modal>
    <RegisterModal v-if="showRegModal" @clearRegModal="showRegModal = false" />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginModal from '@/components/LoginModal.vue';
import RegisterModal from '@/components/RegisterModal.vue';
import CreateDirModal from "@/components/DirectoryModal.vue";
import Upload from '@/components/Upload.vue';
import { SOP, Directory } from '@/types';
// import { getDocuments } from '@/services/documents';
import { getSOP } from '~/services/sops';
import { getSops } from '~/services/directories';
import { getDirectories } from '~/services/directories';

interface State {
  isSideBarVisible: boolean,
  isLoggedIn: boolean,
  isAdmin: boolean,
  username?: String,
  showRegModal: boolean,
  showDirModal: boolean,
  title: String,
  sops: Array<SOP>
  directories: Array<Directory>
};

export default defineComponent({
  name: 'DefaultLayout',
  components: { LoginModal, RegisterModal, CreateDirModal, Upload },
  data() {
    return {
      isSidebarVisible: true,
      isLoggedIn: false,
      isAdmin: true, // TODO - change this default to false, only change after check with database
      showRegModal: false,
      isLoggingIn: false,
      showDirModal: false,
      sops: [],
      isLoading: true,
      directories: []
    };
  },
  mounted() {
    this.updateDocuments();
    this.checkAuthentication();
  },
  methods: {
    updateDocuments() {
      // TODO - loading stuff
      this.isLoading = true;
      getDirectories()
        .then((directories) => {
          directories.forEach( (directory, index) => {
            directory['sops'] = [];
            getSops(directory['id'])
              .then((sops) => {
                  sops.forEach( (sop, sopIndex) => {
                    getSOP(sop.sop_id)
                      .then((sop) => {
                        directory['sops'].push(sop);
                        this.directories = directories;
                      })
                  })
              })
              .catch((err) => { 
                console.log('Directory has no SOPs.'); 
                this.directories = directories;
              })
              .finally(() => {     
                this.isLoading = false;
              });
          });
        });
    },
    checkAuthentication() {
      if (window.localStorage.getItem('accessToken')) {
        this.username = window.localStorage.getItem('username');
        this.isLoggedIn = true;
        this.isLoggingIn = false;
      }
    },
    logout() {
      window.localStorage.clear();
      this.isLoggedIn = false;
    }
  },
});
</script>

<style>
.v-list {
  width: 100%;
}
</style>
