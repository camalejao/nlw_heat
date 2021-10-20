import { useContext, useState, FormEvent } from "react"
import { VscGithubInverted, VscSignOut } from "react-icons/vsc"
import { AuthContext } from "../../contexts/auth"
import { api } from "../../services/api"
import styles from "./styles.module.scss"

export function MessageForm() {

    const { user, signOut } = useContext(AuthContext)
    const [message, setMessage] = useState('')

    async function sendMsg(event: FormEvent) {
        event.preventDefault()

        if (!message.trim()) {
            return
        }

       await api.post('messages', { text: message })

       setMessage('')
    }

    return (
        <div className={styles.messageFormWrapper}>
            <button onClick={signOut} className={styles.signOutButton}>
                <VscSignOut size="32" />
            </button>

            <header className={styles.userInfo}>
                <div className={styles.userImg}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size="16" />
                    {user?.login}
                </span>
            </header>

            <form onSubmit={sendMsg} className={styles.messageForm}>
                <label htmlFor="message">Mensagem</label>
                
                <textarea
                    name="message"
                    id="message"
                    placeholder="Qual sua expectativa para o evento?"
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                />
                
                <button type="submit">Enviar Mensagem</button>
            </form>
        </div>
    )
}