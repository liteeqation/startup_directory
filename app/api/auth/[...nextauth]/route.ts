export const dynamic = "force-static";

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

export async function GET() {
  return NextAuth(authOptions);
}

export async function POST() {
  return NextAuth(authOptions);
}
