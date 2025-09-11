// eslint-disable @typescript-eslint/no-explicit-any 
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios";
import { error } from "console";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "username", type: "text", placeholder: "user" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                try {

                    console.log("username=", credentials.username)
                    const user = await axios.post(`http://localhost:5000/api/v1/user/signin`, {
                        username: credentials.username,
                        password: credentials.password
                    });
                    console.log("user=", user)

                    if (!user.data.token) {
                        throw new Error("Invalid Credentials");
                    }

                    console.log("final=", user.data)

                    return {
                        id: user.data.id,
                        // email: user.data.email,
                        // name: user.data.name,
                        token: user.data.token,
                        username: user.data.username
                    }

                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
        maxAge: 5 * 60, //
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            console.log("user=", user)
            console.log("token=", token)
            if (user) {
                token.id = (user.id);
                token.username = user.username;
                // token.email = user.email;
                token.token = user.token;
            };
            console.log("token again", token)
            console.log(process.env.NEXTAUTH_SECRET)
            return token;
        },
        session: async ({ session, token }) => {
            console.log("session callback → token=", token);

            session.user = {
                id: token.id as string,
                username: token.username as string,
                token: token.token as string,
            };

            console.log("session=", session)
            return session;
        },
    },
    pages: {
        signIn: "/signin"
    }
}
