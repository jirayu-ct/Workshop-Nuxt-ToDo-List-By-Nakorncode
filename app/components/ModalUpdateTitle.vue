<script setup lang="ts">


const { updateTodoTitle } = useTodo()
const open = ref(false)


const emit = defineEmits<{
    'update': [newTitle: string]
}>()

const props = defineProps<{
    headerTitle: string,
    previosTitle: string,
    placeholder: string
}>()

const title = ref(props.previosTitle)


const onUpdated = () => {
    emit('update', title.value)
    open.value = false
}
</script>

<template>
    <UModal 
        v-model:open="open"
        :title="headerTitle" 
        :close="{
            color: 'primary',
            variant: 'outline',
            class: 'rounded-full'
        }"
        :ui="{
            content: 'max-w-sm'
        }"
    
    >
        <slot />
        <template #body>
            <form @submit.prevent="onUpdated">
                <div class="flex gap-1">
                    <UInput class="w-full" v-model="title" :placeholder="props.placeholder"></UInput>
                    <UButton type="submit">Update</UButton>
                </div>
            </form>
        </template>
    </UModal>
</template>