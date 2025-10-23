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

    // Singleton pattern
    if (!todos) {
        watch(todos, (newTodos) => {
            const data = JSON.stringify(newTodos)
            localStorage.setItem('todos', data)
        }, { deep: true })
    }

    const { user } = useUser()

    const loadTodoListFromLocalStorage = () => {
        const data = localStorage.getItem('todos')
        if (data) {
            // validate data
            todos.value = JSON.parse(data)
        }
    }


    const addTodo = (title: string) => {
        todos.value.push({
            id: uuid(),
            onlineMode: user.value !== null,
            title,
            items: []
        })
    }

    const removeTodo = (id: string) => {
        todos.value = todos.value.filter(todo => todo.id !== id)
    }

    const updateTodoTitle = (id: string, newTitle: string) => {
        const todo = todos.value.find(todo => todo.id === id)
        if (todo) {
            todo.title = newTitle
        }
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

    const syncTodo = async (id: string) => {
        const { todo } = getTodo(id)
        if (todo.onlineMode) {
            return
        }


        const { message } = await $fetch('/api/todos/sync', {
            method: 'POST',
            body: todo
        })
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
    }
}
