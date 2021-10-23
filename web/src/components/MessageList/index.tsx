import { useEffect, useState } from "react"
import { api } from "../../services/api"
import { io } from "socket.io-client"
import styles from "./styles.module.scss"
import logoImg from "../../assets/logo.svg"

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const msgQueue: Message[] = [];

const socket = io('https://heat-nlw.herokuapp.com/')

socket.on('new_message', (newMsg: Message) => {
    msgQueue.push(newMsg)
})

export function MessageList() {

    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        setInterval(() => {
            if (msgQueue.length > 0) {
                setMessages(prevState => [
                    msgQueue[0],
                    prevState[0],
                    prevState[1]
                ].filter(Boolean))

                msgQueue.shift()
            }
        }, 3000)
    }, [])

    useEffect(() => {
        api.get<Message[]>('messages/last3').then(res => {
            setMessages(res.data)
        })
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />

            <ul className={styles.messageList}>

                {messages.map(msg => {
                    return (
                        <li key={msg.id} className={styles.message}>
                            <p className={styles.messageContent}>{msg.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={msg.user.avatar_url} alt={msg.user.name} />
                                </div>
                                <span>{msg.user.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}