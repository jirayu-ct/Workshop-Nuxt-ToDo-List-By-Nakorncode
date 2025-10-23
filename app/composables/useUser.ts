import type { User } from "better-auth"

export const useUser = () => {
    const user = useState<User | null>('user', () => null)

    const getCurrentUser = async () => {
        try {
            const session = await authClient.getSession({
                fetchOptions: {
                    headers: useRequestHeaders(['cookie'])
                }
            })
            if (session.error || !session.data) {
                user.value = null
                return
            }
            user.value = session.data.user
        } catch (error) {
            console.error(error)
            user.value = null
        }
    }

    const login = async (email: string, password: string) => {
        const { loadTodoListFromOnline } = useTodo()
        const { data, error } = await authClient.signIn.email({
            email,
            password
        })

        if (error) {
            throw new Error(error.message || 'Unknown error during login')
        }

        await getCurrentUser()
        await loadTodoListFromOnline()
        return data
    }

    const logout = async () => {
        const { clearTodoListOnline } = useTodo()

        user.value = null
        await authClient.signOut()
        clearTodoListOnline()
    }

    return {
        user,
        getCurrentUser,
        login,
        logout
    }
}