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

        }
        catch (error) {
            console.error("Error fetching current user:", error)
            user.value = null
        }
    }

    const login = async (email: string, password: string) => {
        const { data, error } = await authClient.signIn.email({
            email,
            password
        })

        if (error) {
            throw new Error(error.message || 'Unknown error during login')
        }

        await getCurrentUser()
        return data
    }

    const logout = async () => {
        await authClient.signOut()
        user.value = null
    }

    return {
        user,
        getCurrentUser,
        login,
        logout
    }
}