import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    graphyUser?: any
  }

  interface User {
    // Basic user properties
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
