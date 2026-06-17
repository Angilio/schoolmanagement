import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { Award, Eye, FileText, GraduationCap } from "lucide-react";

export default function Index({ student, bulletins = [] }) {
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
                        Mes bulletins
                    </h2>
                    <p className="text-sm text-slate-500">
                        Consultation des bulletins scolaires.
                    </p>
                </div>
            }
        >
            <Head title="Mes bulletins" />

            <div className="space-y-8">
                <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white shadow-xl">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                                <Award size={18} />
                                Espace élève
                            </div>

                            <h1 className="text-3xl font-black">
                                {student?.user?.name}
                            </h1>

                            <p className="mt-2 text-emerald-100">
                                {student?.classe?.name}{" "}
                                {student?.serie?.name || ""}{" "}
                                {student?.section?.name || ""}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/15 p-5 text-center">
                            <p className="text-sm font-semibold text-emerald-100">
                                Bulletins disponibles
                            </p>
                            <p className="text-4xl font-black">
                                {bulletins.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {bulletins.map((bulletin) => (
                        <div
                            key={bulletin.id}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                    <FileText size={28} />
                                </div>

                                <span className="rounded-xl bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">
                                    Rang {bulletin.rang || "-"}
                                </span>
                            </div>

                            <h2 className="text-xl font-black text-slate-800">
                                {getTrimestreLabel(bulletin.trimestre)}
                            </h2>

                            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                                <p className="text-sm font-semibold text-slate-500">
                                    Moyenne générale
                                </p>

                                <p className="text-3xl font-black text-emerald-700">
                                    {bulletin.moyenne}/20
                                </p>
                            </div>

                            <Link
                                href={route("student.bulletins.show", bulletin.id)}
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
                            >
                                <Eye size={18} />
                                Consulter
                            </Link>
                        </div>
                    ))}

                    {bulletins.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center md:col-span-2 xl:col-span-3">
                            <GraduationCap size={44} className="mx-auto text-slate-300" />

                            <p className="mt-4 font-black text-slate-700">
                                Aucun bulletin disponible.
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Les bulletins apparaîtront ici après génération par l’administration.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}