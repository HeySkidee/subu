// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await dbConnect();
        
        // Check if user exists
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // If user doesn't exist, create a new one
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image
          });
        }
        
        return true;
      }
      return false;
    },
  },
  // Additional configuration options can go here
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }