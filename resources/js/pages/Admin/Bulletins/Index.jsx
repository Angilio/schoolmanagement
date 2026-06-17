import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Archive,
    Award,
    Download,
    Eye,
    FileText,
    GraduationCap,
    Search,
    Users,
} from "lucide-react";

export default function Index({
    classes = [],
    sections = [],
    series = [],
    trimestres = [],
    schoolYears = [],
    bulletins = {},
    archives = [],
}) {
    const bulletinItems = Array.isArray(bulletins)
        ? bulletins
        : bulletins.data || [];

    const links = Array.isArray(bulletins) ? [] : bulletins.links || [];

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        classe_id: "",
        section_id: "",
        serie_id: "",
        trimestre_id: "",
    });

    const {
        data: archiveData,
        setData: setArchiveData,
    } = useForm({
        school_year_id: "",
        classe_id: "",
        section_id: "",
        serie_id: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.bulletins.generate"), {
            preserveScroll: true,
        });
    };

    const exportArchivePdf = (e) => {
        e.preventDefault();

        if (!archiveData.school_year_id || !archiveData.classe_id) {
            alert("Veuillez choisir une année scolaire et une classe.");
            return;
        }

        window.open(route("admin.bulletins.archive-pdf", archiveData), "_blank");
    };

    const getTrimestreLabel = (trimestre) => {
        const year = trimestre?.school_year?.year || trimestre?.schoolYear?.year;

        return `${trimestre?.name || trimestre?.title || "Trimestre"}${
            year ? ` - ${year}` : ""
        }`;
    };

    const getSchoolYearLabel = (schoolYear) => {
        return schoolYear?.year || schoolYear?.name || `Année ${schoolYear?.id}`;
    };

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Bulletins
                    </h2>
                    <p className="text-sm text-slate-500">
                        Génération automatique des bulletins et archivage PDF annuel.
                    </p>
                </div>
            }
        >
            <Head title="Bulletins" />

            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-violet-700 p-6 text-white shadow-xl">
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/20" />
                    <div className="absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-white/10" />

                    <div className="relative">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                            <Award size={18} />
                            Module bulletins
                        </div>

                        <h1 className="text-3xl font-black">
                            Bulletins trimestriels et archive annuelle
                        </h1>

                        <p className="mt-2 max-w-3xl text-blue-100">
                            Pour chaque matière, le système calcule d’abord la moyenne
                            des évaluations du trimestre, applique le coefficient,
                            puis classe les élèves par rang.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-5">
                            <h2 className="text-xl font-black text-slate-800">
                                Générer les bulletins trimestriels
                            </h2>
                            <p className="text-sm text-slate-500">
                                Choisissez une classe et un trimestre. Section et série sont optionnelles.
                            </p>
                        </div>

                        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                            <SelectField
                                label="Classe"
                                value={data.classe_id}
                                onChange={(value) => setData("classe_id", value)}
                                error={errors.classe_id}
                            >
                                <option value="">Choisir classe</option>
                                {classes.map((classe) => (
                                    <option key={classe.id} value={classe.id}>
                                        {classe.name}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                label="Trimestre"
                                value={data.trimestre_id}
                                onChange={(value) => setData("trimestre_id", value)}
                                error={errors.trimestre_id}
                            >
                                <option value="">Choisir trimestre</option>
                                {trimestres.map((trimestre) => (
                                    <option key={trimestre.id} value={trimestre.id}>
                                        {getTrimestreLabel(trimestre)}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                label="Section"
                                value={data.section_id}
                                onChange={(value) => setData("section_id", value)}
                            >
                                <option value="">Toutes sections</option>
                                {sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.name}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                label="Série"
                                value={data.serie_id}
                                onChange={(value) => setData("serie_id", value)}
                            >
                                <option value="">Toutes séries</option>
                                {series.map((serie) => (
                                    <option key={serie.id} value={serie.id}>
                                        {serie.name}
                                    </option>
                                ))}
                            </SelectField>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
                                >
                                    <Search size={18} />
                                    {processing ? "Génération..." : "Générer les bulletins"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-5">
                            <h2 className="text-xl font-black text-slate-800">
                                Créer une archive PDF annuelle
                            </h2>
                            <p className="text-sm text-slate-500">
                                À la fin de l’année scolaire, générez un PDF avec les 3 trimestres.
                            </p>
                        </div>

                        <form onSubmit={exportArchivePdf} className="grid gap-4 md:grid-cols-2">
                            <SelectField
                                label="Année scolaire"
                                value={archiveData.school_year_id}
                                onChange={(value) =>
                                    setArchiveData("school_year_id", value)
                                }
                            >
                                <option value="">Choisir année scolaire</option>
                                {schoolYears.map((year) => (
                                    <option key={year.id} value={year.id}>
                                        {getSchoolYearLabel(year)}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                label="Classe"
                                value={archiveData.classe_id}
                                onChange={(value) =>
                                    setArchiveData("classe_id", value)
                                }
                            >
                                <option value="">Choisir classe</option>
                                {classes.map((classe) => (
                                    <option key={classe.id} value={classe.id}>
                                        {classe.name}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                label="Section"
                                value={archiveData.section_id}
                                onChange={(value) =>
                                    setArchiveData("section_id", value)
                                }
                            >
                                <option value="">Toutes sections</option>
                                {sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.name}
                                    </option>
                                ))}
                            </SelectField>

                            <SelectField
                                label="Série"
                                value={archiveData.serie_id}
                                onChange={(value) =>
                                    setArchiveData("serie_id", value)
                                }
                            >
                                <option value="">Toutes séries</option>
                                {series.map((serie) => (
                                    <option key={serie.id} value={serie.id}>
                                        {serie.name}
                                    </option>
                                ))}
                            </SelectField>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
                                >
                                    <Archive size={18} />
                                    Générer archive PDF
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        icon={<FileText size={28} />}
                        label="Bulletins affichés"
                        value={bulletinItems.length}
                        color="blue"
                    />

                    <StatCard
                        icon={<GraduationCap size={28} />}
                        label="Classes"
                        value={classes.length}
                        color="violet"
                    />

                    <StatCard
                        icon={<Award size={28} />}
                        label="Trimestres"
                        value={trimestres.length}
                        color="emerald"
                    />
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-xl font-black text-slate-800">
                            Bulletins générés
                        </h2>
                        <p className="text-sm text-slate-500">
                            Les élèves sont triés par rang dans chaque trimestre.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100 text-sm text-slate-600">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Élève</th>
                                    <th className="px-6 py-4 font-bold">Classe</th>
                                    <th className="px-6 py-4 font-bold">Trimestre</th>
                                    <th className="px-6 py-4 font-bold">Moyenne</th>
                                    <th className="px-6 py-4 font-bold">Rang</th>
                                    <th className="px-6 py-4 text-right font-bold">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {bulletinItems.map((bulletin) => (
                                    <tr key={bulletin.id} className="transition hover:bg-slate-50">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                                    <Users size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800">
                                                        {bulletin.student?.user?.name}
                                                    </p>
                                                    <p className="text-sm text-slate-400">
                                                        {bulletin.student?.matricule}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 font-bold text-slate-600">
                                            {bulletin.student?.classe?.name}{" "}
                                            {bulletin.student?.serie?.name || ""}{" "}
                                            {bulletin.student?.section?.name || ""}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="rounded-xl bg-violet-50 px-3 py-1 text-sm font-bold text-violet-700">
                                                {getTrimestreLabel(bulletin.trimestre)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="rounded-xl bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                                                {bulletin.moyenne}/20
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="rounded-xl bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">
                                                {bulletin.rang || "-"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <Link
                                                href={route("admin.bulletins.show", bulletin.id)}
                                                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                                            >
                                                <Eye size={17} />
                                                Voir
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {bulletinItems.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            Aucun bulletin généré.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {links.length > 3 && <Pagination links={links} />}
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-xl font-black text-slate-800">
                            Archives PDF récentes
                        </h2>
                        <p className="text-sm text-slate-500">
                            Les derniers fichiers PDF générés pour l’école.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100 text-sm text-slate-600">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Année</th>
                                    <th className="px-6 py-4 font-bold">Classe</th>
                                    <th className="px-6 py-4 font-bold">Date</th>
                                    <th className="px-6 py-4 text-right font-bold">PDF</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {archives.map((archive) => (
                                    <tr key={archive.id}>
                                        <td className="px-6 py-5 font-bold text-slate-700">
                                            {getSchoolYearLabel(archive.school_year)}
                                        </td>

                                        <td className="px-6 py-5 font-bold text-slate-700">
                                            {archive.classe?.name || "-"}{" "}
                                            {archive.serie?.name || ""}{" "}
                                            {archive.section?.name || ""}
                                        </td>

                                        <td className="px-6 py-5 text-slate-500">
                                            {archive.generated_at || archive.created_at}
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <Link
                                                href={route(
                                                    "admin.bulletins.archives.download",
                                                    archive.id
                                                )}
                                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                                            >
                                                <Download size={17} />
                                                Télécharger
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {archives.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-slate-500">
                                            Aucune archive PDF générée.
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

function SelectField({ label, value, onChange, error, children }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
                {label}
            </label>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >
                {children}
            </select>

            {error && (
                <p className="mt-2 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        violet: "bg-violet-50 text-violet-600",
        emerald: "bg-emerald-50 text-emerald-600",
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

function Pagination({ links }) {
    return (
        <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 px-6 py-5">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`rounded-xl px-4 py-2 text-sm font-bold ${
                            link.active
                                ? "bg-blue-600 text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-blue-50"
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </div>
    );
}