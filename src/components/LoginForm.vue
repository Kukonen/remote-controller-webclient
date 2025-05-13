<template>
    <div class="flex justify-content-center">
        <form @submit.prevent="submitForm">
            <InputText v-model="name" placeholder="Enter your name" :class="{'p-invalid':$v.$error}" />
            <div v-if="$v.$error" class="p-error">Name is required.</div>
            <div v-if="$v.$error" class="p-error">Name must be at least 3 characters.</div>
            <Button type="submit" class="p-button p-button-primary">Submit</Button>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

const name = ref('')
const rules =computed(() => (
    {
        name: {
            required,
            minLength: minLength(3),
        },
    }
));

const $v = useVuelidate(rules, { name });
console.log($v);
const submitForm = () => {
    const result = $v.value.$validate();
    result.then((res) => {
        if(res) {
            alert('Form submitted.');
        }
    }).catch((err) => {
        console.log(err);
    })

};
</script>