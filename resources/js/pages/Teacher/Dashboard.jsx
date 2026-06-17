import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import {
    BookOpen,
    CalendarDays,
    ClipboardList,
    GraduationCap,
    Layers,
    School,
    UserRound,
    Clock,
    CheckCircle2,
} from "lucide-react";

export default function Dashboard({
    teacher,
    stats,
    classes = [],
    subjects = [],
    openEvaluations = [],
    closedEvaluations = [],
}) {
    const teacherName = teacher?.user?.name || "Enseignant";

    const getTrimestreLabel = (evaluation) => {
        const trimestre = evaluation.trimestre;
        const year = trimestre?.school_year?.year || trimestre?.schoolYear?.year;

        if (!trimestre) {
            return "Trimestre non défini";
        }

        return year
            ? `${trimestre.name} • ${year}`
            : trimestre.name || `Trimestre ${trimestre.id}`;
    };

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Dashboard Enseignant
                    </h2>

                    <p className="text-sm text-slate-500">
                        Vue générale de vos classes, matières et évaluations.
                    </p>
                </div>
            }
        >
            <Head title="Dashboard Enseignant" />

            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-xl">
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20" />
                    <div className="absolute -bottom-14 left-24 h-40 w-40 rounded-full bg-white/10" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
                                <UserRound size={17} />
                                Espace enseignant
                            </div>

                            <h1 className="text-3xl font-black">
                                Bonjour, {teacherName}
                            </h1>

                            <p className="mt-2 max-w-2xl text-emerald-50">
                                Retrouvez ici les classes qui vous sont attribuées,
                                vos matières et les évaluations ouvertes pour la
                                saisie des notes.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
                            <p className="text-sm font-semibold text-emerald-50">
                                Affectations actives
                            </p>
                            <p className="mt-1 text-4xl font-black">
                                {stats.assignments}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard
                        icon={<School size={28} />}
                        label="Classes"
                        value={stats.classes}
                        color="emerald"
                    />

                    <StatCard
                        icon={<BookOpen size={28} />}
                        label="Matières"
                        value={stats.subjects}
                        color="blue"
                    />

                    <StatCard
                        icon={<Layers size={28} />}
                        label="Sections"
                        value={stats.sections}
                        color="amber"
                    />

                    <StatCard
                        icon={<ClipboardList size={28} />}
                        label="Affectations"
                        value={stats.assignments}
                        color="violet"
                    />

                    <StatCard
                        icon={<Clock size={28} />}
                        label="Évaluations ouvertes"
                        value={stats.openEvaluations}
                        color="rose"
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">
                                    Mes classes attribuées
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Classes, sections, séries et matières confiées.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                                <GraduationCap size={24} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {classes.length > 0 ? (
                                classes.map((classe) => (
                                    <div
                                        key={classe.id}
                                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-800">
                                                    {classe.name}
                                                </h3>

                                                <p className="mt-1 text-sm font-semibold text-slate-500">
                                                    Sections :{" "}
                                                    <span className="text-slate-700">
                                                        {classe.sections.length > 0
                                                            ? classe.sections.join(", ")
                                                            : "Aucune"}
                                                    </span>
                                                </p>

                                                {classe.series.length > 0 && (
                                                    <p className="mt-1 text-sm font-semibold text-slate-500">
                                                        Séries :{" "}
                                                        <span className="text-slate-700">
                                                            {classe.series.join(", ")}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>

                                            <span className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-emerald-700 shadow-sm">
                                                {classe.subjects.length} matière(s)
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {classe.subjects.map((subject) => (
                                                <span
                                                    key={subject}
                                                    className="rounded-xl bg-white px-3 py-1 text-xs font-black text-slate-600 shadow-sm"
                                                >
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState text="Aucune classe ne vous est encore attribuée." />
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">
                                    Mes matières
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Matières que vous enseignez.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                                <BookOpen size={24} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {subjects.length > 0 ? (
                                subjects.map((subject) => (
                                    <div
                                        key={subject.id}
                                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <div>
                                            <p className="font-black text-slate-800">
                                                {subject.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Coefficient : {subject.coefficient}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-700">
                                                {subject.classes_count} classe(s)
                                            </p>
                                            <p className="text-xs font-semibold text-slate-400">
                                                {subject.sections_count} section(s)
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState text="Aucune matière attribuée." />
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <EvaluationPanel
                        title="Évaluations ouvertes"
                        subtitle="Vous pourrez saisir les notes jusqu’à la date limite."
                        evaluations={openEvaluations}
                        icon={<CheckCircle2 size={24} />}
                        tone="emerald"
                        getTrimestreLabel={getTrimestreLabel}
                    />

                    <EvaluationPanel
                        title="Évaluations clôturées"
                        subtitle="La saisie des notes est terminée pour ces évaluations."
                        evaluations={closedEvaluations}
                        icon={<Clock size={24} />}
                        tone="amber"
                        getTrimestreLabel={getTrimestreLabel}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        emerald: "bg-emerald-50 text-emerald-600",
        blue: "bg-blue-50 text-blue-600",
        amber: "bg-amber-50 text-amber-600",
        violet: "bg-violet-50 text-violet-600",
        rose: "bg-rose-50 text-rose-600",
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
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

                    <p className="text-3xl font-black text-slate-800">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function EvaluationPanel({
    title,
    subtitle,
    evaluations,
    icon,
    tone,
    getTrimestreLabel,
}) {
    const tones = {
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-800">
                        {title}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {subtitle}
                    </p>
                </div>

                <div className={`rounded-2xl p-3 ${tones[tone]}`}>
                    {icon}
                </div>
            </div>

            <div className="space-y-3">
                {evaluations.length > 0 ? (
                    evaluations.map((evaluation) => (
                        <div
                            key={evaluation.id}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-black text-slate-800">
                                        {evaluation.title}
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-500">
                                        {getTrimestreLabel(evaluation)}
                                    </p>
                                </div>

                                <span className="rounded-xl bg-white px-3 py-1 text-xs font-black text-slate-500">
                                    Notes jusqu’au {evaluation.grade_entry_deadline}
                                </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                                <span className="rounded-xl bg-blue-50 px-3 py-1 text-blue-700">
                                    Début : {evaluation.start_date}
                                </span>

                                <span className="rounded-xl bg-indigo-50 px-3 py-1 text-indigo-700">
                                    Fin : {evaluation.end_date}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState text="Aucune évaluation à afficher." />
                )}
            </div>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="font-bold text-slate-600">
                {text}
            </p>
        </div>
    );
}