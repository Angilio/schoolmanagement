import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm, router, Head, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    School,
    CheckCircle,
    AlertTriangle,
    Users,
} from "lucide-react";

export default function Index({ classes }) {
    const { flash } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [classeToDelete, setClasseToDelete] = useState(null);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: "",
    });

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setToast({
                show: true,
                message: flash.success || flash.error,
                type: flash.success ? "success" : "error",
            });

            setTimeout(() => {
                setToast({
                    show: false,
                    message: "",
                    type: "success",
                });
            }, 3000);
        }
    }, [flash]);

    const openCreate = () => {
        setEditing(null);
        reset();
        setShowModal(true);
    };

    const openEdit = (classe) => {
        setEditing(classe);
        setData("name", classe.name);
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();

        if (editing) {
            put(route("admin.classes.update", editing.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post(route("admin.classes.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const confirmDelete = (classe) => {
        setClasseToDelete(classe);
        setShowDeleteModal(true);
    };

    const deleteClasse = () => {
        if (!classeToDelete) return;

        router.delete(route("admin.classes.destroy", classeToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setClasseToDelete(null);
            },
        });
    };

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Classes
                    </h2>

                    <p className="text-sm text-slate-500">
                        Gestion des classes de l’établissement.
                    </p>
                </div>
            }
        >
            <Head title="Gérer les classes" />

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

                            <span className="font-semibold">
                                {toast.message}
                            </span>
                        </div>
                    </ModalPortal>
                )}

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-xl">

                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20" />

                    <div className="absolute -bottom-10 left-20 h-32 w-32 rounded-full bg-white/10" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h1 className="text-3xl font-black">
                                Gestion des classes
                            </h1>

                            <p className="mt-2 text-blue-100">
                                Ajoutez et gérez les classes de votre établissement.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openCreate}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                        >
                            <Plus size={18} />
                            Ajouter une classe
                        </button>

                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

                        <div className="flex items-center gap-4">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <School size={28} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Total classes
                                </p>

                                <p className="text-3xl font-black text-slate-800">
                                    {classes.length}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

                    <div className="flex items-center justify-between border-b border-slate-200 p-6">

                        <div>
                            <h2 className="text-xl font-black text-slate-800">
                                Liste des classes
                            </h2>

                            <p className="text-sm text-slate-500">
                                Toutes les classes enregistrées.
                            </p>
                        </div>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        ID
                                    </th>

                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Classe
                                    </th>

                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Élèves
                                    </th>

                                    <th className="p-4 text-center text-sm font-bold text-slate-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {classes.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="border-t border-slate-100 transition hover:bg-slate-50"
                                    >
                                        <td className="p-4 text-sm font-semibold text-slate-500">
                                            #{c.id}
                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <School size={20} />
                                                </div>

                                                <span className="font-bold text-slate-800">
                                                    {c.name}
                                                </span>

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 font-bold text-slate-700">
                                                <Users size={16} />
                                                {c.students_count}
                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() => openEdit(c)}
                                                    className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => confirmDelete(c)}
                                                    className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                            </div>

                                        </td>
                                    </tr>
                                ))}

                                {classes.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="p-8 text-center text-slate-500"
                                        >
                                            Aucune classe enregistrée.
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
                            className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-md"
                            onClick={() => setShowModal(false)}
                        >
                            <div
                                className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

                                <form onSubmit={submit} className="p-7">
                                    <div className="mb-6 flex items-start justify-between gap-4">
                                        <div>
                                            <h5 className="text-2xl font-black text-slate-800">
                                                {editing ? "Modifier" : "Ajouter"} une classe
                                            </h5>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Renseignez le nom de la classe.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="rounded-2xl bg-slate-100 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Nom de la classe
                                    </label>

                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        placeholder="Ex: Seconde, Première, Terminale..."
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
                                    />

                                    {errors.name && (
                                        <p className="mt-2 text-sm font-semibold text-red-500">
                                            {errors.name}
                                        </p>
                                    )}

                                    <div className="mt-7 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700"
                                        >
                                            Annuler
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white disabled:opacity-60"
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
                            className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-md"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            <div
                                className="relative w-full max-w-md rounded-[2rem] bg-white p-7 text-center shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-red-500 to-orange-500" />

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-600">
                                    <AlertTriangle size={34} />
                                </div>

                                <h2 className="text-2xl font-black text-slate-800">
                                    Confirmer la suppression
                                </h2>

                                <p className="mt-3 text-slate-500">
                                    Voulez-vous vraiment supprimer cette classe ?
                                </p>

                                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-black text-slate-800">
                                    {classeToDelete?.name}
                                </div>

                                <p className="mt-4 text-sm font-semibold text-red-500">
                                    Cette action est irréversible.
                                </p>

                                <div className="mt-7 flex justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(false)}
                                        className="rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-700"
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="button"
                                        onClick={deleteClasse}
                                        className="rounded-2xl bg-red-600 px-6 py-3 font-bold text-white"
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