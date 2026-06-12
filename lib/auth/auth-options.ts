import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { getServerSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "../db/prisma";
import { AUTH_ERRORS } from "../errors/auth-errors";



export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  pages: {
    signIn: "/signin",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error(AUTH_ERRORS.MISSING_CREDENTIALS);
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new Error(AUTH_ERRORS.INVALID_EMAIL);
  }

  if (!user.password) {
    throw new Error(AUTH_ERRORS.NO_PASSWORD_ACCOUNT);
  }

  const isValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isValid) {
    throw new Error(AUTH_ERRORS.INVALID_PASSWORD);
  }

  if (!user.emailVerified) {
    throw new Error(AUTH_ERRORS.EMAIL_NOT_VERIFIED);
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  };
}
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },

    async session({ token, session }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        image: token.picture as string,
      };

      return session;
    },
  },
};

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
};