import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Temporarily disable adapter to test if it's causing the issue
  // adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await compare(credentials.password as string, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          collegeName: user.collegeName,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers (Google), extract college name from email domain
      if (account?.provider === "google" && user.email) {
        const emailDomain = user.email.split("@")[1]?.toLowerCase();
        
        if (emailDomain) {
          const collegeName = emailDomain
            .split(".")[0]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          // Update user with collegeName if not set
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser && !existingUser.collegeName) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { collegeName },
            });
          }
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      // On initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.collegeName = (user as any).collegeName;
      }
      
      // Always fetch fresh user data from database to ensure role is up-to-date
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, collegeName: true },
        });
        
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.collegeName = dbUser.collegeName;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).collegeName = token.collegeName;
      }
      return session;
    },
  },
});
