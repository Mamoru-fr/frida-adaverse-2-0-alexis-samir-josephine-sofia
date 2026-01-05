import { redirect } from "next/navigation";

export function SignInHeaderButton() {
    return (
        <button
            className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition cursor-pointer"
            onClick={() => redirect('/connections')}
        >Se Connecter</button>
    );
}