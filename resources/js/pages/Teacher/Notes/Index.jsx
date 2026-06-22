import AppLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import {
    BookOpen,
    CalendarDays,
    CheckCircle2,
    GraduationCap,
    Save,
    Search,
    UserRound,
    AlertTriangle,
} from "lucide-react";

export default function Index({
    assignments = [],
    evaluations = [],
    selected = {},
    students = [],
    existingNotes = {},
}) {
    const selectedEvaluationId = selected?.evaluation_id || "";
    const selectedTeacherSubjectId = selected?.teacher_subject_id || "";
    const canEdit = selected?.can_edit ?? false;

    const { data, setData, post, processing, errors } = useForm({
        evaluation_id: selectedEvaluationId,
        teacher_subject_id: selectedTeacherSubjectId,
        notes: [],
    });

    const sortedStudents = useMemo(() => {
        return [...students].sort((a, b) => {
            const nameA = a.user?.name || "";
            const nameB = b.user?.name || "";

            return nameA.localeCompare(nameB, "fr", {
                sensitivity: "base",
            });
        });
    }, [students]);

    useEffect(() => {
        const notes = sortedStudents.map((student) => {
            const existing = existingNotes?.[student.id];

            return {
                student_id: student.id,
                note: existing?.note ?? "",
            };
        });

        setData({
            evaluation_id: selectedEvaluationId,
            teacher_subject_id: selectedTeacherSubjectId,
            notes,
        });
    }, [
        sortedStudents,
        selectedEvaluationId,
        selectedTeacherSubjectId,
        existingNotes,
    ]);

    const goSearch = (e) => {
        e.preventDefault();

        if (!data.evaluation_id || !data.teacher_subject_id) {
            alert("Veuillez choisir une évaluation et une classe/section.");
            return;
        }

        router.get(
            route("teacher.notes.index"),
            {
                evaluation_id: data.evaluation_id,
                teacher_subject_id: data.teacher_subject_id,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const submit = (e) => {
        e.preventDefault();

        if (!canEdit) {
            alert("La date limite de saisie est dépassée.");
            return;
        }

        post(route("teacher.notes.store"), {
            preserveScroll: true,
        });
    };

    const normalizeNoteInput = (rawValue, previousValue = "") => {
        let value = String(rawValue)
            .replace(",", ".")
            .replace(/[^\d.]/g, "");

        if (value === "") {
            return "";
        }

        const parts = value.split(".");
        let integerPart = parts[0] || "";
        let decimalPart = parts.slice(1).join("");

        /*
        |--------------------------------------------------------------------------
        | Si l'enseignant écrit 1450, on transforme automatiquement en 14.50.
        | Si l'enseignant écrit 201, cela deviendrait 20.1, donc refusé car > 20.
        |--------------------------------------------------------------------------
        */
        if (!value.includes(".") && integerPart.length > 2) {
            decimalPart = integerPart.slice(2, 4);
            integerPart = integerPart.slice(0, 2);
            value = `${integerPart}.${decimalPart}`;
        } else if (value.includes(".")) {
            decimalPart = decimalPart.slice(0, 2);
            value =
                decimalPart !== ""
                    ? `${integerPart}.${decimalPart}`
                    : `${integerPart}.`;
        }

        if (value === ".") {
            value = "0.";
        }

        const numericValue = Number(value);

        if (Number.isNaN(numericValue)) {
            return previousValue;
        }

        if (numericValue < 0 || numericValue > 20) {
            return previousValue;
        }

        return value;
    };

    const updateNote = (studentId, value) => {
        setData(
            "notes",
            data.notes.map((item) => {
                if (Number(item.student_id) !== Number(studentId)) {
                    return item;
                }

                const nextValue = normalizeNoteInput(value, item.note);

                return {
                    ...item,
                    note: nextValue,
                };
            })
        );
    };

    const formatNoteOnBlur = (studentId) => {
        setData(
            "notes",
            data.notes.map((item) => {
                if (Number(item.student_id) !== Number(studentId)) {
                    return item;
                }

                if (item.note === "" || item.note === ".") {
                    return {
                        ...item,
                        note: "",
                    };
                }

                const numericValue = Number(item.note);

                if (
                    Number.isNaN(numericValue) ||
                    numericValue < 0 ||
                    numericValue > 20
                ) {
                    return {
                        ...item,
                        note: "",
                    };
                }

                return {
                    ...item,
                    note: numericValue.toFixed(2),
                };
            })
        );
    };

    const getAssignmentLabel = (assignment) => {
        const subject = assignment.subject?.name || "Matière";
        const classe = assignment.classe?.name || "Classe";
        const section = assignment.section?.name || "Section";
        const serie = assignment.serie?.name;

        return `${subject} - ${classe} - Section ${section}${
            serie ? ` - Série ${serie}` : ""
        }`;
    };

    const getEvaluationLabel = (evaluation) => {
        const trimestre = evaluation.trimestre;
        const year =
            trimestre?.school_year?.year || trimestre?.schoolYear?.year;

        return `${evaluation.title} - ${trimestre?.name || "Trimestre"}${
            year ? ` (${year})` : ""
        }`;
    };

    const selectedAssignment = selected?.assignment;
    const selectedEvaluation = selected?.evaluation;

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Saisie des notes
                    </h2>

                    <p className="text-sm text-slate-500">
                        Choisissez une évaluation ouverte, une classe/section,
                        puis saisissez les notes.
                    </p>
                </div>
            }
        >
            <Head title="Saisie des notes" />

            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-xl">
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20" />
                    <div className="absolute -bottom-14 left-24 h-40 w-40 rounded-full bg-white/10" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
                                <BookOpen size={17} />
                                Notes des élèves
                            </div>

                            <h1 className="text-3xl font-black">
                                Saisie groupée des notes
                            </h1>

                            <p className="mt-2 max-w-2xl text-emerald-50">
                                Les évaluations clôturées ne sont plus
                                sélectionnables. Les notes doivent être comprises
                                entre 0 et 20.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
                            <p className="text-sm font-semibold text-emerald-50">
                                Élèves affichés
                            </p>
                            <p className="mt-1 text-4xl font-black">
                                {students.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-slate-800">
                            Choix de l’évaluation et de la classe
                        </h2>
                        <p className="text-sm text-slate-500">
                            Seules les évaluations dont la date limite de saisie
                            n’est pas dépassée sont affichées.
                        </p>
                    </div>

                    <form
                        onSubmit={goSearch}
                        className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Évaluation ouverte
                            </label>

                            <select
                                value={data.evaluation_id}
                                onChange={(e) =>
                                    setData("evaluation_id", e.target.value)
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                            >
                                <option value="">
                                    Choisir une évaluation ouverte
                                </option>

                                {evaluations.map((evaluation) => (
                                    <option
                                        key={evaluation.id}
                                        value={evaluation.id}
                                    >
                                        {getEvaluationLabel(evaluation)} - notes
                                        jusqu’au{" "}
                                        {evaluation.grade_entry_deadline}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Matière / Classe / Section
                            </label>

                            <select
                                value={data.teacher_subject_id}
                                onChange={(e) =>
                                    setData(
                                        "teacher_subject_id",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                            >
                                <option value="">
                                    Choisir une classe/section
                                </option>

                                {assignments.map((assignment) => (
                                    <option
                                        key={assignment.id}
                                        value={assignment.id}
                                    >
                                        {getAssignmentLabel(assignment)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
                            >
                                <Search size={18} />
                                Afficher
                            </button>
                        </div>
                    </form>

                    {evaluations.length === 0 && (
                        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-700">
                            Aucune évaluation ouverte pour la saisie des notes.
                        </div>
                    )}
                </div>

                {selectedEvaluation && selectedAssignment && (
                    <div className="grid gap-5 lg:grid-cols-3">
                        <InfoCard
                            icon={<CalendarDays size={24} />}
                            label="Évaluation"
                            value={selectedEvaluation.title}
                            subValue={`Limite notes : ${selectedEvaluation.grade_entry_deadline}`}
                            color="blue"
                        />

                        <InfoCard
                            icon={<GraduationCap size={24} />}
                            label="Classe / Section"
                            value={`${
                                selectedAssignment.classe?.name || ""
                            } - Section ${
                                selectedAssignment.section?.name || ""
                            }`}
                            subValue={
                                selectedAssignment.serie?.name
                                    ? `Série ${selectedAssignment.serie.name}`
                                    : "Sans série"
                            }
                            color="emerald"
                        />

                        <InfoCard
                            icon={<BookOpen size={24} />}
                            label="Matière"
                            value={
                                selectedAssignment.subject?.name || "Matière"
                            }
                            subValue={`Coefficient ${
                                selectedAssignment.subject?.coefficient || 1
                            }`}
                            color="violet"
                        />
                    </div>
                )}

                {selectedEvaluation && !canEdit && (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={24} />
                            <div>
                                <p className="font-black">Saisie clôturée</p>
                                <p className="mt-1 text-sm font-semibold">
                                    La date limite de saisie est dépassée. Vous
                                    ne pouvez plus ajouter ni modifier les notes
                                    pour cette évaluation.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {students.length > 0 && (
                    <form
                        onSubmit={submit}
                        className="rounded-3xl border border-slate-200 bg-white shadow-xl"
                    >
                        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">
                                    Liste des élèves
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Liste rangée par ordre alphabétique. Note
                                    comprise entre 0 et 20, avec au maximum deux
                                    chiffres après la virgule.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !canEdit}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing
                                    ? "Enregistrement..."
                                    : "Valider les notes"}
                            </button>
                        </div>

                        {errors.evaluation_id && (
                            <p className="px-6 pt-4 text-sm font-bold text-red-600">
                                {errors.evaluation_id}
                            </p>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100 text-sm text-slate-600">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">
                                            Élève
                                        </th>

                                        <th className="px-6 py-4 font-bold">
                                            Matricule
                                        </th>

                                        <th className="px-6 py-4 font-bold">
                                            Classe
                                        </th>

                                        <th className="px-6 py-4 font-bold">
                                            Note /20
                                        </th>

                                        <th className="px-6 py-4 font-bold">
                                            Note coeff.
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {sortedStudents.map((student, index) => {
                                        const noteItem = data.notes.find(
                                            (item) =>
                                                Number(item.student_id) ===
                                                Number(student.id)
                                        );

                                        const coefficient =
                                            selectedAssignment?.subject
                                                ?.coefficient || 1;

                                        const noteValue = noteItem?.note || "";

                                        const weighted =
                                            noteValue !== ""
                                                ? (
                                                      Number(noteValue) *
                                                      Number(coefficient)
                                                  ).toFixed(2)
                                                : "-";

                                        return (
                                            <tr
                                                key={student.id}
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                                            <UserRound
                                                                size={20}
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="font-black text-slate-800">
                                                                {
                                                                    student
                                                                        .user
                                                                        ?.name
                                                                }
                                                            </p>
                                                            <p className="text-sm text-slate-400">
                                                                Élève
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5 font-semibold text-slate-600">
                                                    {student.matricule}
                                                </td>

                                                <td className="px-6 py-5 text-sm font-bold text-slate-600">
                                                    {student.classe?.name} -
                                                    Section{" "}
                                                    {student.section?.name}
                                                    {student.serie?.name
                                                        ? ` - Série ${student.serie.name}`
                                                        : ""}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <input
                                                        type="text"
                                                        inputMode="decimal"
                                                        value={noteValue}
                                                        disabled={!canEdit}
                                                        onChange={(e) =>
                                                            updateNote(
                                                                student.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        onBlur={() =>
                                                            formatNoteOnBlur(
                                                                student.id
                                                            )
                                                        }
                                                        placeholder="Ex: 14.50"
                                                        className="w-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-black text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                                    />

                                                    {errors[
                                                        `notes.${index}.note`
                                                    ] && (
                                                        <p className="mt-2 text-xs font-bold text-red-600">
                                                            {
                                                                errors[
                                                                    `notes.${index}.note`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
                                                        {weighted}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm font-semibold text-slate-600">
                                <CheckCircle2
                                    size={20}
                                    className="text-emerald-600"
                                />
                                <p>
                                    Les notes seront enregistrées pour cette
                                    évaluation et cette matière. Le coefficient
                                    sera appliqué automatiquement côté serveur.
                                </p>
                            </div>
                        </div>
                    </form>
                )}

                {selectedEvaluation &&
                    selectedAssignment &&
                    students.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                            <p className="font-black text-slate-700">
                                Aucun élève trouvé pour cette classe et section.
                            </p>
                        </div>
                    )}
            </div>
        </AppLayout>
    );
}

function InfoCard({ icon, label, value, subValue, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        violet: "bg-violet-50 text-violet-600",
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        colors[color] || colors.emerald
                    }`}
                >
                    {icon}
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-500">
                        {label}
                    </p>

                    <p className="text-lg font-black text-slate-800">
                        {value}
                    </p>

                    <p className="text-xs font-semibold text-slate-400">
                        {subValue}
                    </p>
                </div>
            </div>
        </div>
    );
}