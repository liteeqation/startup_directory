export const dynamic = "force-static";

import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

// Define NextAuth options directly inside the handler
export async function GET() {
  return NextAuth({
    providers: [
      GitHubProvider({
        clientId: process.env.AUTH_GITHUB_ID as string,
        clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      }),
    ],
    // You can also add other configurations like callbacks, session, etc.
  });
}

export async function POST() {
  return NextAuth({
    providers: [
      GitHubProvider({
        clientId: process.env.AUTH_GITHUB_ID as string,
        clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      }),
    ],
    // You can also add other configurations like callbacks, session, etc.
  });
}
