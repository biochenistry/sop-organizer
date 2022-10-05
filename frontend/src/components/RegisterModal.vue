<template>
  <v-overlay :value="isVisible" :z-index="100">
    <v-card v-click-outside="closeModal" class="pa-4 d-" light>
      <v-btn fab small color="grey" @click="closeModal">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
      <v-responsive
        min-width="300px"
        width="40vw"
        max-width="600px"
        class="d-flex flex-column pa-4"
      >
        <v-text-field :id="email" v-model="email" label="Email"></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
        ></v-text-field>
        <v-text-field
          v-model="cpassword"
          label="Confirm Password"
          type="password"
        ></v-text-field>
        <v-btn color="primary" class="float-right" @click="checkPasswords()"
          >Register</v-btn
        >
      </v-responsive>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RegisterModal',
  data() {
    return {
      email: '',
      password: '',
      cpassword: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('clearRegModal');
    },
    checkPasswords() {
      // TODO - implement this
      // console.log(this.email);
      // console.log(this.password);
      // console.log(this.cpassword);
      // console.log(this.password === this.cpassword);
    },

    // sendRegisterData
    // Will use checkPasswords and won't run unless it returns true
  },
});
</script>
