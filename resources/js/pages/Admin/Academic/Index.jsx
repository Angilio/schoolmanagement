import { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

import {
    Plus,
    Pencil,
    Trash2,
    Calendar,
    GraduationCap,
    Layers,
    X,
    AlertTriangle,
} from "lucide-react";

export default function Index({ schoolYears, trimestres, events }) {
    const [tab, setTab] = useState("years");

    const [showYearModal, setShowYearModal] = useState(false);
    const [editingYear, setEditingYear] = useState(null);
    const [yearForm, setYearForm] = useState({ year: "" });

    const [showTrimestreModal, setShowTrimestreModal] = useState(false);
    const [editingTrimestre, setEditingTrimestre] = useState(null);
    const [trimestreForm, setTrimestreForm] = useState({
        name: "",
        school_year_id: "",
        start_date: "",
        end_date: "",
    });

    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        school_year_id: "",
        start_date: "",
        end_date: "",
    });

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        type: null,
        id: null,
        title: "",
    });

    const trimestresBySchoolYear = useMemo(() => {
        return schoolYears.map((year) => ({
            ...year,
            trimestres: trimestres.filter(
                (trimestre) =>
                    Number(trimestre.school_year_id) === Number(year.id)
            ),
        }));
    }, [schoolYears, trimestres]);

    const openYearCreate = () => {
        setEditingYear(null);
        setYearForm({ year: "" });
        setShowYearModal(true);
    };

    const openYearEdit = (year) => {
        setEditingYear(year);
        setYearForm({ year: year.year });
        setShowYearModal(true);
    };

    const openTrimestreCreate = () => {
        setEditingTrimestre(null);
        setTrimestreForm({
            name: "",
            school_year_id: "",
            start_date: "",
            end_date: "",
        });
        setShowTrimestreModal(true);
    };

    const openTrimestreEdit = (t) => {
        setEditingTrimestre(t);
        setTrimestreForm({
            name: t.name,
            school_year_id: t.school_year_id,
            start_date: t.start_date,
            end_date: t.end_date,
        });
        setShowTrimestreModal(true);
    };

    const openEventCreate = () => {
        setEditingEvent(null);
        setEventForm({
            title: "",
            description: "",
            school_year_id: "",
            start_date: "",
            end_date: "",
        });
        setShowEventModal(true);
    };

    const openEventEdit = (e) => {
        setEditingEvent(e);
        setEventForm({
            title: e.title,
            description: e.description ?? "",
            school_year_id: e.school_year_id,
            start_date: e.start_date,
            end_date: e.end_date ?? "",
        });
        setShowEventModal(true);
    };

    const openDeleteModal = (type, id, title) => {
        setDeleteModal({ open: true, type, id, title });
    };

    const submitYear = (e) => {
        e.preventDefault();

        if (editingYear) {
            router.put(
                route("admin.academic.school-years.update", editingYear.id),
                yearForm,
                { onSuccess: () => setShowYearModal(false) }
            );
        } else {
            router.post(route("admin.academic.school-years.store"), yearForm, {
                onSuccess: () => setShowYearModal(false),
            });
        }
    };

    const submitTrimestre = (e) => {
        e.preventDefault();

        if (editingTrimestre) {
            router.put(
                route("admin.academic.trimestres.update", editingTrimestre.id),
                trimestreForm,
                { onSuccess: () => setShowTrimestreModal(false) }
            );
        } else {
            router.post(route("admin.academic.trimestres.store"), trimestreForm, {
                onSuccess: () => setShowTrimestreModal(false),
            });
        }
    };

    const submitEvent = (e) => {
        e.preventDefault();

        if (editingEvent) {
            router.put(
                route("admin.academic.events.update", editingEvent.id),
                eventForm,
                { onSuccess: () => setShowEventModal(false) }
            );
        } else {
            router.post(route("admin.academic.events.store"), eventForm, {
                onSuccess: () => setShowEventModal(false),
            });
        }
    };

    const confirmDelete = () => {
        const { type, id } = deleteModal;

        let routeName = "";

        if (type === "year") routeName = "admin.academic.school-years.destroy";
        if (type === "trimestre") routeName = "admin.academic.trimestres.destroy";
        if (type === "event") routeName = "admin.academic.events.destroy";

        router.delete(route(routeName, id), {
            onSuccess: () =>
                setDeleteModal({
                    open: false,
                    type: null,
                    id: null,
                    title: "",
                }),
        });
    };

    const tabClass = (active) =>
        `inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition duration-200 ${
            active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        }`;

    const primaryButton =
        "inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700";

    const editButton =
        "rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white";

    const deleteButton =
        "rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white";

    const inputClass =
        "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Module Académique
                    </h2>
                    <p className="text-sm text-slate-500">
                        Gestion des années scolaires, trimestres et événements.
                    </p>
                </div>
            }
        >
            <Head title="Académique" />

            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20" />
                    <div className="absolute -bottom-10 left-20 h-32 w-32 rounded-full bg-white/10" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-black">
                                Organisation académique
                            </h1>
                            <p className="mt-2 max-w-2xl text-blue-100">
                                Configurez les années scolaires, les trimestres et le calendrier scolaire.
                            </p>
                        </div>

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                            <Calendar size={34} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                    <button
                        onClick={() => setTab("years")}
                        className={tabClass(tab === "years")}
                    >
                        <GraduationCap size={18} />
                        Années scolaires
                    </button>

                    <button
                        onClick={() => setTab("trimestres")}
                        className={tabClass(tab === "trimestres")}
                    >
                        <Layers size={18} />
                        Trimestres
                    </button>

                    <button
                        onClick={() => setTab("events")}
                        className={tabClass(tab === "events")}
                    >
                        <Calendar size={18} />
                        Calendrier scolaire
                    </button>
                </div>

                {tab === "years" && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800">
                                Années scolaires
                            </h2>

                            <button onClick={openYearCreate} className={primaryButton}>
                                <Plus size={18} />
                                Ajouter
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="rounded-l-2xl p-4 text-left text-sm font-bold text-slate-700">
                                            Année
                                        </th>
                                        <th className="rounded-r-2xl p-4 text-center text-sm font-bold text-slate-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {schoolYears.map((y) => (
                                        <tr
                                            key={y.id}
                                            className="border-b border-slate-100 hover:bg-slate-50"
                                        >
                                            <td className="p-4 font-medium text-slate-700">
                                                {y.year}
                                            </td>

                                            <td className="p-4">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => openYearEdit(y)}
                                                        className={editButton}
                                                    >
                                                        <Pencil size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            openDeleteModal("year", y.id, y.year)
                                                        }
                                                        className={deleteButton}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === "trimestres" && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">
                                    Trimestres par année scolaire
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Les trimestres sont classés selon leur année scolaire.
                                </p>
                            </div>

                            <button onClick={openTrimestreCreate} className={primaryButton}>
                                <Plus size={18} />
                                Ajouter
                            </button>
                        </div>

                        <div className="space-y-8">
                            {trimestresBySchoolYear.length > 0 ? (
                                trimestresBySchoolYear.map((year) => (
                                    <div
                                        key={year.id}
                                        className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
                                    >
                                        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                                                    <GraduationCap size={26} />
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-black">
                                                        Année scolaire {year.year}
                                                    </h3>

                                                    <p className="text-sm font-medium text-blue-100">
                                                        {year.trimestres.length} trimestre(s)
                                                        enregistré(s)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            {year.trimestres.length > 0 ? (
                                                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                                    {year.trimestres.map((t) => (
                                                        <div
                                                            key={t.id}
                                                            className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                                        >
                                                            <div className="flex justify-between gap-4">
                                                                <div>
                                                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                                                                        <Layers size={15} />
                                                                        Trimestre
                                                                    </div>

                                                                    <h3 className="text-lg font-black text-slate-800">
                                                                        {t.name}
                                                                    </h3>

                                                                    <p className="mt-1 text-sm font-semibold text-slate-500">
                                                                        {year.year}
                                                                    </p>

                                                                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                                                                        <p className="rounded-2xl bg-slate-50 px-3 py-2">
                                                                            <span className="font-bold text-slate-700">
                                                                                Début :
                                                                            </span>{" "}
                                                                            {t.start_date}
                                                                        </p>

                                                                        <p className="rounded-2xl bg-slate-50 px-3 py-2">
                                                                            <span className="font-bold text-slate-700">
                                                                                Fin :
                                                                            </span>{" "}
                                                                            {t.end_date}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            openTrimestreEdit(t)
                                                                        }
                                                                        className={editButton}
                                                                    >
                                                                        <Pencil size={18} />
                                                                    </button>

                                                                    <button
                                                                        onClick={() =>
                                                                            openDeleteModal(
                                                                                "trimestre",
                                                                                t.id,
                                                                                t.name
                                                                            )
                                                                        }
                                                                        className={deleteButton}
                                                                    >
                                                                        <Trash2 size={18} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
                                                    <p className="font-bold text-slate-700">
                                                        Aucun trimestre pour cette année scolaire.
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-400">
                                                        Cliquez sur “Ajouter” pour créer un trimestre.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                                    <p className="font-bold text-slate-700">
                                        Aucune année scolaire enregistrée.
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Créez d’abord une année scolaire avant d’ajouter les trimestres.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {tab === "events" && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-800">
                                Calendrier scolaire
                            </h2>

                            <button onClick={openEventCreate} className={primaryButton}>
                                <Plus size={18} />
                                Ajouter
                            </button>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {events.map((e) => (
                                <div
                                    key={e.id}
                                    className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-800">
                                                {e.title}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {e.school_year?.year}
                                            </p>

                                            {e.description && (
                                                <p className="mt-3 text-sm text-slate-500">
                                                    {e.description}
                                                </p>
                                            )}

                                            <div className="mt-4 space-y-1 text-sm text-slate-600">
                                                <p>Début : {e.start_date}</p>
                                                <p>Fin : {e.end_date || "-"}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEventEdit(e)}
                                                className={editButton}
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    openDeleteModal("event", e.id, e.title)
                                                }
                                                className={deleteButton}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showYearModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <ModalHeader
                            title={editingYear ? "Modifier année" : "Ajouter année"}
                            subtitle="Renseignez l’année scolaire."
                            onClose={() => setShowYearModal(false)}
                        />

                        <form onSubmit={submitYear} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Année scolaire
                                </label>
                                <input
                                    type="text"
                                    placeholder="2025-2026"
                                    className={inputClass}
                                    value={yearForm.year}
                                    onChange={(e) =>
                                        setYearForm({ ...yearForm, year: e.target.value })
                                    }
                                />
                            </div>

                            <ModalActions onCancel={() => setShowYearModal(false)} />
                        </form>
                    </div>
                </div>
            )}

            {showTrimestreModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <ModalHeader
                            title={editingTrimestre ? "Modifier trimestre" : "Ajouter trimestre"}
                            subtitle="Configurez les dates du trimestre."
                            onClose={() => setShowTrimestreModal(false)}
                        />

                        <form onSubmit={submitTrimestre} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Trimestre 1"
                                className={inputClass}
                                value={trimestreForm.name}
                                onChange={(e) =>
                                    setTrimestreForm({ ...trimestreForm, name: e.target.value })
                                }
                            />

                            <select
                                className={inputClass}
                                value={trimestreForm.school_year_id}
                                onChange={(e) =>
                                    setTrimestreForm({
                                        ...trimestreForm,
                                        school_year_id: e.target.value,
                                    })
                                }
                            >
                                <option value="">Année scolaire</option>
                                {schoolYears.map((y) => (
                                    <option key={y.id} value={y.id}>
                                        {y.year}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="date"
                                className={inputClass}
                                value={trimestreForm.start_date}
                                onChange={(e) =>
                                    setTrimestreForm({
                                        ...trimestreForm,
                                        start_date: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="date"
                                className={inputClass}
                                value={trimestreForm.end_date}
                                onChange={(e) =>
                                    setTrimestreForm({
                                        ...trimestreForm,
                                        end_date: e.target.value,
                                    })
                                }
                            />

                            <ModalActions onCancel={() => setShowTrimestreModal(false)} />
                        </form>
                    </div>
                </div>
            )}

            {showEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <ModalHeader
                            title={editingEvent ? "Modifier événement" : "Ajouter événement"}
                            subtitle="Ajoutez un événement au calendrier scolaire."
                            onClose={() => setShowEventModal(false)}
                        />

                        <form onSubmit={submitEvent} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Titre"
                                className={inputClass}
                                value={eventForm.title}
                                onChange={(e) =>
                                    setEventForm({ ...eventForm, title: e.target.value })
                                }
                            />

                            <textarea
                                placeholder="Description"
                                className={`${inputClass} min-h-24 resize-none`}
                                value={eventForm.description}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        description: e.target.value,
                                    })
                                }
                            />

                            <select
                                className={inputClass}
                                value={eventForm.school_year_id}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        school_year_id: e.target.value,
                                    })
                                }
                            >
                                <option value="">Année scolaire</option>
                                {schoolYears.map((y) => (
                                    <option key={y.id} value={y.id}>
                                        {y.year}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="date"
                                className={inputClass}
                                value={eventForm.start_date}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        start_date: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="date"
                                className={inputClass}
                                value={eventForm.end_date}
                                onChange={(e) =>
                                    setEventForm({
                                        ...eventForm,
                                        end_date: e.target.value,
                                    })
                                }
                            />

                            <ModalActions onCancel={() => setShowEventModal(false)} />
                        </form>
                    </div>
                </div>
            )}

            {deleteModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="p-6">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                                <AlertTriangle size={30} />
                            </div>

                            <h2 className="text-2xl font-black text-slate-800">
                                Confirmation suppression
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Voulez-vous vraiment supprimer :
                            </p>

                            <div className="mt-4 rounded-2xl bg-slate-100 p-4 font-bold text-slate-700">
                                {deleteModal.title}
                            </div>

                            <p className="mt-4 text-sm font-semibold text-red-500">
                                Cette action est irréversible.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 p-5">
                            <button
                                onClick={() =>
                                    setDeleteModal({
                                        open: false,
                                        type: null,
                                        id: null,
                                        title: "",
                                    })
                                }
                                className="rounded-2xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700"
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

function ModalHeader({ title, subtitle, onClose }) {
    return (
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
                className="rounded-xl bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
            >
                <X size={20} />
            </button>
        </div>
    );
}

function ModalActions({ onCancel }) {
    return (
        <div className="flex justify-end gap-3 pt-2">
            <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
            >
                Annuler
            </button>

            <button className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700">
                Valider
            </button>
        </div>
    );
}