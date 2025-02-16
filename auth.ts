import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
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
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // We'll use a provider-aware ID
      let providerId: string | undefined;
      let username: string | undefined;
      let bio: string = "";

      if (account?.provider === "github") {
        // For GitHub, we expect profile.id, login, and bio to be provided.
        providerId = profile?.id;
        username = (profile as any)?.login; // type-cast since profile might not have a strict type
        bio = (profile as any)?.bio || "";
      } else if (account?.provider === "google") {
        // For Google, use profile.sub (the unique user id) and prefix it.
        if (!profile?.sub) return false;
        providerId = `google-${profile.sub}`;
        // Google doesn't return a username or bio.
        username = user.email; // or derive something else if needed
      }

      // If no providerId could be determined, reject sign-in
      if (!providerId) return false;

      // Destructure common fields
      const { name, email, image } = user;

      // Check if a user already exists using our provider-aware id.
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: providerId });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          _id: providerId, // Using our provider-specific id
          name,
          username: username || "",
          email,
          image,
          bio,
        });
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        let providerId: string | undefined;
        if (account.provider === "github") {
          providerId = profile?.id;
        } else if (account.provider === "google") {
          if (!profile?.sub) return token;
          providerId = `google-${profile.sub}`;
        }
        if (providerId) {
          const user = await client
            .withConfig({ useCdn: false })
            .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: providerId });
          if (user?._id) {
            token.id = user._id;
          }
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

// ✅ Export `auth` correctly as an async function
export const auth = async () => await getServerSession(authOptions);
