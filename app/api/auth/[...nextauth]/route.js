// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

const generateUsername = (name) => {
  const baseUsername = name.toLowerCase().replace(/\s+/g, '');
  return `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;
};

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
        
        let dbUser = await User.findOne({ email: user.email });
        
        if (!dbUser) {
          const username = generateUsername(user.name);
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            username: username,
          });
        }
        
        user.id = dbUser._id;
        user.username = dbUser.username;
        
        return true;
      }
      return false;
    },
    async session({ session, user }) {
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.username = dbUser.username;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }