import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from "@/lib/wallace-index/db";
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    async signIn({ account }) {
      if (!process.env.DATABASE_URL || account?.provider !== "github")
        return false;
      const user = await db.wallaceUser.findUnique({
        where: { id: `github:${account.providerAccountId}` },
      });
      return !!user && !user.disabled && user.roles.length > 0;
    },
    async jwt({ token, account }) {
      if (account) token.editorId = `github:${account.providerAccountId}`;
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.editorId === "string")
        session.user.id = token.editorId;
      return session;
    },
  },
});
