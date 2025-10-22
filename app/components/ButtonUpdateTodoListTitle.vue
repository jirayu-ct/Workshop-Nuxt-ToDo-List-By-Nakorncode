<script setup lang="ts">


const { updateTodoTitle } = useTodo()
const open = ref(false)

const props = defineProps<{
    todo: TodoList
}>()

const title = ref(props.todo.title)


const onUpdated = () => {
    updateTodoTitle(props.todo.id, title.value)
    open.value = false
}
</script>

<template>
    <UModal 
        v-model:open="open"
        title="Update Title" 
        :close="{
            color: 'primary',
            variant: 'outline',
            class: 'rounded-full'
        }"
        :ui="{
            content: 'max-w-sm'
        }"
    
    >
        <UButton color="secondary" size="xs">Update Title</UButton>
        <template #body>
            <form @submit.prevent="onUpdated">
                <div class="flex gap-1">
                    <UInput class="w-full" v-model="title" placeholder="Enter a new title"></UInput>
                    <UButton type="submit">Update</UButton>
                </div>
            </form>
        </template>
    </UModal>
</template>