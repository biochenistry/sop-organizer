<template>
  <v-app dark>
    <v-navigation-drawer
      :mini-variant="false"
      v-model="isSidebarVisible"
      fixed
      app
      class="d-flex flex-column justify-space-between"
    >
      <v-toolbar>
        <v-text-field
          hide-details
          prepend-icon="mdi-magnify"
          single-line
        ></v-text-field>
      </v-toolbar>
      <v-list>
        <v-list-item
          v-for="(section, i) in sections"
          :key="i"
          :to="section.to"
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="section.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
          <v-btn v-if="isLoggedIn" align-center>
            Upload
          </v-btn>
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


export default defineComponent({
  name: 'DefaultLayout',
  components: { LoginModal, FooterBar },
  data() {
    return {
      isSidebarVisible: true,
      isLoggedIn: true, // TODO - change this default to false
      isAdmin: true, //TODO - change this default to false, only change after check with database
      showRegModal: false,
      isLoggingIn: false,
      fixed: false,
      //  TODO - change this to dynamically load data from backend 
      sections: [
        {
          title: 'Materials',
          items: ['Stethoscope', 'Dongle', 'Hammer'],
        },
        {
          title: 'Point of Contacts',
          items: [],
        },
        {
          title: 'Measurements',
          items: [],
        },
      ],
      title: 'Vuetify.js',
    }
  },
});
</script>
