import { redirect } from "next/navigation";

export function SignInHeaderButton() {
    return (
        <button
            onClick={() => redirect('/connections')}
        >Se Connecter</button>
    );
}