<template>
    <v-overlay :value="isVisible">
        <v-card class="pa-4" v-click-outside="emitCloseModal">
            <v-text-field :id="email" v-model="email" label="Email"></v-text-field>
            <v-text-field v-model="password" label="Password" type="password"></v-text-field>
            <v-text-field v-model="cpassword" label="Confirm Password" type="password"></v-text-field>
            <v-btn color="primary" @click="checkPasswords()">Register</v-btn>
        </v-card>
    </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'register-modal',
    data(){
        return{
            email: '',
            password: '',
            cpassword: '',
        }
    },
    methods: {
        emitCloseModal() {
            this.$emit('clearRegModal');
        },
        checkPasswords() {
            console.log(this.email);
            console.log(this.password);
            console.log(this.cpassword);
            console.log(this.password == this.cpassword);
        },    

        //sendRegisterData
        //Will use checkPasswords and won't run unless it returns true
    }
});

</script>