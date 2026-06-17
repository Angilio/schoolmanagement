import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Award,
    BookOpen,
    GraduationCap,
    UserRound,
} from "lucide-react";

export default function BulletinView({
    bulletin,
    title = "Bulletin scolaire",
    backHref,
    theme = "blue",
}) {
    const student = bulletin.student;
    const trimestre = bulletin.trimestre;

    const gradient =
        theme === "emerald"
            ? "from-emerald-600 to-teal-700"
            : "from-blue-600 to-indigo-700";

    const soft =
        theme === "emerald"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-blue-50 text-blue-600";

    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 font-bold text-slate-600 hover:bg-slate-200"
                >
                    <ArrowLeft size={18} />
                    Retour
                </Link>

                <div className={`rounded-3xl bg-gradient-to-r ${gradient} p-6 text-white shadow-xl`}>
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                                <Award size={18} />
                                {title}
                            </div>

                            <h1 className="text-3xl font-black">
                                {student?.user?.name}
                            </h1>

                            <p className="mt-2 text-white/80">
                                {student?.classe?.name}{" "}
                                {student?.serie?.name || ""}{" "}
                                {student?.section?.name || ""}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/15 p-5 text-center">
                            <p className="text-sm font-semibold text-white/80">
                                Moyenne générale
                            </p>
                            <p className="text-4xl font-black">
                                {bulletin.moyenne}/20
                            </p>
                            <p className="mt-1 text-sm font-bold text-white/80">
                                Rang : {bulletin.rang || "-"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <InfoCard
                        icon={<UserRound size={24} />}
                        label="Matricule"
                        value={student?.matricule || "-"}
                        soft={soft}
                    />

                    <InfoCard
                        icon={<GraduationCap size={24} />}
                        label="Trimestre"
                        value={trimestre?.name || trimestre?.title || "-"}
                        soft={soft}
                    />

                    <InfoCard
                        icon={<BookOpen size={24} />}
                        label="Année scolaire"
                        value={
                            trimestre?.school_year?.year ||
                            trimestre?.schoolYear?.year ||
                            "-"
                        }
                        soft={soft}
                    />
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-xl font-black text-slate-800">
                            Résultats par matière
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100 text-sm text-slate-600">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Matière</th>
                                    <th className="px-6 py-4 font-bold">Moyenne</th>
                                    <th className="px-6 py-4 font-bold">Coefficient</th>
                                    <th className="px-6 py-4 font-bold">Moyenne coeff.</th>
                                    <th className="px-6 py-4 font-bold">Appréciation</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {bulletin.details.map((detail) => (
                                    <tr key={detail.id}>
                                        <td className="px-6 py-5 font-black text-slate-800">
                                            {detail.subject?.name}
                                        </td>

                                        <td className="px-6 py-5 font-bold text-blue-700">
                                            {detail.average}/20
                                        </td>

                                        <td className="px-6 py-5 font-bold text-slate-600">
                                            {detail.coefficient}
                                        </td>

                                        <td className="px-6 py-5 font-bold text-emerald-700">
                                            {detail.weighted_average}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="rounded-xl bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
                                                {detail.appreciation}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {bulletin.details.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                            Aucun détail disponible.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

function InfoCard({ icon, label, value, soft }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${soft}`}>
                    {icon}
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-500">
                        {label}
                    </p>
                    <p className="text-xl font-black text-slate-800">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}