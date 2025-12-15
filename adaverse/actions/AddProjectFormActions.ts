'use server';
import {Projects} from "@/content/interface";
import {auth} from "@/lib/auth/auth";
import {headers} from "next/headers";

interface FormActionResult {
    success: boolean;
    error?: string;
    data?: any;
}

export const FormAction = async (newProjects: Projects): Promise<FormActionResult> => {
    try {
        const session = await auth.api.getSession({headers: await headers()});

        const updatedProjects = {
            ...newProjects,
            user_id: session?.user?.id || "",
        };

        const headersList = await headers();
        const host = headersList.get('host') || 'localhost:3000';
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const apiUrl = `${protocol}://${host}/api/project_students`;
        
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProjects),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || "Erreur lors de la création du projet" };
        }
    } catch (error) {
        return { success: false, error: "Erreur de connexion. Veuillez réessayer." };
    }
};