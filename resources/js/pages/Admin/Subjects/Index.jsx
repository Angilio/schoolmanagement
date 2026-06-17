import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm, router, Head, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    BookOpen,
    Hash,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";

export default function Index({ subjects }) {
    const { flash } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: "",
        coefficient: "",
    });

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setToast({
                show: true,
                message: flash.success || flash.error,
                type: flash.success ? "success" : "error",
            });

            setTimeout(() => {
                setToast({ show: false, message: "", type: "success" });
            }, 3000);
        }
    }, [flash]);

    const openCreate = () => {
        setEditing(null);
        reset();
        setShowModal(true);
    };

    const openEdit = (s) => {
        setEditing(s);
        setData({
            name: s.name,
            coefficient: s.coefficient,
        });
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();

        if (editing) {
            put(`/admin/subjects/${editing.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post("/admin/subjects", {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const confirmDelete = (s) => {
        setSubjectToDelete(s);
        setShowDeleteModal(true);
    };

    const deleteSubject = () => {
        if (!subjectToDelete) return;

        router.delete(`/admin/subjects/${subjectToDelete.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSubjectToDelete(null);
            },
        });
    };

    const totalCoefficient = subjects.reduce(
        (total, subject) => total + Number(subject.coefficient || 0),
        0
    );

    const inputClass =
        "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Matières
                    </h2>
                    <p className="text-sm text-slate-500">
                        Gestion des matières et coefficients.
                    </p>
                </div>
            }
        >
            <Head title="Gestion des matières" />

            <div className="space-y-8">
                {toast.show && (
                    <ModalPortal>
                        <div
                            className={`fixed right-5 top-5 z-[10000] flex items-center gap-3 rounded-2xl px-5 py-4 text-white shadow-xl ${
                                toast.type === "success"
                                    ? "bg-emerald-600"
                                    : "bg-red-600"
                            }`}
                        >
                            {toast.type === "success" ? (
                                <CheckCircle size={22} />
                            ) : (
                                <AlertTriangle size={22} />
                            )}
                            <span className="font-semibold">{toast.message}</span>
                        </div>
                    </ModalPortal>
                )}

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-violet-700 p-6 text-white shadow-xl">
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/20" />
                    <div className="absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-white/10" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black">
                                Gestion des matières
                            </h1>
                            <p className="mt-2 max-w-2xl text-blue-100">
                                Ajoutez, modifiez et organisez les matières avec leurs coefficients.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openCreate}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                        >
                            <Plus size={18} />
                            Ajouter une matière
                        </button>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <StatCard
                        icon={<BookOpen size={28} />}
                        label="Total matières"
                        value={subjects.length}
                        color="blue"
                    />

                    <StatCard
                        icon={<Hash size={28} />}
                        label="Total coefficients"
                        value={totalCoefficient}
                        color="emerald"
                    />
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">
                                Liste des matières
                            </h2>
                            <p className="text-sm text-slate-500">
                                Toutes les matières enregistrées.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Matière
                                    </th>
                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Coefficient
                                    </th>
                                    <th className="p-4 text-center text-sm font-bold text-slate-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {subjects.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="border-t border-slate-100 transition hover:bg-slate-50"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <BookOpen size={20} />
                                                </div>

                                                <span className="font-bold text-slate-800">
                                                    {s.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className="inline-flex rounded-xl bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                                                {s.coefficient}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(s)}
                                                    className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => confirmDelete(s)}
                                                    className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {subjects.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="p-10 text-center text-slate-500"
                                        >
                                            Aucune matière enregistrée.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showModal && (
                    <ModalPortal>
                        <div
                            className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-md"
                            onClick={() => setShowModal(false)}
                        >
                            <div
                                className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl shadow-slate-950/30"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

                                <form onSubmit={submit} className="space-y-4 p-6 sm:p-7">
                                    <div className="mb-6 flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-800">
                                                {editing ? "Modifier" : "Ajouter"} une matière
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Renseignez le nom et le coefficient.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="shrink-0 rounded-2xl bg-slate-100 p-2 text-slate-500 transition hover:rotate-90 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Nom de la matière
                                        </label>
                                        <input
                                            className={inputClass}
                                            placeholder="Ex: Mathématiques"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                        />
                                        {errors.name && (
                                            <p className="mt-2 text-sm font-semibold text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Coefficient
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            className={inputClass}
                                            placeholder="Ex: 4"
                                            value={data.coefficient}
                                            onChange={(e) =>
                                                setData("coefficient", e.target.value)
                                            }
                                        />
                                        {errors.coefficient && (
                                            <p className="mt-2 text-sm font-semibold text-red-500">
                                                {errors.coefficient}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                                        >
                                            Annuler
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {processing
                                                ? "Traitement..."
                                                : editing
                                                    ? "Modifier"
                                                    : "Créer"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </ModalPortal>
                )}

                {showDeleteModal && (
                    <ModalPortal>
                        <div
                            className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-md"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            <div
                                className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white p-7 text-center shadow-2xl shadow-slate-950/30"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-red-500 to-orange-500" />

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-600 shadow-inner">
                                    <AlertTriangle size={34} />
                                </div>

                                <h2 className="text-2xl font-black text-slate-800">
                                    Supprimer cette matière ?
                                </h2>

                                <p className="mt-3 text-slate-500">
                                    Voulez-vous vraiment supprimer cette matière ?
                                </p>

                                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-black text-slate-800">
                                    {subjectToDelete?.name}
                                </div>

                                <p className="mt-4 text-sm font-semibold text-red-500">
                                    Cette action est irréversible.
                                </p>

                                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(false)}
                                        className="rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="button"
                                        onClick={deleteSubject}
                                        className="rounded-2xl bg-red-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-600/25 transition hover:-translate-y-0.5 hover:bg-red-700"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalPortal>
                )}
            </div>
        </AppLayout>
    );
}

function ModalPortal({ children }) {
    return createPortal(children, document.body);
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
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
                    <p className="text-3xl font-black text-slate-800">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}