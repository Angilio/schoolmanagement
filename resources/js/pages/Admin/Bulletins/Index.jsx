import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import {
    Award,
    Eye,
    FileText,
    GraduationCap,
    Search,
    Users,
    Filter,
    Layers,
    Calendar,
} from "lucide-react";

export default function Index({
    classes = [],
    sections = [],
    series = [],
    trimestres = [],
    bulletins = {},
    filters = {}, // Récupère { classe_id, section_id, trimestre_id } depuis le backend
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

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.bulletins.generate"), {
            preserveScroll: true,
        });
    };

    // Fonction centralisée pour appliquer les filtres en SPA
    const applyFilter = (newFilters) => {
        const updatedFilters = { ...filters, ...newFilters, page: 1 };
        
        // Nettoyage des clés vides
        Object.keys(updatedFilters).forEach(key => {
            if (updatedFilters[key] === "" || updatedFilters[key] === null || updatedFilters[key] === undefined) {
                delete updatedFilters[key];
            }
        });

        router.get(
            route("admin.bulletins.index"),
            updatedFilters,
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const getTrimestreLabel = (trimestre) => {
        const year = trimestre?.school_year?.year || trimestre?.schoolYear?.year;
        return `${trimestre?.name || trimestre?.title || "Trimestre"}${
            year ? ` - ${year}` : ""
        }`;
    };

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Bulletins
                    </h2>
                    <p className="text-sm text-slate-500">
                        Génération automatique et consultation des bulletins trimestriels.
                    </p>
                </div>
            }
        >
            <Head title="Bulletins" />

            <div className="space-y-8">
                {/* Formulaire de génération (Inchangé) */}
                <div className="max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
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

                {/* Stats */}
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

                {/* Section Tableau et Multi-Filtres Cascades */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-200 p-6 space-y-4">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">
                                Bulletins générés
                            </h2>
                            <p className="text-sm text-slate-500">
                                Filtrez en cascade pour affiner votre recherche. Les élèves sont classés par rang.
                            </p>
                        </div>

                        {/* NIVEAU 1 : Filtre des Classes */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <GraduationCap size={14} /> Classe :
                            </span>
                            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-1.5 border border-slate-100">
                                <button
                                    onClick={() => applyFilter({ classe_id: "", section_id: "", trimestre_id: "" })}
                                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition ${
                                        !filters.classe_id
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/15"
                                            : "text-slate-600 hover:bg-slate-200/60"
                                    }`}
                                >
                                    <Filter size={14} />
                                    Toutes les classes
                                </button>
                                {classes.map((classe) => (
                                    <button
                                        key={classe.id}
                                        onClick={() => applyFilter({ classe_id: classe.id, section_id: "", trimestre_id: "" })}
                                        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                            String(filters.classe_id) === String(classe.id)
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/15"
                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {classe.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* NIVEAU 2 : Filtre des Sections (S'affiche uniquement si une classe est cochée) */}
                        {filters.classe_id && (
                            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                    <Layers size={14} /> Section :
                                </span>
                                <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-1.5 border border-slate-100">
                                    <button
                                        onClick={() => applyFilter({ section_id: "" })}
                                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition ${
                                            !filters.section_id
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                                                : "text-slate-600 hover:bg-slate-200/60"
                                        }`}
                                    >
                                        Toutes les sections
                                    </button>
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => applyFilter({ section_id: section.id })}
                                            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                                String(filters.section_id) === String(section.id)
                                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {section.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* NIVEAU 3 : Filtre des Trimestres (S'affiche dès qu'une classe est sélectionnée) */}
                        {filters.classe_id && (
                            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                    <Calendar size={14} /> Trimestre :
                                </span>
                                <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-1.5 border border-slate-100">
                                    <button
                                        onClick={() => applyFilter({ trimestre_id: "" })}
                                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition ${
                                            !filters.trimestre_id
                                                ? "bg-violet-600 text-white shadow-md shadow-violet-600/15"
                                                : "text-slate-600 hover:bg-slate-200/60"
                                        }`}
                                    >
                                        Tous les trimestres
                                    </button>
                                    {trimestres.map((trimestre) => (
                                        <button
                                            key={trimestre.id}
                                            onClick={() => applyFilter({ trimestre_id: trimestre.id })}
                                            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                                String(filters.trimestre_id) === String(trimestre.id)
                                                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/15"
                                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {getTrimestreLabel(trimestre)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tableau des bulletins */}
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
                                            Aucun bulletin trouvé pour cette sélection de filtres.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination SPA avec prise en compte des états */}
                    {links.length > 3 && <Pagination links={links} />}
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
                        preserveState
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                            link.active
                                ? "bg-blue-600 text-white shadow-sm"
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