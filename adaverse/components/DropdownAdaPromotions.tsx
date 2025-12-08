import {CombinedColors} from "@/content/Colors";
import {useAdaProjects} from "@/context/AdaProjectsContext";

type DropdownAdaPromotionsProps = {
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value: string;
};

export function DropdownAdaPromotions({ onChange, value }: DropdownAdaPromotionsProps) {
    const {listAdaProjects} = useAdaProjects();
    return (
        <select
            name="adaProjectID"
            id="adaProjectID"
            value={value}
            onChange={onChange}
            className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} h-12 text-sm px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
        >
            <option value="" disabled hidden>Sélectionner un projet Ada</option>
            {listAdaProjects.map((project) => (
                <option key={project.id} value={project.id}>
                    {project.projectName}
                </option>
            ))}
        </select>
    )
}