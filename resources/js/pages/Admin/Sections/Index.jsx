import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm, router, Head, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Layers,
    School,
    AlertTriangle,
    CheckCircle,
    Users,
} from "lucide-react";

export default function Index({ sections, series = [] }) {
    const { flash } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);

    const [showSerieModal, setShowSerieModal] = useState(false);
    const [editingSerie, setEditingSerie] = useState(null);

    const [showConfirmDeleteSerie, setShowConfirmDeleteSerie] = useState(false);
    const [serieToDelete, setSerieToDelete] = useState(null);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: "",
    });

    const {
        data: serieData,
        setData: setSerieData,
        post: postSerie,
        put: putSerie,
        reset: resetSerie,
        processing: processingSerie,
        errors: serieErrors,
    } = useForm({
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

    const openEdit = (section) => {
        setEditing(section);
        setData("name", section.name);
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();

        if (editing) {
            put(`/admin/sections/${editing.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post("/admin/sections", {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const confirmDelete = (section) => {
        setSectionToDelete(section);
        setShowDeleteModal(true);
    };

    const deleteSection = () => {
        if (!sectionToDelete) return;

        router.delete(`/admin/sections/${sectionToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSectionToDelete(null);
            },
        });
    };

    const openCreateSerie = () => {
        setEditingSerie(null);
        resetSerie();
        setShowSerieModal(true);
    };

    const openEditSerie = (serie) => {
        setEditingSerie(serie);
        setSerieData("name", serie.name);
        setShowSerieModal(true);
    };

    const submitSerie = (e) => {
        e.preventDefault();

        if (editingSerie) {
            putSerie(`/admin/sections/series/${editingSerie.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowSerieModal(false);
                    setEditingSerie(null);
                    resetSerie();
                },
            });
        } else {
            postSerie("/admin/sections/series", {
                preserveScroll: true,
                onSuccess: () => {
                    setShowSerieModal(false);
                    resetSerie();
                },
            });
        }
    };

    const deleteSerie = () => {
        if (!serieToDelete) return;

        router.delete(`/admin/sections/series/${serieToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowConfirmDeleteSerie(false);
                setSerieToDelete(null);
            },
        });
    };

    const inputClass =
        "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Sections & Séries
                    </h2>

                    <p className="text-sm text-slate-500">
                        Gestion indépendante des sections et séries.
                    </p>
                </div>
            }
        >
            <Head title="Sections & Séries" />

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

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black">
                                Gestion des sections & séries
                            </h1>

                            <p className="mt-2 max-w-2xl text-blue-100">
                                Créez les sections comme I, II, III et les séries comme A, C, D.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                            >
                                <Plus size={18} />
                                Ajouter section
                            </button>

                            <button
                                type="button"
                                onClick={openCreateSerie}
                                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-600"
                            >
                                <Plus size={18} />
                                Ajouter série
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <StatCard
                        icon={<Layers size={28} />}
                        label="Total sections"
                        value={sections.length}
                        color="blue"
                    />

                    <StatCard
                        icon={<School size={28} />}
                        label="Total séries"
                        value={series.length}
                        color="emerald"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <TableCard
                        title="Sections"
                        subtitle="Liste des sections disponibles."
                    >
                        <DataTable
                            items={sections}
                            emptyText="Aucune section enregistrée."
                            nameLabel="Section"
                            badgeColor="blue"
                            onEdit={openEdit}
                            onDelete={confirmDelete}
                        />
                    </TableCard>

                    <TableCard
                        title="Séries"
                        subtitle="Liste des séries disponibles."
                    >
                        <DataTable
                            items={series}
                            emptyText="Aucune série enregistrée."
                            nameLabel="Série"
                            badgeColor="emerald"
                            onEdit={openEditSerie}
                            onDelete={(serie) => {
                                setSerieToDelete(serie);
                                setShowConfirmDeleteSerie(true);
                            }}
                        />
                    </TableCard>
                </div>

                {showModal && (
                    <FormModal
                        title={editing ? "Modifier la section" : "Ajouter une section"}
                        subtitle="Exemple : I, II, III."
                        onClose={() => setShowModal(false)}
                        onSubmit={submit}
                    >
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Nom de la section
                            </label>

                            <input
                                className={inputClass}
                                placeholder="Ex: I, II, III"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />

                            {errors.name && (
                                <p className="mt-2 text-sm font-semibold text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <ModalActions
                            onCancel={() => setShowModal(false)}
                            processing={processing}
                            label={editing ? "Modifier" : "Créer"}
                        />
                    </FormModal>
                )}

                {showSerieModal && (
                    <FormModal
                        title={editingSerie ? "Modifier la série" : "Ajouter une série"}
                        subtitle="Exemple : A, C, D."
                        onClose={() => setShowSerieModal(false)}
                        onSubmit={submitSerie}
                    >
                        <div>
                            <label className="mb-2 block text-sm font-bold text-slate-700">
                                Nom de la série
                            </label>

                            <input
                                className={inputClass}
                                placeholder="Ex: A, C, D"
                                value={serieData.name}
                                onChange={(e) => setSerieData("name", e.target.value)}
                            />

                            {serieErrors.name && (
                                <p className="mt-2 text-sm font-semibold text-red-500">
                                    {serieErrors.name}
                                </p>
                            )}
                        </div>

                        <ModalActions
                            onCancel={() => setShowSerieModal(false)}
                            processing={processingSerie}
                            label={editingSerie ? "Modifier" : "Créer"}
                        />
                    </FormModal>
                )}

                {showDeleteModal && (
                    <DeleteModal
                        title="Supprimer la section"
                        itemName={sectionToDelete?.name}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={deleteSection}
                    />
                )}

                {showConfirmDeleteSerie && (
                    <DeleteModal
                        title="Supprimer la série"
                        itemName={serieToDelete?.name}
                        onClose={() => setShowConfirmDeleteSerie(false)}
                        onConfirm={deleteSerie}
                    />
                )}
            </div>
        </AppLayout>
    );
}

function ModalPortal({ children }) {
    return createPortal(children, document.body);
}

function StatCard({ icon, label, value, color }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                        colorClasses[color] || colorClasses.blue
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

function TableCard({ title, subtitle, children }) {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 p-6">
                <h2 className="text-xl font-black text-slate-800">
                    {title}
                </h2>

                <p className="text-sm text-slate-500">
                    {subtitle}
                </p>
            </div>

            <div className="overflow-x-auto">
                {children}
            </div>
        </div>
    );
}

function DataTable({
    items,
    emptyText,
    nameLabel,
    badgeColor,
    onEdit,
    onDelete,
}) {
    const badgeClasses = {
        blue: "bg-blue-50 text-blue-700",
        emerald: "bg-emerald-50 text-emerald-700",
    };

    return (
        <table className="w-full">
            <thead className="bg-slate-100">
                <tr>
                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                        {nameLabel}
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
                {items.map((item) => (
                    <tr
                        key={item.id}
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                        <td className="p-4">
                            <span
                                className={`rounded-xl px-3 py-1 text-sm font-bold ${
                                    badgeClasses[badgeColor] || badgeClasses.blue
                                }`}
                            >
                                {item.name}
                            </span>
                        </td>

                        <td className="p-4">
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 font-bold text-slate-700">
                                <Users size={16} />
                                {item.students_count}
                            </div>
                        </td>

                        <td className="p-4">
                            <div className="flex justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onEdit(item)}
                                    className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(item)}
                                    className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}

                {items.length === 0 && (
                    <tr>
                        <td
                            colSpan="3"
                            className="p-8 text-center text-slate-500"
                        >
                            {emptyText}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

function FormModal({ title, subtitle, onClose, onSubmit, children }) {
    return (
        <ModalPortal>
            <div
                className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-md"
                onClick={onClose}
            >
                <div
                    className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl shadow-slate-950/30"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

                    <form onSubmit={onSubmit} className="space-y-4 p-6 sm:p-7">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">
                                    {title}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {subtitle}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="shrink-0 rounded-2xl bg-slate-100 p-2 text-slate-500 transition hover:rotate-90 hover:bg-red-50 hover:text-red-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {children}
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
}

function ModalActions({ onCancel, processing, label }) {
    return (
        <div className="flex justify-end gap-3 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
            >
                Annuler
            </button>

            <button
                type="submit"
                disabled={processing}
                className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {processing ? "Traitement..." : label}
            </button>
        </div>
    );
}

function DeleteModal({ title, itemName, onClose, onConfirm }) {
    return (
        <ModalPortal>
            <div
                className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-md"
                onClick={onClose}
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
                        {title}
                    </h2>

                    <p className="mt-3 text-slate-500">
                        Voulez-vous vraiment supprimer cet élément ?
                    </p>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-black text-slate-800">
                        {itemName}
                    </div>

                    <p className="mt-4 text-sm font-semibold text-red-500">
                        Cette action est irréversible.
                    </p>

                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                        >
                            Annuler
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            className="rounded-2xl bg-red-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-600/25 transition hover:-translate-y-0.5 hover:bg-red-700"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}