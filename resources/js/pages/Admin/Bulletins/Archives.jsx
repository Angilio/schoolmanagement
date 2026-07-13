import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    Download,
    FileText,
    Search,
    UserRound,
} from "lucide-react";
import { useState } from "react";

export default function Archives({
    schoolYears = [],
    studentPdfs = [],
    filters = {},
}) {
    const [schoolYearId, setSchoolYearId] = useState(
        filters.school_year_id || ""
    );
    const [search, setSearch] = useState(filters.search || "");

    const submit = (e) => {
        e.preventDefault();

        router.get(
            route("admin.bulletins.archives.index"),
            {
                school_year_id: schoolYearId,
                search,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const resetFilters = () => {
        setSchoolYearId("");
        setSearch("");

        router.get(
            route("admin.bulletins.archives.index"),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const getSchoolYearLabel = (schoolYear) => {
        return schoolYear?.year || schoolYear?.name || `Année ${schoolYear?.id}`;
    };

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Tous les PDF des bulletins
                    </h2>
                    <p className="text-sm text-slate-500">
                        Recherche et filtrage des bulletins PDF archivés par élève.
                    </p>
                </div>
            }
        >
            <Head title="Archives PDF des bulletins" />

            <div className="space-y-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href={route("admin.bulletins.index")}
                        className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 font-bold text-slate-600 transition hover:bg-slate-200"
                    >
                        <ArrowLeft size={18} />
                        Retour aux bulletins
                    </Link>

                    <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 font-black text-blue-700">
                        <FileText size={18} />
                        {studentPdfs.length} PDF trouvé(s)
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                    <div className="mb-5">
                        <h3 className="text-xl font-black text-slate-800">
                            Filtrer les PDF
                        </h3>
                        <p className="text-sm text-slate-500">
                            Filtrez par année scolaire ou recherchez par nom d’élève.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="grid gap-4 md:grid-cols-[1fr_2fr_auto_auto]"
                    >
                        <select
                            value={schoolYearId}
                            onChange={(e) => setSchoolYearId(e.target.value)}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        >
                            <option value="">Toutes les années</option>
                            {schoolYears.map((year) => (
                                <option key={year.id} value={year.id}>
                                    {getSchoolYearLabel(year)}
                                </option>
                            ))}
                        </select>

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par nom, matricule ou fichier..."
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                        >
                            Filtrer
                        </button>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                        >
                            Réinitialiser
                        </button>
                    </form>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-200 p-6">
                        <h3 className="text-xl font-black text-slate-800">
                            Liste des PDF archivés
                        </h3>
                        <p className="text-sm text-slate-500">
                            Le nom affiché correspond à l’élève propriétaire du bulletin.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100 text-sm text-slate-600">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Élève</th>
                                    <th className="px-6 py-4 font-bold">Année</th>
                                    <th className="px-6 py-4 font-bold">Classe</th>
                                    <th className="px-6 py-4 font-bold">Date</th>
                                    <th className="px-6 py-4 text-right font-bold">PDF</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {studentPdfs.map((pdf, index) => (
                                    <tr
                                        key={`${pdf.file_path}-${index}`}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                                    <UserRound size={20} />
                                                </div>

                                                <div>
                                                    <p className="font-black text-slate-800">
                                                        {pdf.student_name}
                                                    </p>
                                                    <p className="text-sm text-slate-400">
                                                        {pdf.matricule}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 font-bold text-slate-700">
                                            {pdf.school_year}
                                        </td>

                                        <td className="px-6 py-5 font-bold text-slate-700">
                                            {pdf.classe} {pdf.serie || ""}{" "}
                                            {pdf.section || ""}
                                        </td>

                                        <td className="px-6 py-5 text-slate-500">
                                            {pdf.generated_at}
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <a
                                                href={pdf.download_url}
                                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                                            >
                                                <Download size={17} />
                                                Télécharger
                                            </a>
                                        </td>
                                    </tr>
                                ))}

                                {studentPdfs.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center text-slate-500"
                                        >
                                            Aucun PDF trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}