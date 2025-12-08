import { useStudents } from '@/context/StudentsContext';
import { CombinedColors } from '@/content/Colors';
import { X } from 'lucide-react';

interface MultiStudentTagSelectProps {
  value: string[];
  onChange: (selectedIds: string[]) => void;
}

export function MultiStudentTagSelect({ value, onChange }: MultiStudentTagSelectProps) {
  const { listStudents, loading, error } = useStudents();

  if (loading) return <div>Chargement des étudiants...</div>;
  if (error) return <div>Erreur: {error}</div>;

  // Filter out already selected students for dropdown
  const availableStudents = listStudents.filter(
    s => !value.includes(s.id.toString())
  );

  const handleAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id && !value.includes(id)) {
      onChange([...value, id]);
    }
    // Reset dropdown after selection
    e.target.selectedIndex = 0;
  };

  const handleRemove = (id: string) => {
    onChange(value.filter(v => v !== id));
  };

  return (
    <div
      className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} flex flex-wrap items-center gap-2 px-2 py-2 transition-colors focus-within:ring-2 focus-within:ring-purple-500`}
      style={{ minHeight: '3rem' }}
    >
      {/* Tags or placeholder */}
      {
        value.map(id => {
          const student = listStudents.find(s => s.id.toString() === id);
          if (!student) return null;
          return (
            <span
              key={id}
              className={`inline-flex items-center rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 text-sm font-medium border border-purple-300 dark:border-purple-700`}
            >
              {student.name} ({student.githubUsername})
              <button
                type="button"
                className="ml-2 text-purple-500 hover:text-red-500"
                onClick={() => handleRemove(id)}
                aria-label={`Retirer ${student.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          );
        })
      }
      {/* Dropdown to add student */}
      {availableStudents.length > 0 && (
        <select
          className="flex flex-1 bg-transparent outline-none border-none text-sm text-gray-700 dark:text-gray-200 min-w-[180px]"
          onChange={handleAdd}
          value=""
        >
          <option value="">Ajouter...</option>
          {availableStudents.map(student => (
            <option key={student.id} value={student.id.toString()}>
              {student.name} ({student.githubUsername})
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
