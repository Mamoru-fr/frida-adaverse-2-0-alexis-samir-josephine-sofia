'use client'

import { signout } from "@/actions/signActions"

export function SignOutHeaderButton() {
    return (
        <button
            className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition cursor-pointer"
            onClick={async () => {
                await signout();
                window.location.reload();
            }}
        >
            Se Déconnecter
        </button>
    )
}