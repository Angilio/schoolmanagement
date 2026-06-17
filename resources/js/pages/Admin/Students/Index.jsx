import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { router, Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Users,
    GraduationCap,
    Layers,
    BookOpen,
    Mail,
    Calendar,
    IdCard,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function Index({
    students = [],
    classes = [],
    sections = [],
    series = [],
}) {
    const ITEMS_PER_PAGE = 20;

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [studentToDelete, setStudentToDelete] = useState(null);

    const [selectedClasse, setSelectedClasse] = useState("all");
    const [selectedSection, setSelectedSection] = useState("all");
    const [selectedSerie, setSelectedSerie] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [form, setForm] = useState({
        name: "",
        email: "",
        classe_id: "",
        section_id: "",
        serie_id: "",
        birthdate: "",
    });

    const openCreate = () => {
        setEditing(null);
        setForm({
            name: "",
            email: "",
            classe_id: "",
            section_id: "",
            serie_id: "",
            birthdate: "",
        });
        setShowModal(true);
    };

    const openEdit = (s) => {
        setEditing(s);
        setForm({
            name: s.user?.name ?? "",
            email: s.user?.email ?? "",
            classe_id: s.classe_id ?? "",
            section_id: s.section_id ?? "",
            serie_id: s.serie_id ?? "",
            birthdate: s.birthdate ?? "",
        });
        setShowModal(true);
    };

    const isSecondeSelected = useMemo(() => {
        const classe = classes.find((c) => c.id == form.classe_id);
        return classe?.name?.toLowerCase().includes("seconde");
    }, [classes, form.classe_id]);

    const filteredStudents = useMemo(() => {
        return students.filter((s) => {
            const matchClasse =
                selectedClasse === "all" || s.classe_id == selectedClasse;

            const matchSection =
                selectedSection === "all" || s.section_id == selectedSection;

            const matchSerie =
                selectedSerie === "all" ||
                (selectedSerie === "none" && !s.serie_id) ||
                s.serie_id == selectedSerie;

            return matchClasse && matchSection && matchSerie;
        });
    }, [students, selectedClasse, selectedSection, selectedSerie]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedStudents = useMemo(() => {
        const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        return filteredStudents.slice(start, end);
    }, [filteredStudents, safeCurrentPage]);

    const firstItemNumber =
        filteredStudents.length === 0
            ? 0
            : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;

    const lastItemNumber = Math.min(
        safeCurrentPage * ITEMS_PER_PAGE,
        filteredStudents.length
    );

    const changeClasseFilter = (value) => {
        setSelectedClasse(value);
        setCurrentPage(1);
    };

    const changeSectionFilter = (value) => {
        setSelectedSection(value);
        setCurrentPage(1);
    };

    const changeSerieFilter = (value) => {
        setSelectedSerie(value);
        setCurrentPage(1);
    };

    const submit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            serie_id: isSecondeSelected ? "" : form.serie_id,
        };

        if (editing) {
            router.put(`/admin/students/${editing.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => setShowModal(false),
            });
        } else {
            router.post("/admin/students", payload, {
                preserveScroll: true,
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const deleteStudent = () => {
        if (!studentToDelete) return;

        router.delete(`/admin/students/${studentToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => setStudentToDelete(null),
        });
    };

    const resetFilters = () => {
        setSelectedClasse("all");
        setSelectedSection("all");
        setSelectedSerie("all");
        setCurrentPage(1);
    };

    const inputClass =
        "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Élèves
                    </h2>
                    <p className="text-sm text-slate-500">
                        Gestion des élèves, classes, sections et séries.
                    </p>
                </div>
            }
        >
            <Head title="Élèves" />

            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-violet-700 p-6 text-white shadow-xl">
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/20" />
                    <div className="absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-white/10" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black">
                                Gestion des élèves
                            </h1>
                            <p className="mt-2 max-w-2xl text-blue-100">
                                Ajoutez, modifiez et filtrez les élèves par
                                classe, section ou série.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openCreate}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                        >
                            <Plus size={18} />
                            Ajouter un élève
                        </button>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={<Users size={28} />}
                        label="Total élèves"
                        value={students.length}
                        color="blue"
                    />

                    <StatCard
                        icon={<Users size={28} />}
                        label="Résultat filtré"
                        value={filteredStudents.length}
                        color="emerald"
                    />

                    <StatCard
                        icon={<GraduationCap size={28} />}
                        label="Classes"
                        value={classes.length}
                        color="violet"
                    />

                    <StatCard
                        icon={<Layers size={28} />}
                        label="Sections"
                        value={sections.length}
                        color="amber"
                    />
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <BookOpen size={22} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-800">
                                    Filtres rapides
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Affinez la liste par classe, section ou
                                    série.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
                        >
                            Réinitialiser
                        </button>
                    </div>

                    <FilterGroup title="Classes">
                        <FilterButton
                            active={selectedClasse === "all"}
                            onClick={() => changeClasseFilter("all")}
                            color="blue"
                        >
                            Toutes classes
                        </FilterButton>

                        {classes.map((c) => (
                            <FilterButton
                                key={c.id}
                                active={selectedClasse == c.id}
                                onClick={() => changeClasseFilter(c.id)}
                                color="blue"
                            >
                                {c.name}
                            </FilterButton>
                        ))}
                    </FilterGroup>

                    <FilterGroup title="Sections">
                        <FilterButton
                            active={selectedSection === "all"}
                            onClick={() => changeSectionFilter("all")}
                            color="emerald"
                        >
                            Toutes sections
                        </FilterButton>

                        {sections.map((s) => (
                            <FilterButton
                                key={s.id}
                                active={selectedSection == s.id}
                                onClick={() => changeSectionFilter(s.id)}
                                color="emerald"
                            >
                                {s.name}
                            </FilterButton>
                        ))}
                    </FilterGroup>

                    <FilterGroup title="Séries">
                        <FilterButton
                            active={selectedSerie === "all"}
                            onClick={() => changeSerieFilter("all")}
                            color="violet"
                        >
                            Toutes séries
                        </FilterButton>

                        <FilterButton
                            active={selectedSerie === "none"}
                            onClick={() => changeSerieFilter("none")}
                            color="violet"
                        >
                            Sans série
                        </FilterButton>

                        {series.map((s) => (
                            <FilterButton
                                key={s.id}
                                active={selectedSerie == s.id}
                                onClick={() => changeSerieFilter(s.id)}
                                color="violet"
                            >
                                {s.name}
                            </FilterButton>
                        ))}
                    </FilterGroup>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">
                                Liste des élèves
                            </h2>
                            <p className="text-sm text-slate-500">
                                {filteredStudents.length} élève(s) trouvé(s).
                                Affichage de {firstItemNumber} à{" "}
                                {lastItemNumber}.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
                            Page {safeCurrentPage} / {totalPages}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Élève
                                    </th>
                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Email
                                    </th>
                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Classe
                                    </th>
                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Matricule
                                    </th>
                                    <th className="p-4 text-center text-sm font-bold text-slate-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedStudents.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="border-t border-slate-100 transition hover:bg-slate-50"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <Users size={20} />
                                                </div>
                                                <span className="font-bold text-slate-800">
                                                    {s.user?.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Mail
                                                    size={16}
                                                    className="text-slate-400"
                                                />
                                                {s.user?.email}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className="inline-flex rounded-xl bg-indigo-50 px-3 py-1 text-sm font-black text-indigo-700">
                                                {s.classe?.name || "-"}{" "}
                                                {s.serie?.name || ""}{" "}
                                                {s.section?.name || ""}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-2 font-semibold text-slate-600">
                                                <IdCard
                                                    size={16}
                                                    className="text-slate-400"
                                                />
                                                {s.matricule}
                                            </div>
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
                                                    onClick={() =>
                                                        setStudentToDelete(s)
                                                    }
                                                    className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {paginatedStudents.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="p-10 text-center text-slate-500"
                                        >
                                            Aucun élève trouvé avec ces filtres.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length > ITEMS_PER_PAGE && (
                        <Pagination
                            currentPage={safeCurrentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>

                {showModal && (
                    <ModalPortal>
                        <div
                            className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-md"
                            onClick={() => setShowModal(false)}
                        >
                            <div
                                className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl shadow-slate-950/30"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

                                <form onSubmit={submit} className="p-6 sm:p-7">
                                    <div className="mb-6 flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-800">
                                                {editing
                                                    ? "Modifier élève"
                                                    : "Ajouter élève"}
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Renseignez les informations de
                                                l’élève.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowModal(false)
                                            }
                                            className="shrink-0 rounded-2xl bg-slate-100 p-2 text-slate-500 transition hover:rotate-90 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <input
                                            className={inputClass}
                                            placeholder="Nom complet"
                                            value={form.name}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    name: e.target.value,
                                                })
                                            }
                                        />

                                        <input
                                            className={inputClass}
                                            placeholder="Email"
                                            value={form.email}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    email: e.target.value,
                                                })
                                            }
                                        />

                                        <div className="relative md:col-span-2">
                                            <Calendar
                                                size={18}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />
                                            <input
                                                type="date"
                                                className={`${inputClass} pl-11`}
                                                value={form.birthdate}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        birthdate:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <select
                                            className={inputClass}
                                            value={form.classe_id}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    classe_id: e.target.value,
                                                    serie_id: "",
                                                })
                                            }
                                        >
                                            <option value="">Classe</option>
                                            {classes.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            className={inputClass}
                                            value={form.section_id}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    section_id: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Section</option>
                                            {sections.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>

                                        {form.classe_id && !isSecondeSelected && (
                                            <select
                                                className={`${inputClass} md:col-span-2`}
                                                value={form.serie_id}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        serie_id:
                                                            e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="">
                                                    Série facultative
                                                </option>
                                                {series.map((s) => (
                                                    <option
                                                        key={s.id}
                                                        value={s.id}
                                                    >
                                                        {s.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        {isSecondeSelected && (
                                            <div className="md:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                                                La classe Seconde n’a pas de
                                                série.
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowModal(false)
                                            }
                                            className="rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                                        >
                                            Annuler
                                        </button>

                                        <button
                                            type="submit"
                                            className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
                                        >
                                            {editing ? "Modifier" : "Créer"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </ModalPortal>
                )}

                {studentToDelete && (
                    <ModalPortal>
                        <div
                            className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-md"
                            onClick={() => setStudentToDelete(null)}
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
                                    Supprimer cet élève ?
                                </h2>

                                <p className="mt-3 text-slate-500">
                                    Voulez-vous vraiment supprimer cet élève ?
                                </p>

                                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-black text-slate-800">
                                    {studentToDelete.user?.name}
                                </div>

                                <p className="mt-4 text-sm font-semibold text-red-500">
                                    Cette action est irréversible.
                                </p>

                                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStudentToDelete(null)
                                        }
                                        className="rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="button"
                                        onClick={deleteStudent}
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

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-500">
                20 élèves par page
            </p>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={16} />
                    Précédent
                </button>

                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                            currentPage === page
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Suivant
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        violet: "bg-violet-50 text-violet-600",
        amber: "bg-amber-50 text-amber-600",
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

function FilterGroup({ title, children }) {
    return (
        <div className="mb-4 last:mb-0">
            <p className="mb-2 text-sm font-black uppercase tracking-wide text-slate-500">
                {title}
            </p>
            <div className="flex flex-wrap gap-2">
                {children}
            </div>
        </div>
    );
}

function FilterButton({ active, onClick, color, children }) {
    const activeClasses = {
        blue: "border-blue-600 bg-blue-600 text-white shadow-blue-600/25",
        emerald:
            "border-emerald-600 bg-emerald-600 text-white shadow-emerald-600/25",
        violet:
            "border-violet-600 bg-violet-600 text-white shadow-violet-600/25",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-2xl border px-4 py-2 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 ${
                active
                    ? activeClasses[color]
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
            }`}
        >
            {children}
        </button>
    );
}