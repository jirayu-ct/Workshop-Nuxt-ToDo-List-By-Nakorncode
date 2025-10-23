import { v4 as uuid } from "uuid"

export interface TodoListItem {
    id: string;
    title: string;
    done: boolean;
}

export interface TodoList {
    id: string;
    onlineMode: boolean;
    title: string;
    items: TodoListItem[];
}

let todos: Ref<TodoList[]>

export const useTodo = () => {
    todos = useState<TodoList[]>('todos', () => [])

    if (import.meta.client) {
        watch(todos, (newTodos) => {
            const offlineNewTodos = newTodos.filter((todo) => !todo.onlineMode)
            const data = JSON.stringify(offlineNewTodos)
            localStorage.setItem('todos', data)
        }, { deep: true })
    }

    const { start, finish } = useLoadingIndicator()
    const { user } = useUser()

    const loadTodoListFromLocalStorage = () => {
        if (!import.meta.client) {
            return
        }
        const data = localStorage.getItem('todos')
        if (data) {
            // validate date?
            todos.value = JSON.parse(data)
        }
    }

    const loadTodoListFromOnline = async () => {
        start()
        const { data } = await $fetch('/api/todos')
        finish()
        const offlineTodos = todos.value.filter((todo) => !todo.onlineMode)

        if (!user.value) {
            return
        }

        todos.value = data.map((todo) => ({
            id: todo.id,
            title: todo.title,
            onlineMode: true,
            items: todo.items.map((item) => ({
                id: item.id,
                title: item.title,
                done: item.done
            }))
        })).concat(offlineTodos)
    }

    const clearTodoListOnline = () => {
        todos.value = todos.value.filter((todo) => !todo.onlineMode)
    }


    const addTodo = async (title: string) => {
        if (user.value) {
            start()
            const todo = await $fetch('/api/todos/create', {
                method: 'POST',
                body: { title }
            })
            finish()
            todos.value.push({
                ...todo.data,
                onlineMode: true,
                items: []
            })
        } else {
            todos.value.push({
                id: uuid(),
                onlineMode: user.value !== null,
                title,
                items: []
            })
        }
    }

    const removeTodo = async (id: string) => {
        const todo = todos.value.find((todo) => todo.id === id)

        if(!todo) return

        if (user.value && todo.onlineMode) {
            start()
            await $fetch('/api/todos', {
                method: 'DELETE',
                body: { id }
            })
            finish()
        }

    }

    const updateTodoTitle = async (id: string, newTitle: string) => {
        const todo = todos.value.find((todo) => todo.id === id)

        if (!todo) return

        if (user.value && todo.onlineMode) {
            start()
            await $fetch('/api/todos/title', {
                method: 'PATCH',
                body: {
                    id,
                    title: newTitle
                }
            })
            finish()
        }
        todo.title = newTitle
    }

    const getTodo = (id: string) => {
        const todo = todos.value.find(todo => todo.id === id)

        if (!todo) {
            throw new Error('Todo not found')
        }

        const addItem = (itemTitle: string) => {
            todo.items.push({
                id: uuid(),
                title: itemTitle,
                done: false
            })
        }

        const updateItemTitle = (itemId: string, newTitle: string) => {
            const item = todo.items.find(item => item.id === itemId)
            if (item) {
                item.title = newTitle
            }
        }

        const markITemDone = (id: string) => {
            const item = todo.items.find(item => item.id === id)
            if (item) {
                item.done = true
            }
        }

        const markItemUndone = (id: string) => {
            const item = todo.items.find(item => item.id === id)
            if (item) {
                item.done = false
            }
        }

        const removeItem = (itemId: string) => {
            todo.items = todo.items.filter(item => item.id !== itemId)
        }

        return {
            todo,
            addItem,
            updateItemTitle,
            markITemDone,
            markItemUndone,
            removeItem,
        }
    }

    async function syncTodo(id: string) {
        const { todo } = getTodo(id)
        if (todo.onlineMode) {
            return
        }
        start()
        const { message } = await $fetch('/api/todos/sync', {
            method: 'POST',
            body: todo
        })
        finish()
        todo.onlineMode = true
        return { message }
    }

    return {
        todos,
        addTodo,
        updateTodoTitle,
        removeTodo,
        getTodo,
        loadTodoListFromLocalStorage,
        syncTodo,
        loadTodoListFromOnline,
        clearTodoListOnline
    }
}
