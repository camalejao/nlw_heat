import axios from "axios";
import prismaClient from "../prisma"
import { sign } from "jsonwebtoken";

interface IAccessTokenResponse {
    access_token: string
}

interface IUserResponse {
    id: number,
    avatar_url: string,
    login: string,
    name: string
}

class UserAuthService {
    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token";

        const { data: accessTokenRes } = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            headers: {
                "Accept": "application/json"
            }
        });

        const { data: userRes } = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: `Bearer ${accessTokenRes.access_token}`,
            }
        });

        let user = await prismaClient.user.findFirst({
            where: {
                github_id: userRes.id
            }
        });

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    github_id: userRes.id,
                    login: userRes.login,
                    avatar_url: userRes.avatar_url,
                    name: userRes.name
                }
            });
        }

        const token = sign({
            user: {
                name: user.name,
                avatar_url: user.avatar_url,
                id: user.id
            }
        },
        process.env.JWT_TOKEN_NLW, // era pra ser SECRET mas preguiça de mudar agora
        {
            subject: user.id,
            expiresIn: "1d"
        }
        );

        return { token, user };
    }
};

export { UserAuthService };