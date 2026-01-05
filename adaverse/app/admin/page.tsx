import {auth} from "@/lib/auth/auth";
import AdminPage from "@/page/AdminPage";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export default async function Admin() {
	const session = await auth.api.getSession({headers: await headers()});

	if (!session || session.user.role !== 'admin') {
		redirect('/');
	}

	return <AdminPage session={session} />;
}
