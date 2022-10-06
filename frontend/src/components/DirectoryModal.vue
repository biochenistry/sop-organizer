<template>
    <v-overlay :value="isVisible">
        <v-card class="pa-4" v-click-outside="emitCloseModal">
            <v-text-field v-model="name" label="Name of Directory"></v-text-field>
            <v-btn color="primary" @click="checkData()">Create Directory</v-btn>
        </v-card>
    </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'directory-modal',
    data(){
        return{
            name: '',
            isModalVisible : false,
        }
    },
    methods: {
        emitCloseModal() {
            this.$emit('clearDirModal');
        },

        checkData() {
            console.log(this.name);
        }

        //sendLoginData
        //Checks with database whether or not user exists.
    }
});

</script>
