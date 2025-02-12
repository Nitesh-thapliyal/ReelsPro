/**
 * Steps: 
 * 1. define auth datatype: next-auth.d.ts
 * 2. create NextAuthOption in our case this current file inside it:
 *  - create providers : which has CrendentialsPRovider: that further has credentials and authorize
 *  - callbacks: jwt: sessions
 *  - pages
 *  - session : strategy: jwt, maxAge
 *  - secret
 * 3. create route [...nextauth] : create handler inside it and export it as get or post
 * 4. create register
 * 5. create middlewware: withAuth: which control which route path are eligible for auth
 */

import User from "@/models/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found!");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Password Invalid!");
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}){
        if(user){
            token.id = user.id
        }
        return token
    },
    async session({session, token}){
        
        if(session.user){
            session.user.id = token.id as string
        }
        
        return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
};
