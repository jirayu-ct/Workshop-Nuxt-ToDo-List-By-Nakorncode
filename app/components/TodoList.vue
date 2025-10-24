<script setup lang="ts">


const { todos, updateTodoTitle, removeTodo, syncTodo } = useTodo()
const { user } = useUser()
const syncBtnLoading = ref(false)
const toast = useToast()

const onTodoTitleUpdated = (id: string, newTitle: string) => {
    updateTodoTitle(id, newTitle)
}

const onDeleteConfirmed = (id: string) => {
    removeTodo(id)
}

const onSyncTodo = async (id: string) => {
    syncBtnLoading.value = true

    try {
        const res = await syncTodo(id)
        console.log('Sync Result:', res)
        if (res) {
            toast.add({
                title: res.message || 'Sync Successful',
                color: 'success'
            })
        }
    } catch (error) {
        console.error('Failed to sync todo:', error)
        toast.add({
            title: 'Sync Failed',
            color: 'error'
        })
    }
    syncBtnLoading.value = false
}

</script>

<template>
    <ClientOnly>
        <div>
            <ul v-if="todos.length > 0" class="flex flex-col gap-6">
                <li v-for="todo in todos" :key="todo.id" class="border border-gray-300 p-2 rounded-md">
                    <header class="flex justify-between">
                        <span class="font-bold">{{ todo.title }}</span>

                        <div class="flex items-center gap-0.5 ">
                            <div class="text-xs mr-1">
                                <span>Mode: </span>
                                <span
                                    :class="{ 'text-green-600': todo.onlineMode, 'text-red-500': !todo.onlineMode }">{{
                                        todo.onlineMode ? 'Onlien' : 'Offline' }}</span>
                            </div>

                            <UButton 
                                v-if="!todo.onlineMode && user" size="xs" color="secondary"
                                :loading="syncBtnLoading" 
                                @click="onSyncTodo(todo.id)"
                            >Sync Now</UButton>

                            <ModalUpdateTitle 
                                header-title="Update Todo List Title" :previos-title="todo.title"
                                placeholder="Enter a new title" 
                                @update="onTodoTitleUpdated(todo.id, $event)"
                            >
                                <UButton color="secondary" size="xs">Update Title</UButton>
                            </ModalUpdateTitle>


                            <ModalConfirm 
                                title="Ary you sure you want to delete this todo list?"
                                :description="`Todo: ${todo.title}`" confirm-color="error"
                                @confirmed="onDeleteConfirmed(todo.id)"
                            >
                                <UButton color="error" size="xs">Delete</UButton>
                            </ModalConfirm>
                        </div>
                    </header>

                    <main class="mt-4">
                        <TodoListItem :todo="todo" />
                        <div class="mt-4">
                            <FormCreateTodoListItem :todo-id="todo.id" />
                        </div>

                    </main>
                </li>
            </ul>

            <p v-else class="italic text-gray-500">No Todo Found</p>

            <div class="bg-gray-100 p-4 rounded mt-6">
                <h2 class="font-bold text-lg mb-2">Create Todo List</h2>
                <FormCreateTodoList />
            </div>

            <DevOnly>
                <pre>{{ todos }}</pre>
            </DevOnly>
        </div>
    </ClientOnly>
</template>