import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";
import DetailsPage from "@/page/DetailsPage";

export default async function SeeMorePage() {
  const session = await auth.api.getSession({headers: await headers()});
  return (
    <>
      {/* <pre>{session ? JSON.stringify(session.user, null, 2) : "Not connected"}</pre> */}
      <DetailsPage session={session} />
    </>
  )
}