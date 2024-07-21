// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  // Additional configuration options can go here
})

export { handler as GET, handler as POST }
