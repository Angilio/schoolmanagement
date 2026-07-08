import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Award,
    BookOpen,
    Eye,
    FileText,
    GraduationCap,
    School,
    TrendingUp,
    UserRound,
    Users,
} from "lucide-react";

export default function Dashboard({
    parent = {},
    students = [],
    bulletins = [],
    stats = {},
}) {
    const formatAverage = (value) => {
        if (value === null || value === undefined || value === "") {
            return "-";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return value;
        }

        return number.toFixed(2);
    };

    const getStudentClass = (student) => {
        return [
            student?.classe?.name,
            student?.serie?.name ? `Série ${student.serie.name}` : null,
            student?.section?.name ? `Section ${student.section.name}` : null,
        ]
            .filter(Boolean)
            .join(" - ");
    };

    const getTrimestreLabel = (trimestre) => {
        const year =
            trimestre?.school_year?.year ||
            trimestre?.schoolYear?.year;

        return `${trimestre?.name || trimestre?.title || "Trimestre"}${
            year ? ` - ${year}` : ""
        }`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Espace Parent
                    </h2>

                    <p className="text-sm text-slate-500">
                        Suivi scolaire de vos enfants.
                    </p>
                </div>
            }
        >
            <Head title="Espace Parent" />

            <div className="space-y-8 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-violet-700 p-6 text-white shadow-xl">
                        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/20" />
                        <div className="absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-white/10" />

                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                                    <Users size={18} />
                                    Tableau de bord parent
                                </div>

                                <h1 className="text-3xl font-black">
                                    Bonjour {parent?.name || "Parent"}
                                </h1>

                                <p className="mt-2 max-w-3xl text-blue-100">
                                    Retrouvez ici les élèves liés à votre compte,
                                    leurs bulletins et leurs résultats récents.
                                </p>
                            </div>

                            <div className="rounded-3xl bg-white/15 p-5 text-center backdrop-blur">
                                <p className="text-sm font-semibold text-white/80">
                                    Moyenne globale
                                </p>

                                <p className="text-4xl font-black">
                                    {formatAverage(stats.average)}
                                </p>

                                <p className="text-sm font-bold text-white/80">
                                    /20
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        <StatCard
                            icon={<Users size={28} />}
                            label="Enfants suivis"
                            value={stats.children_count || 0}
                            color="blue"
                        />

                        <StatCard
                            icon={<FileText size={28} />}
                            label="Bulletins disponibles"
                            value={stats.bulletins_count || 0}
                            color="emerald"
                        />

                        <StatCard
                            icon={<TrendingUp size={28} />}
                            label="Moyenne globale"
                            value={`${formatAverage(stats.average)}/20`}
                            color="violet"
                        />
                    </div>

                    <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                        <div className="border-b border-slate-200 p-6">
                            <h2 className="text-xl font-black text-slate-800">
                                Mes enfants
                            </h2>

                            <p className="text-sm text-slate-500">
                                Liste des élèves associés à votre compte parent.
                            </p>
                        </div>

                        <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                            <UserRound size={28} />
                                        </div>

                                        <div>
                                            <p className="text-lg font-black text-slate-800">
                                                {student?.user?.name || "Élève"}
                                            </p>

                                            <p className="text-sm font-semibold text-slate-500">
                                                Matricule :{" "}
                                                {student?.matricule || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 space-y-3">
                                        <InfoLine
                                            icon={<School size={17} />}
                                            label="Classe"
                                            value={getStudentClass(student) || "-"}
                                        />

                                        <InfoLine
                                            icon={<GraduationCap size={17} />}
                                            label="Statut"
                                            value="Élève actif"
                                        />
                                    </div>
                                </div>
                            ))}

                            {students.length === 0 && (
                                <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                                    <p className="font-black text-slate-700">
                                        Aucun élève n’est encore lié à ce compte parent.
                                    </p>

                                    <p className="mt-2 text-sm text-slate-500">
                                        L’administration doit associer vos enfants à votre compte.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                        <div className="border-b border-slate-200 p-6">
                            <h2 className="text-xl font-black text-slate-800">
                                Bulletins récents
                            </h2>

                            <p className="text-sm text-slate-500">
                                Les derniers bulletins disponibles pour vos enfants.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100 text-sm text-slate-600">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">
                                            Élève
                                        </th>

                                        <th className="px-6 py-4 font-bold">
                                            Classe
                                        </th>

                                        <th className="px-6 py-4 font-bold">
                                            Trimestre
                                        </th>

                                        <th className="px-6 py-4 font-bold">
                                            Moyenne
                                        </th>

                                        <th className="px-6 py-4 font-bold">
                                            Rang
                                        </th>

                                        <th className="px-6 py-4 text-right font-bold">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {bulletins.map((bulletin) => (
                                        <tr
                                            key={bulletin.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                                        <BookOpen size={20} />
                                                    </div>

                                                    <div>
                                                        <p className="font-black text-slate-800">
                                                            {
                                                                bulletin.student
                                                                    ?.user?.name
                                                            }
                                                        </p>

                                                        <p className="text-sm text-slate-400">
                                                            {
                                                                bulletin.student
                                                                    ?.matricule
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 font-bold text-slate-600">
                                                {getStudentClass(
                                                    bulletin.student
                                                ) || "-"}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-xl bg-violet-50 px-3 py-1 text-sm font-bold text-violet-700">
                                                    {getTrimestreLabel(
                                                        bulletin.trimestre
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-xl bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                                                    {formatAverage(
                                                        bulletin.moyenne
                                                    )}
                                                    /20
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-xl bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">
                                                    {bulletin.rang || "-"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={route(
                                                        "parent.bulletins.show",
                                                        bulletin.id
                                                    )}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                                                >
                                                    <Eye size={17} />
                                                    Voir
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}

                                    {bulletins.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center text-slate-500"
                                            >
                                                Aucun bulletin disponible.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ icon, label, value, color }) {
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

function InfoLine({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-slate-500">
                {icon}
                <span className="text-sm font-bold">{label}</span>
            </div>

            <span className="text-sm font-black text-slate-700">
                {value}
            </span>
        </div>
    );
}