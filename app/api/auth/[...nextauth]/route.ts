import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/', // Redirect to home page after sign in
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow Google OAuth sign in
      if (account?.provider === 'google') {
        return true
      }
      return false
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken
      return session
    },
    async redirect({ url, baseUrl }) {
      // After successful sign in, redirect to home page
      return baseUrl
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }
