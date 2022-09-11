<template>
    <v-overlay :value="isVisible">
        <v-card class="pa-4" v-click-outside="emitCloseModal">
            <v-text-field label="Username"></v-text-field>
            <v-text-field label="Password" type="password"></v-text-field>
            <v-btn color="primary">Login</v-btn>
        </v-card>
    </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'login-modal',
    methods: {
        emitCloseModal() {
            this.$emit('clearLoginModal');
        }
    }
});

</script>
