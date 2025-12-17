import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import SignPage from "@/page/SignPage";
import {redirect} from "next/navigation";


export default async function Connections() {
  const session = await auth.api.getSession({headers: await headers()});

  if (session) {
    redirect("/");
  }
  
  return (
    <>
      {/* <pre>{session ? JSON.stringify(session.user, null, 2) : "Not connected"}</pre> */}
      <SignPage session={session} />
    </>
  )
}
