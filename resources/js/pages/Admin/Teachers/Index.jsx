import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { router, Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    UserRound,
    Mail,
    BookOpen,
    GraduationCap,
    Layers,
    AlertTriangle,
    Tags,
} from "lucide-react";

export default function Index({
    teachers = {},
    subjects = [],
    sections = [],
    classes = [],
    series = [],
}) {
    const teacherItems = Array.isArray(teachers)
        ? teachers
        : teachers.data || [];

    const paginationLinks = Array.isArray(teachers)
        ? []
        : teachers.links || [];

    const totalTeachers = Array.isArray(teachers)
        ? teachers.length
        : teachers.total || 0;

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
    });

    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedClasse, setSelectedClasse] = useState("");
    const [selectedSections, setSelectedSections] = useState([]);
    const [selectedSeries, setSelectedSeries] = useState([]);

    const selectedClasseObject = useMemo(() => {
        return classes.find(
            (classe) => Number(classe.id) === Number(selectedClasse)
        );
    }, [classes, selectedClasse]);

    const isSecondeSelected = useMemo(() => {
        const name = selectedClasseObject?.name?.toLowerCase() || "";
        return name.includes("seconde");
    }, [selectedClasseObject]);

    const mustChooseSerie = selectedClasse && !isSecondeSelected;

    const toggleSubject = (id) => {
        const numericId = Number(id);

        setSelectedSubjects((prev) =>
            prev.includes(numericId)
                ? prev.filter((subjectId) => subjectId !== numericId)
                : [...prev, numericId]
        );
    };

    const selectClasse = (id) => {
        setSelectedClasse(id);
        setSelectedSeries([]);
    };

    const toggleSection = (id) => {
        const numericId = Number(id);

        setSelectedSections((prev) =>
            prev.includes(numericId)
                ? prev.filter((sectionId) => sectionId !== numericId)
                : [...prev, numericId]
        );
    };

    const toggleSerie = (id) => {
        const numericId = Number(id);

        setSelectedSeries((prev) =>
            prev.includes(numericId)
                ? prev.filter((serieId) => serieId !== numericId)
                : [...prev, numericId]
        );
    };

    const openCreate = () => {
        setEditing(null);

        setForm({
            name: "",
            email: "",
        });

        setSelectedSubjects([]);
        setSelectedClasse("");
        setSelectedSections([]);
        setSelectedSeries([]);
        setShowModal(true);
    };

    const openEdit = (teacher) => {
        setEditing(teacher);

        setForm({
            name: teacher.user?.name || "",
            email: teacher.user?.email || "",
        });

        const subjectIds = [
            ...new Set(
                teacher.teacher_subjects?.map((ts) => Number(ts.subject_id)) ||
                    []
            ),
        ];

        const sectionIds = [
            ...new Set(
                teacher.teacher_subjects?.map((ts) => Number(ts.section_id)) ||
                    []
            ),
        ];

        const serieIds = [
            ...new Set(
                teacher.teacher_subjects
                    ?.filter((ts) => ts.serie_id)
                    ?.map((ts) => Number(ts.serie_id)) || []
            ),
        ];

        const classeId = teacher.teacher_subjects?.[0]?.classe_id || "";

        setSelectedSubjects(subjectIds);
        setSelectedSections(sectionIds);
        setSelectedSeries(serieIds);
        setSelectedClasse(classeId);

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditing(null);

        setForm({
            name: "",
            email: "",
        });

        setSelectedSubjects([]);
        setSelectedClasse("");
        setSelectedSections([]);
        setSelectedSeries([]);
    };

    const submit = (e) => {
        e.preventDefault();

        if (
            !form.name ||
            !form.email ||
            !selectedClasse ||
            selectedSections.length === 0 ||
            selectedSubjects.length === 0
        ) {
            alert(
                "Veuillez remplir le nom, l’email, la classe, les sections et les matières."
            );
            return;
        }

        if (mustChooseSerie && selectedSeries.length === 0) {
            alert("Veuillez choisir au moins une série pour cette classe.");
            return;
        }

        const assignments = [];

        selectedSubjects.forEach((subject_id) => {
            selectedSections.forEach((section_id) => {
                if (isSecondeSelected) {
                    assignments.push({
                        subject_id,
                        classe_id: selectedClasse,
                        serie_id: null,
                        section_id,
                    });
                } else {
                    selectedSeries.forEach((serie_id) => {
                        assignments.push({
                            subject_id,
                            classe_id: selectedClasse,
                            serie_id,
                            section_id,
                        });
                    });
                }
            });
        });

        const payload = {
            name: form.name,
            email: form.email,
            assignments,
        };

        if (editing) {
            router.put(`/admin/teachers/${editing.id}`, payload, {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        } else {
            router.post("/admin/teachers", payload, {
                preserveScroll: true,
                onSuccess: closeModal,
            });
        }
    };

    const confirmDelete = (teacher) => {
        setTeacherToDelete(teacher);
        setShowDeleteModal(true);
    };

    const deleteTeacher = () => {
        if (!teacherToDelete) return;

        router.delete(`/admin/teachers/${teacherToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setTeacherToDelete(null);
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
                        Enseignants
                    </h2>

                    <p className="text-sm text-slate-500">
                        Gestion des enseignants et affectations.
                    </p>
                </div>
            }
        >
            <Head title="Enseignants" />

            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-violet-700 p-6 text-white shadow-xl">
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/20" />
                    <div className="absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-white/10" />

                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black">
                                Gestion des enseignants
                            </h1>

                            <p className="mt-2 max-w-2xl text-blue-100">
                                Organisez les enseignants, matières, classes,
                                séries et sections.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openCreate}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                        >
                            <Plus size={18} />
                            Ajouter
                        </button>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard
                        icon={<UserRound size={28} />}
                        label="Enseignants"
                        value={totalTeachers}
                        color="blue"
                    />

                    <StatCard
                        icon={<BookOpen size={28} />}
                        label="Matières"
                        value={subjects.length}
                        color="violet"
                    />

                    <StatCard
                        icon={<GraduationCap size={28} />}
                        label="Classes"
                        value={classes.length}
                        color="emerald"
                    />

                    <StatCard
                        icon={<Tags size={28} />}
                        label="Séries"
                        value={series.length}
                        color="rose"
                    />

                    <StatCard
                        icon={<Layers size={28} />}
                        label="Sections"
                        value={sections.length}
                        color="amber"
                    />
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex flex-col gap-2 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">
                                Liste des enseignants
                            </h2>

                            <p className="text-sm text-slate-500">
                                Toutes les affectations enregistrées.
                            </p>
                        </div>

                        {!Array.isArray(teachers) && (
                            <div className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
                                Page {teachers.current_page} / {teachers.last_page}
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Enseignant
                                    </th>

                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Email
                                    </th>

                                    <th className="p-4 text-left text-sm font-bold text-slate-600">
                                        Affectations
                                    </th>

                                    <th className="p-4 text-center text-sm font-bold text-slate-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {teacherItems.map((teacher) => (
                                    <tr
                                        key={teacher.id}
                                        className="border-t border-slate-100 transition hover:bg-slate-50"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <UserRound size={20} />
                                                </div>

                                                <span className="font-bold text-slate-800">
                                                    {teacher.user?.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Mail
                                                    size={16}
                                                    className="text-slate-400"
                                                />
                                                {teacher.user?.email}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <TeacherAssignments
                                                teacher={teacher}
                                            />
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEdit(teacher)
                                                    }
                                                    className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        confirmDelete(teacher)
                                                    }
                                                    className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-600 hover:text-white"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {teacherItems.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="p-10 text-center text-slate-500"
                                        >
                                            Aucun enseignant enregistré.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {paginationLinks.length > 3 && (
                        <Pagination links={paginationLinks} />
                    )}
                </div>

                {showModal && (
                    <ModalPortal>
                        <div
                            className="fixed inset-0 z-[9999] flex min-h-screen items-start justify-center overflow-y-auto bg-slate-950/70 px-4 pt-6 pb-10 backdrop-blur-md"
                            onClick={closeModal}
                        >
                            <div
                                className="relative mt-4 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl shadow-slate-950/30"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

                                <form onSubmit={submit} className="p-6 sm:p-7">
                                    <div className="mb-6 flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-800">
                                                {editing
                                                    ? "Modifier enseignant"
                                                    : "Ajouter enseignant"}
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Pour Seconde : section
                                                seulement. Pour Première et
                                                Terminale : section + série.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={closeModal}
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
                                    </div>

                                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                        <h3 className="font-black text-slate-800">
                                            Classe
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Choisissez d’abord la classe pour
                                            afficher les options adaptées.
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {classes.map((classe) => (
                                                <ChoiceButton
                                                    key={classe.id}
                                                    active={
                                                        Number(
                                                            selectedClasse
                                                        ) === Number(classe.id)
                                                    }
                                                    color="blue"
                                                    onClick={() =>
                                                        selectClasse(classe.id)
                                                    }
                                                >
                                                    {classe.name}
                                                </ChoiceButton>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                        <h3 className="font-black text-slate-800">
                                            Sections
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Vous pouvez choisir une ou plusieurs
                                            sections.
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {sections.map((section) => (
                                                <ChoiceButton
                                                    key={section.id}
                                                    active={selectedSections.includes(
                                                        Number(section.id)
                                                    )}
                                                    color="emerald"
                                                    onClick={() =>
                                                        toggleSection(
                                                            section.id
                                                        )
                                                    }
                                                >
                                                    {section.name}
                                                </ChoiceButton>
                                            ))}
                                        </div>
                                    </div>

                                    {mustChooseSerie && (
                                        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                            <h3 className="font-black text-slate-800">
                                                Séries
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                La série est obligatoire pour{" "}
                                                {selectedClasseObject?.name}.
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {series.map((serie) => (
                                                    <ChoiceButton
                                                        key={serie.id}
                                                        active={selectedSeries.includes(
                                                            Number(serie.id)
                                                        )}
                                                        color="rose"
                                                        onClick={() =>
                                                            toggleSerie(
                                                                serie.id
                                                            )
                                                        }
                                                    >
                                                        {serie.name}
                                                    </ChoiceButton>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedClasse && isSecondeSelected && (
                                        <div className="mt-5 rounded-3xl border border-blue-200 bg-blue-50 p-4">
                                            <h3 className="font-black text-blue-800">
                                                Classe Seconde
                                            </h3>

                                            <p className="mt-1 text-sm font-semibold text-blue-600">
                                                Pour la classe Seconde, aucune
                                                série n’est nécessaire.
                                                Choisissez seulement les
                                                sections et les matières.
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                        <h3 className="font-black text-slate-800">
                                            Matières
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Vous pouvez choisir une ou plusieurs
                                            matières.
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {subjects.map((subject) => (
                                                <ChoiceButton
                                                    key={subject.id}
                                                    active={selectedSubjects.includes(
                                                        Number(subject.id)
                                                    )}
                                                    color="violet"
                                                    onClick={() =>
                                                        toggleSubject(
                                                            subject.id
                                                        )
                                                    }
                                                >
                                                    {subject.name}
                                                </ChoiceButton>
                                            ))}
                                        </div>
                                    </div>

                                    <AssignmentPreview
                                        selectedSubjects={selectedSubjects}
                                        selectedSections={selectedSections}
                                        selectedSeries={selectedSeries}
                                        selectedClasse={selectedClasse}
                                        subjects={subjects}
                                        sections={sections}
                                        series={series}
                                        classes={classes}
                                        isSecondeSelected={isSecondeSelected}
                                    />

                                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={closeModal}
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

                {showDeleteModal && (
                    <ModalPortal>
                        <div
                            className="fixed inset-0 z-[9999] flex min-h-screen items-start justify-center overflow-y-auto bg-slate-950/70 px-4 pt-10 pb-10 backdrop-blur-md"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            <div
                                className="relative mt-4 w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white p-7 text-center shadow-2xl shadow-slate-950/30"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-red-500 to-orange-500" />

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-600 shadow-inner">
                                    <AlertTriangle size={34} />
                                </div>

                                <h2 className="text-2xl font-black text-slate-800">
                                    Supprimer ?
                                </h2>

                                <p className="mt-3 text-slate-500">
                                    Voulez-vous vraiment supprimer :
                                </p>

                                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-black text-slate-800">
                                    {teacherToDelete?.user?.name}
                                </div>

                                <p className="mt-3 text-sm font-semibold text-red-500">
                                    Cette action supprimera aussi ses
                                    affectations.
                                </p>

                                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowDeleteModal(false)
                                        }
                                        className="rounded-2xl bg-slate-100 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="button"
                                        onClick={deleteTeacher}
                                        className="rounded-2xl bg-red-600 px-6 py-3 font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700"
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

function Pagination({ links }) {
    return (
        <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-500">
                Navigation des pages
            </p>

            <div className="flex flex-wrap gap-2">
                {links.map((link, index) => {
                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-400"
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                link.active
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                            dangerouslySetInnerHTML={{
                                __html: link.label,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function AssignmentPreview({
    selectedSubjects,
    selectedSections,
    selectedSeries,
    selectedClasse,
    subjects,
    sections,
    series,
    classes,
    isSecondeSelected,
}) {
    if (
        !selectedClasse ||
        selectedSubjects.length === 0 ||
        selectedSections.length === 0
    ) {
        return null;
    }

    if (!isSecondeSelected && selectedSeries.length === 0) {
        return null;
    }

    const classe = classes.find(
        (item) => Number(item.id) === Number(selectedClasse)
    );

    const subjectNames = subjects
        .filter((item) => selectedSubjects.includes(Number(item.id)))
        .map((item) => item.name);

    const sectionNames = sections
        .filter((item) => selectedSections.includes(Number(item.id)))
        .map((item) => item.name);

    const serieNames = series
        .filter((item) => selectedSeries.includes(Number(item.id)))
        .map((item) => item.name);

    return (
        <div className="mt-5 rounded-3xl border border-indigo-200 bg-indigo-50 p-4">
            <h3 className="font-black text-indigo-800">
                Aperçu des affectations
            </h3>

            <div className="mt-3 space-y-2 text-sm font-semibold text-indigo-700">
                <p>
                    Classe :{" "}
                    <span className="font-black">
                        {classe?.name || "Non définie"}
                    </span>
                </p>

                <p>
                    Sections :{" "}
                    <span className="font-black">
                        {sectionNames.join(", ")}
                    </span>
                </p>

                {!isSecondeSelected && (
                    <p>
                        Séries :{" "}
                        <span className="font-black">
                            {serieNames.join(", ")}
                        </span>
                    </p>
                )}

                <p>
                    Matières :{" "}
                    <span className="font-black">
                        {subjectNames.join(", ")}
                    </span>
                </p>
            </div>
        </div>
    );
}

function TeacherAssignments({ teacher }) {
    if (!teacher.teacher_subjects?.length) {
        return (
            <span className="inline-flex rounded-xl bg-slate-100 px-3 py-1 text-sm font-bold text-slate-500">
                Aucune
            </span>
        );
    }

    const grouped = {};

    teacher.teacher_subjects.forEach((ts) => {
        const serieName = ts.serie?.name || "Sans série";
        const key = `${ts.subject?.name}-${ts.classe?.name}-${serieName}`;

        if (!grouped[key]) {
            grouped[key] = {
                subject: ts.subject?.name,
                classe: ts.classe?.name,
                serie: ts.serie?.name,
                sections: [],
            };
        }

        if (
            ts.section?.name &&
            !grouped[key].sections.includes(ts.section.name)
        ) {
            grouped[key].sections.push(ts.section.name);
        }
    });

    return (
        <div className="flex flex-wrap gap-2">
            {Object.values(grouped).map((group, index) => (
                <span
                    key={index}
                    className="inline-flex rounded-xl bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700"
                >
                    {group.subject} • {group.classe}
                    {group.serie ? ` • Série ${group.serie}` : ""}
                    {" — Sections "}
                    {group.sections.join(", ")}
                </span>
            ))}
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        violet: "bg-violet-50 text-violet-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600",
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

function ChoiceButton({ active, onClick, color, children }) {
    const activeColors = {
        blue: "border-blue-600 bg-blue-600 text-white",
        emerald: "border-emerald-600 bg-emerald-600 text-white",
        violet: "border-violet-600 bg-violet-600 text-white",
        rose: "border-rose-600 bg-rose-600 text-white",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-2xl border px-4 py-2 text-sm font-bold transition ${
                active
                    ? activeColors[color]
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
        >
            {children}
        </button>
    );
}