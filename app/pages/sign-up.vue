<script setup lang="ts">
const toast = useToast()

const input = ref({
    name: '',
    email: '',
    password: ''
})

const onSingUp = async () => {
    const { data, error } = await authClient.signUp.email({
        ...input.value
    })

    if(error) {
        toast.add({
            title: error.message || 'Sign Up Failed',
            color: 'error'
        })
        return
    }

    toast.add({
        title: `Sign Up Successful! You can now log in as ${data.user.email}`,
        color: 'success'
    })

    await navigateTo('/login')
}
</script>

<template>
    <div class="max-w-xs mx-auto">
        <h1 class="font-bold  text-2xl mb-4">Sign Up</h1>
        <form @submit.prevent="onSingUp">
            <div class="flex flex-col gap-1">
                <UFormField label="Full Name">
                    <UInput v-model="input.name" name="full_name" class="w-full" placeholder="Full Name" type="text" />
                </UFormField>   

                <UFormField label="Email">
                    <UInput v-model="input.email" name="email" class="w-full" placeholder="Email" type="email" />
                </UFormField>

                <UFormField label="Password">
                    <UInput v-model="input.password" name="password" class="w-full" placeholder="Password" type="password" />
                </UFormField>

                <div class="mt-4">
                    <UButton type="submit" block>Sign Up</UButton>
                </div>
            </div>
        </form>
    </div>
</template>