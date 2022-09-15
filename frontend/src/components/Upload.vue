<template>
    <input type="file" @change="onChange($event)">
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'upload-button',
    
    methods: {        
        onChange($event: Event) {
            const target = $event.target as HTMLInputElement;
            if (target && target.files) {
                var data = new FormData()
                data.append('file', target.files[0])
                data.append('user', 'hubot')

                fetch('http://localhost:2468/upload', {
                    method: 'POST',
                    body: data
                })
            }
        },
    }
});

</script>