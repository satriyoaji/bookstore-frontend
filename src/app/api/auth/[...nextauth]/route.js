// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
// import User from "@/models/User";
// import { signJwtToken } from "@/lib/jwt";
// import bcrypt from 'bcrypt'
// import db from "@/lib/db";
//
// const handler = NextAuth({
//     providers: [
//         CredentialsProvider({
//             type: 'credentials',
//             credentials: {
//                 email: { label: "Email", type: "text", placeholder: "John Doe" },
//                 password: { label: "Password", type: "password" }
//             },
//             async authorize(credentials, req) {
//                 const { email, password } = credentials
//                 console.log("email, pass: ", email, password)
//
//                 await db.connect()
//
//                 const user = await User.findOne({ email })
//
//                 if (!user) {
//                     throw new Error("Invalid input")
//                 }
//
//                 const comparePass = await bcrypt.compare(password, user.password)
//
//                 if (!comparePass) {
//                     throw new Error("Invalid input")
//                 } else {
//                     const { password, ...others } = user._doc
//
//                     const accessToken = signJwtToken(others, { expiresIn: "6d" })
//
//                     return {
//                         ...others,
//                         accessToken
//                     }
//                 }
//             }
//         })
//     ],
//     pages: {
//         signIn: "/login"
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.accessToken = user.accessToken
//                 token._id = user._id
//             }
//
//             return token
//         },
//         async session({ session, token }) {
//             if (token) {
//                 session.user._id = token._id
//                 session.user.accessToken = token.accessToken
//             }
//
//             return session
//         }
//     }
// })
//
// export { handler as GET, handler as POST }

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { signIn } from 'next-auth/client';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Username", type: "username", placeholder: "username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    const { username, password } = credentials;
                    const response = await fetch('http://localhost:8080/auth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password })
                    });

                    console.log("response: ", response.json())
                    console.log("response: ", response.ok)
                    if (!response.ok) {
                        console.log("data error: ", response.json())
                        response.json().catch((errr) => {
                            console.log("errr: ", errr)
                        })
                        throw new Error('Failed to log in');
                    }

                    const data = await response.json();
                    const token = data.token;
                    const user = {
                        id: data.customer.id,
                        username: data.customer.username,
                        name: data.customer.name,
                        // Add any other user data you need from the response
                        // For example: name, role, etc.
                    };
                    console.log("user: ", user)

                    return { token, ...user };
                } catch (error) {
                    console.log("catch: ", error)
                    throw new Error(error.message || 'Failed to log in');
                }
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user })
        {
            console.log("user: ", user)
            if (user) {
                token.token = user.token;
            }

            return token;
        },
        async session({ session, token }) {
            console.log("token: ", token)
            if (token) {
                session.token = token.token;
            }

            return session;
        }
    }
});

export { handler as GET, handler as POST }
