import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { getServerSession } from "next-auth/next";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const { name, email, image } = user;
      const { id, login, bio } = profile || {};

      if (!id) return false; // Prevent sign-in if profile ID is missing

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          _id: id, // Sanity uses `_id`, not `id`
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });
        if (user?._id) {
          token.id = user?._id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

// ✅ Export NextAuth handlers for API routes
export const { handlers, signIn, signOut } = NextAuth(authOptions);

// ✅ Fix: Export `auth` correctly as an async function
export const auth = async () => await getServerSession(authOptions);
