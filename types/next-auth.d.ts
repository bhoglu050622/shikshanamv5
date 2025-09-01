import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    graphyUser?: {
      id: string
      email: string
      name: string
      phone?: string
      avatar?: string
    }
    graphyJWT?: string
  }

  interface User {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    graphyJWT?: string
    graphyUser?: {
      id: string
      email: string
      name: string
      phone?: string
      avatar?: string
    }
  }
}
