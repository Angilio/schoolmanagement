import AppLayout from "@/Layouts/AppLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    CalendarDays,
    ClipboardList,
    Edit,
    Plus,
    Trash2,
    X,
    Save,
    Clock,
    GraduationCap,
} from "lucide-react";

export default function Index({ evaluations = [], trimestres = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingEvaluation, setEditingEvaluation] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [evaluationToDelete, setEvaluationToDelete] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: "",
        trimestre_id: "",
        start_date: "",
        end_date: "",
        grade_entry_deadline: "",
    });

    const openCreateModal = () => {
        setEditingEvaluation(null);

        setData({
            title: "",
            trimestre_id: "",
            start_date: "",
            end_date: "",
            grade_entry_deadline: "",
        });

        setShowModal(true);
    };

    const openEditModal = (evaluation) => {
        setEditingEvaluation(evaluation);

        setData({
            title: evaluation.title || "",
            trimestre_id: evaluation.trimestre_id || "",
            start_date: evaluation.start_date || "",
            end_date: evaluation.end_date || "",
            grade_entry_deadline: evaluation.grade_entry_deadline || "",
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingEvaluation(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();

        if (editingEvaluation) {
            put(route("admin.evaluations.update", editingEvaluation.id), {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        } else {
            post(route("admin.evaluations.store"), {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        }
    };

    const confirmDelete = (evaluation) => {
        setEvaluationToDelete(evaluation);
        setShowDeleteModal(true);
    };

    const destroy = () => {
        if (!evaluationToDelete) return;

        router.delete(route("admin.evaluations.destroy", evaluationToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setEvaluationToDelete(null);
            },
        });
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setEvaluationToDelete(null);
    };

    const getTrimestreLabel = (trimestre) => {
        if (!trimestre) {
            return "Trimestre non défini";
        }

        const year = trimestre.school_year?.year || trimestre.schoolYear?.year;

        if (year) {
            return `${year} - ${trimestre.name || trimestre.title}`;
        }

        return trimestre.name || trimestre.title || `Trimestre ${trimestre.id}`;
    };

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Évaluations
                    </h2>

                    <p className="text-sm text-slate-500">
                        Gestion des évaluations par trimestre et date limite de
                        saisie des notes.
                    </p>
                </div>
            }
        >
            <Head title="Évaluations" />

            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-violet-700 p-6 text-white shadow-xl">
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/20" />
                    <div className="absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-white/10" />

                    <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-bold text-white">
                                <ClipboardList size={16} />
                                Gestion des évaluations
                            </div>

                            <h1 className="text-3xl font-black">
                                Évaluations & examens
                            </h1>

                            <p className="mt-2 max-w-2xl text-blue-100">
                                Créez une évaluation rattachée à un trimestre et
                                définissez la période ainsi que la date limite de
                                saisie des notes.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                        >
                            <Plus size={20} />
                            Nouvelle évaluation
                        </button>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                    <StatCard
                        icon={<ClipboardList size={26} />}
                        label="Évaluations"
                        value={evaluations.length}
                        color="blue"
                    />

                    <StatCard
                        icon={<CalendarDays size={26} />}
                        label="Trimestres"
                        value={trimestres.length}
                        color="violet"
                    />

                    <StatCard
                        icon={<Clock size={26} />}
                        label="Saisie des notes"
                        value="Limitée"
                        color="emerald"
                    />
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-xl font-black text-slate-800">
                            Liste des évaluations
                        </h2>

                        <p className="text-sm text-slate-500">
                            Toutes les évaluations enregistrées.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100 text-sm text-slate-600">
                                <tr>
                                    <th className="px-6 py-4 font-bold">
                                        Nom de l’évaluation
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        Trimestre
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        Période d’évaluation
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        Fin saisie notes
                                    </th>

                                    <th className="px-6 py-4 text-right font-bold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {evaluations.length > 0 ? (
                                    evaluations.map((evaluation) => (
                                        <tr
                                            key={evaluation.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                                        <ClipboardList size={20} />
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-slate-800">
                                                            {evaluation.title}
                                                        </p>
                                                        <p className="text-sm text-slate-400">
                                                            Évaluation scolaire
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700">
                                                    <GraduationCap size={16} />
                                                    {getTrimestreLabel(
                                                        evaluation.trimestre
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="space-y-2 text-sm font-bold">
                                                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-700">
                                                        <CalendarDays size={16} />
                                                        Début :{" "}
                                                        {evaluation.start_date}
                                                    </div>

                                                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-indigo-700">
                                                        <CalendarDays size={16} />
                                                        Fin :{" "}
                                                        {evaluation.end_date}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
                                                    <Clock size={16} />
                                                    {
                                                        evaluation.grade_entry_deadline
                                                    }
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                evaluation
                                                            )
                                                        }
                                                        className="rounded-xl bg-slate-100 p-3 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                                                    >
                                                        <Edit size={18} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            confirmDelete(
                                                                evaluation
                                                            )
                                                        }
                                                        className="rounded-xl bg-red-50 p-3 text-red-600 transition hover:bg-red-100"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center"
                                        >
                                            <p className="font-bold text-slate-700">
                                                Aucune évaluation enregistrée
                                            </p>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Cliquez sur “Nouvelle évaluation”
                                                pour commencer.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-md"
                    onClick={closeModal}
                >
                    <div
                        className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

                        <div className="max-h-[90vh] overflow-y-auto p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800">
                                        {editingEvaluation
                                            ? "Modifier l’évaluation"
                                            : "Nouvelle évaluation"}
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Renseignez le nom, le trimestre, la
                                        période et la date limite de saisie.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Nom de l’évaluation
                                    </label>

                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        placeholder="Ex: Examen premier trimestre"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />

                                    {errors.title && (
                                        <p className="mt-2 text-sm font-semibold text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Trimestre
                                    </label>

                                    <select
                                        value={data.trimestre_id}
                                        onChange={(e) =>
                                            setData(
                                                "trimestre_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    >
                                        <option value="">
                                            Sélectionner un trimestre
                                        </option>

                                        {trimestres.map((trimestre) => (
                                            <option
                                                key={trimestre.id}
                                                value={trimestre.id}
                                            >
                                                {getTrimestreLabel(trimestre)}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.trimestre_id && (
                                        <p className="mt-2 text-sm font-semibold text-red-600">
                                            {errors.trimestre_id}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Date de début de l’évaluation
                                        </label>

                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData(
                                                    "start_date",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        />

                                        {errors.start_date && (
                                            <p className="mt-2 text-sm font-semibold text-red-600">
                                                {errors.start_date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Date de fin de l’évaluation
                                        </label>

                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData(
                                                    "end_date",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        />

                                        {errors.end_date && (
                                            <p className="mt-2 text-sm font-semibold text-red-600">
                                                {errors.end_date}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Date limite de saisie des notes
                                    </label>

                                    <input
                                        type="date"
                                        value={data.grade_entry_deadline}
                                        onChange={(e) =>
                                            setData(
                                                "grade_entry_deadline",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />

                                    {errors.grade_entry_deadline && (
                                        <p className="mt-2 text-sm font-semibold text-red-600">
                                            {errors.grade_entry_deadline}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
                                    Après cette date, les enseignants ne pourront
                                    plus ajouter ou modifier les notes de cette
                                    évaluation.
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-600 hover:bg-slate-200"
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60"
                                    >
                                        <Save size={18} />
                                        {processing
                                            ? "Enregistrement..."
                                            : "Enregistrer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-md"
                    onClick={closeDeleteModal}
                >
                    <div
                        className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-7 text-center shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-red-500 to-orange-500" />

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-600">
                            <Trash2 size={34} />
                        </div>

                        <h2 className="text-2xl font-black text-slate-800">
                            Supprimer cette évaluation ?
                        </h2>

                        <p className="mt-3 text-slate-500">
                            Voulez-vous vraiment supprimer cette évaluation ?
                        </p>

                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-black text-slate-800">
                            {evaluationToDelete?.title}
                        </div>

                        <p className="mt-4 text-sm font-semibold text-red-500">
                            Cette action est irréversible.
                        </p>

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                className="rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                onClick={destroy}
                                className="rounded-2xl bg-red-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        violet: "bg-violet-50 text-violet-600",
        emerald: "bg-emerald-50 text-emerald-600",
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        colors[color] || colors.blue
                    }`}
                >
                    {icon}
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-500">
                        {label}
                    </p>

                    <p className="text-2xl font-black text-slate-800">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}