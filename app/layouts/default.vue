<script setup lang="ts">

const {user, logout} = useUser()
const toast = useToast()

const onLogout = async () => {
    await logout()
    toast.add({
        title: 'Logout Successful',
        color: 'success'
    })
    await navigateTo('/')
}
</script>

<template>
    <div class="p-3 text-gray-700">
        <nav>
            <div class="max-w-md mx-auto bg-gray-100 p-2 rounded-lg mb-4 showdow-lg">
                <ul class="flex items-center gap-2">
                    <li><nuxt-link to="/" class="font-bold text-lg text-blue-600 underline">Todo List</nuxt-link></li>
                    
                    <template v-if="!user">
                        <li class="ml-auto"><nuxt-link to="/login" class="text-blue underline">Login</nuxt-link></li>
                        <li><nuxt-link to="/sign-up" class="text-white bg-blue-600 px-2 py-1 rounded-md hover:bg-blue-800">Sign Up</nuxt-link></li>
                    </template>

                    <template v-else>
                        <li class="ml-auto"><span>{{ user.email }}</span></li>
                        <li><u-button @click="logout">Logout</u-button></li>
                    </template>
                </ul>
            </div>
        </nav>
        <main class="mt-4">
            <div class="max-w-md mx-auto bg-white p-4">
                <slot></slot>
            </div>
        </main>
    </div>
</template>