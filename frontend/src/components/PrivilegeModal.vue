<template>
    <v-overlay :z-index="100">
        <v-card class="pa-4" light :key="cardKey">
            <v-btn fab small color="grey" @click="closeModal">
                <v-icon color="white">mdi-close</v-icon>
            </v-btn>
            <v-card-title>User Privileges</v-card-title>
            <v-responsive
            min-width="300px"
            width="40vw"
            max-width="600px"
            class="d-flex flex-column pa-4">
                <v-list style="overflow-y: scroll">
                    <v-list-item v-for="(user) in this.usersList" :key="user">
                        <v-list-item-title>{{ user.name }}
                            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                        </v-list-item-title>
                        <v-switch v-if="user.privilege.data !== undefined && user.privilege.data[0] === 1"
                        v-model="user.privilege.data !== undefined && user.privilege.data[0] === 1"
                        @click="revokeAccess(user)"></v-switch>
                        <v-switch v-else-if="user.privilege.data !== undefined && user.privilege.data[0] === 0"
                        v-model="user.privilege.data !== undefined && user.privilege.data[0] === 1"
                        @click="grantAccess(user)"></v-switch>
                    </v-list-item>
                </v-list>
            </v-responsive>
        </v-card>
    </v-overlay>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue';
import { getUsers, updateUserPriv } from '~/services/users';
import { User } from '@/types/index';

export default defineComponent({
    name: 'PrivilegeModal',
    data(){
        return{
            usersList: [{
                id: Number,
                email: String,
                name: String,
                privilege: [{
                    data: [],
                    type: String
                }],
            }],
            cardKey: 0,
        };
    },
    methods: {
        closeModal(){
            this.$emit('clearPrivModal');
        },
        grabUsers(){
            getUsers()
            .then((value) => {
                this.usersList.pop();
                for(let i = 0; i < value.length; i++){
                    this.usersList.push(value[i]);
                }
                console.log(this.privs);
            })
            .catch((err) => {
                console.log(err);
            })
        },
        grantAccess(user: User){
            updateUserPriv(user.id, user)
            .then(() => {
                this.refresh();
            })
            .catch((err) => {
                console.log(err);
            });
        },
        revokeAccess(user: User){
            updateUserPriv(user.id, user)
            .then(() => {
                this.refresh();
            })
            .catch((err) => {
                console.log(err);
            });
        },
        refresh(){
            this.cardKey += 1;
        },
    },
    mounted() {
        this.grabUsers();
    }
});
</script>