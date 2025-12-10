import {FormEvent} from "react";
import { Projects } from "@/content/interface";

interface FormActionProps {
    e: FormEvent<HTMLFormElement>;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setError: (error: string | null) => void;
    setNewProjectType: (projectType: Projects) => void;
    newProjectType: Projects;
    onSuccess: () => void;
}

export const FormAction = async ({e, setIsSubmitting, setError, setNewProjectType, newProjectType, onSuccess}: FormActionProps) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/project_students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProjectType),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Projet créé avec succès :", data);
                
                setNewProjectType({
                    title: "",
                    github_url: "",
                    demo_url: "",
                    promotion_id: "",
                    project_type_id: "",
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