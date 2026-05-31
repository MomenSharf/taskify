import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { getServerSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getRandomAvatarColor } from "./utils";
import db from "./db/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),

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
          throw new Error("MISSING_CREDENTIALS");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("INVALID_EMAIL");
        }

        if (!user.password) {
          throw new Error("NO_PASSWORD_ACCOUNT");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          throw new Error("INVALID_PASSWORD");
        }

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.emailVerified = token.emailVerified as Date | null;
      }

      return session;
    },

    async jwt({token, user}) {
      const dbUser = await db.user.findUnique({
        where: { email: token.email! },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      const updates: Record<string, string> = {};

      if (!dbUser.name) {
        updates.username = `${dbUser.email.split("@")[0]}-${nanoid(5)}`;
      }

      if (!dbUser.avatarColor) {
        updates.avatarColor = getRandomAvatarColor();
      }

      if (Object.keys(updates).length > 0) {
        await db.user.update({
          where: { id: dbUser.id },
          data: updates,
        });
      }
      
      return token
    }
  },
};


export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
};
