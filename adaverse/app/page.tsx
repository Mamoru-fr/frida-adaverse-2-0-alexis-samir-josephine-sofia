import {auth} from "@/lib/auth/auth";
import HomePage from "@/page/HomePage";
import {headers} from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({headers: await headers()});
  return (
    <>
      {/* <pre>{session ? JSON.stringify(session.user, null, 2) : "Not connected"}</pre> */}
      <HomePage session={session}/>
    </>
  )
}