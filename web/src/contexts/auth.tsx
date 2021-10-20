import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
}

type AuthRes = {
    token: string;
    user: User;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData)

type AuthProvider = {
    children: ReactNode;
}

export function AuthProvider(props: AuthProvider) {
    
    const [user, setUser] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?client_id=c35454ddc43a04d09ebc`

    async function signIn(code: string) {
        const res = await api.post<AuthRes>('auth', { code })

        const { token, user } = res.data

        localStorage.setItem('@dowhile:token', token)
        api.defaults.headers.common.authorization = `Bearer ${token}`

        setUser(user)
    }

    function signOut() {
        setUser(null)
        localStorage.removeItem('@dowhile:token')
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`

            api.get<User>('profile').then(res => {
                setUser(res.data)
            })
        }

    }, [])

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=')

        if (hasGithubCode) {
            const  [cleanUrl, githubCode] = url.split('?code=')
            // console.log(githubCode)
            window.history.pushState({}, '', cleanUrl)

            signIn(githubCode)
        }
    }, [])
    
    return (
        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}