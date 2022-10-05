<template>
  <v-overlay :value="isVisible">
    <v-card v-click-outside="emitCloseModal" class="pa-4">
      <v-text-field v-model="email" label="Email"></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
      ></v-text-field>
      <v-btn color="primary" @click="checkData()">Login</v-btn>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginModal',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    emitCloseModal() {
      this.$emit('clearLoginModal');
    },

    checkData() {
      console.log(this.email);
      console.log(this.password);
    },

    // sendLoginData
    // Checks with database whether or not user exists.
  },
});
</script>
