<template>
  <v-overlay :z-index="100">
    <v-card class="pa-4" light :key="cardKey">
      <v-btn fab small color="grey" @click="closeModal">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>
      <v-card-title>Users</v-card-title>
      <v-responsive
      min-width="300px"
      width="40vw"
      max-width="700px"
      class="d-flex flex-column pa-4">
      <v-row>
        <v-col :cols="8">
          <v-text-field
          :id="email"
          v-model="email"
          hide-details
          single-line
          clearable
          placeholder="Email"
          ></v-text-field>
        </v-col>
        <v-col :col="2">
          <v-btn @click="preregisterUser">Add</v-btn>
        </v-col>
        <v-col :col="2">
          <v-btn @click="deleteUser">Remove</v-btn>
        </v-col>
      </v-row>
      <v-list>
        <v-list-item>
          <v-list-item-title>Name
            <v-list-item-subtitle>Email</v-list-item-subtitle>
          </v-list-item-title>
          <div>Admin?</div>
        </v-list-item>
      </v-list>
      <v-list max-height="500px" style="overflow-y: scroll">
        <v-list-item v-for="(user) in this.usersList" :key="user.id">
          <v-list-item-title>{{ user.name }}
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-title>
          <v-switch v-if="user.privilege.data !== undefined && user.privilege.data[0] === 1"
          v-model="user.privilege.data !== undefined && user.privilege.data[0] === 1"
          @click="revokeAccess(user)"></v-switch>
          <v-switch v-else-if="user.name !== 'Not registered' && user.privilege.data !== undefined && user.privilege.data[0] === 0"
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
import { preregisterUser } from '~/services/auth'; 
import { deleteUser } from '~/services/users'; 
import { User } from '@/types/index';
import { refresh } from 'less';

export default defineComponent({
  name: 'PrivilegeModal',
  data(){
    return{
      usersList: [],
      cardKey: 0,
      email: ""
    };
  },
  methods: {
    closeModal(){
      this.$emit('clearPrivModal');
    },
    grabUsers(){
      this.usersList = [];
      getUsers()
        .then((users) => {
          console.log(users);
          for(let i = 0; i < users.length; i++){
            this.usersList.push(users[i]);
          }
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
    preregisterUser() {
      preregisterUser({email: this.email})
        .then(() => {
          this.grabUsers();
        })
    },
    deleteUser() {
      deleteUser({email: this.email})
        .then(() => {
          this.grabUsers();
        })
    }
  },
  mounted() {
    this.grabUsers();
  }
});
</script>