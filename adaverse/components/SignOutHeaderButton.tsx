'use client'

import { signout } from "@/actions/signActions"

export function SignOutHeaderButton() {
    return (
        <button
            onClick={async () => {
                await signout();
                window.location.reload();
            }}
        >
            Se Déconnecter
        </button>
    )
}