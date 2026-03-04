import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!valid) return null;

        return { 
          id: user.id, 
          email: user.email, 
          name: user.name ?? user.email,
          image: user.image
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.name  = user.name
        token.email = user.email
        token.image = user.image
      }
      // Handle session update trigger
      if (trigger === "update" && session) {
        token.name = session.name || token.name
        token.image = session.image || token.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name  = (token.name  as string) ?? null
        session.user.email = (token.email as string) ?? null
        session.user.image = (token.image as string) ?? null
      }
      return session
    },
  },
});
