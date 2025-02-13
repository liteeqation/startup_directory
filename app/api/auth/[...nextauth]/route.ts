import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { NextApiRequest, NextApiResponse } from "next";

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

// Type the request and response parameters for the handler
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, authOptions);
};

// Export the handler for GET and POST methods
export { handler as GET, handler as POST };
