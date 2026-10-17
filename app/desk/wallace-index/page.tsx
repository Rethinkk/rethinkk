import Link from "next/link";
import { signIn, signOut } from "@/auth";
import { actor, deskData } from "@/lib/wallace-index/editorial";
import { EditorialDesk } from "@/components/wallace-index/desk";
import "@/app/wallace-index/wallace.css";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Wallace Index research desk | RETHINKK",
  robots: { index: false, follow: false },
};
export default async function DeskPage() {
  if (
    !process.env.DATABASE_URL ||
    !process.env.AUTH_SECRET ||
    !process.env.AUTH_GITHUB_ID ||
    !process.env.AUTH_GITHUB_SECRET
  )
    return (
      <div className="wi">
        <h1>Wallace Index research desk</h1>
        <p>
          The secure research desk requires a configured PostgreSQL database,
          GitHub OAuth application and authorised editorial accounts. It is
          closed until those are connected.
        </p>
        <Link href="/wallace-index">View the public chapter →</Link>
      </div>
    );
  let data;
  try {
    data = await deskData(await actor());
  } catch {
    return (
      <div className="wi">
        <h1>Editorial access</h1>
        <p>
          Sign in with a GitHub account explicitly assigned a RETHINKK editorial
          role.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/desk/wallace-index" });
          }}
        >
          <button>Sign in with GitHub</button>
        </form>
      </div>
    );
  }
  return (
    <div className="wi">
      <div className="wi-actions">
        <Link href="/wallace-index">Public chapter →</Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/wallace-index" });
          }}
        >
          <button>Sign out</button>
        </form>
      </div>
      <h1>Wallace Index research desk</h1>
      <EditorialDesk initial={JSON.parse(JSON.stringify(data))} />
    </div>
  );
}
