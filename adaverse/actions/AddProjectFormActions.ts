import {FormEvent} from "react";
import { Projects } from "@/content/interface";

interface FormActionProps {
    e: FormEvent<HTMLFormElement>;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setError: (error: string | null) => void;
    setNewadaProjects: (adaProjects: Projects) => void;
    newadaProjects: Projects;
    onSuccess: () => void;
}

export const FormAction = async ({e, setIsSubmitting, setError, setNewadaProjects, newadaProjects, onSuccess}: FormActionProps) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/project_students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newadaProjects),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Projet créé avec succès :", data);
                
                setNewadaProjects({
                    title: "",
                    github_url: "",
                    demo_url: "",
                    promotion_id: "",
                    ada_projects_id: "",
                });
                onSuccess();
            } else {
                setError(data.error || "Erreur lors de la création du projet");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            setError("Erreur de connexion. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };