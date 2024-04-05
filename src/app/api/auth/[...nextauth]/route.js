
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

                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to log in');
                    }

                    const token = data.token;
                    const user = {
                        id: data.customer.id,
                        username: data.customer.username,
                        points: data.customer.points,
                        // Add any other user data you need from the response
                        // For example: name, role, etc.
                    };

                    return { token, ...user };
                } catch (error) {
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
            if (user) {
                token.token = user.token;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.token = token.token;
            }

            return session;
        }
    }
});

export { handler as GET, handler as POST }
