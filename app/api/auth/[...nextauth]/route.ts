import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

// Define authOptions with NextAuthOptions type
export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
  ],
  // Add more NextAuth configurations if needed (e.g., callbacks, session, etc.)
};

// NextAuth handler using Next.js API route handler syntax
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
