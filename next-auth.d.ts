import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      token: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    token: string;
  }

  interface JWT {
    id: string;
    username: string;
    token: string;
  }
}