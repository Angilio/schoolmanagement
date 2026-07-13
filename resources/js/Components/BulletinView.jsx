import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Award,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    FileText,
    GraduationCap,
    Printer,
    School,
    UserRound,
} from "lucide-react";
import { useMemo } from "react";

export default function BulletinView({
    bulletin,
    title = "Bulletin scolaire",
    backHref,
    schoolName = "LYCÉE PRIVÉ A.P.E",
}) {
    const student = bulletin.student;
    const trimestre = bulletin.trimestre;
    const details = bulletin.details || [];

    const pageBackHref =
        backHref ||
        (typeof route !== "undefined" ? route("admin.bulletins.index") : "#");

    const year =
        trimestre?.school_year?.year ||
        trimestre?.schoolYear?.year ||
        bulletin?.school_year?.year ||
        bulletin?.schoolYear?.year ||
        "-";

    const classeLabel = [
        student?.classe?.name,
        student?.serie?.name ? `Série ${student.serie.name}` : null,
        student?.section?.name ? `Section ${student.section.name}` : null,
    ]
        .filter(Boolean)
        .join(" - ");

    const trimestreLabel =
        trimestre?.name || trimestre?.title || "Trimestre";

    const subjectRows = useMemo(() => {
        return [...details].sort((a, b) => {
            const nameA = a.subject?.name || "";
            const nameB = b.subject?.name || "";

            return nameA.localeCompare(nameB, "fr", {
                sensitivity: "base",
            });
        });
    }, [details]);

    const totalCoefficient = subjectRows.reduce((sum, detail) => {
        return sum + Number(detail.coefficient || 0);
    }, 0);

    const totalWeighted = subjectRows.reduce((sum, detail) => {
        return sum + Number(detail.weighted_average || 0);
    }, 0);

    const generalAppreciation = getGeneralAppreciation(bulletin.moyenne);

    const decision =
        bulletin.moyenne === null || bulletin.moyenne === undefined
            ? "-"
            : Number(bulletin.moyenne) >= 10
              ? "Admis"
              : "À améliorer";

    const printScale =
        subjectRows.length >= 24
            ? "0.76"
            : subjectRows.length >= 20
              ? "0.82"
              : subjectRows.length >= 16
                ? "0.9"
                : "1";

    const printVariables = {
        "--print-scale": printScale,
        "--print-table-font":
            subjectRows.length >= 20
                ? "7px"
                : subjectRows.length >= 16
                  ? "8px"
                  : "9px",
        "--print-cell-padding": subjectRows.length >= 16 ? "1px" : "2px",
        "--print-signature-height": subjectRows.length >= 18 ? "44px" : "60px",
    };

    const printBulletin = () => {
        window.print();
    };

    return (
        <>
            <Head title={title} />

            <style>
                {`
                    @media print {
                        @page {
                            size: A4 landscape;
                            margin: 0;
                        }

                        html,
                        body {
                            width: 297mm !important;
                            height: 210mm !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            background: white !important;
                            overflow: hidden !important;
                        }

                        body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }

                        body * {
                            visibility: hidden !important;
                        }

                        .bulletin-print-area,
                        .bulletin-print-area * {
                            visibility: visible !important;
                        }

                        .no-print {
                            display: none !important;
                            visibility: hidden !important;
                        }

                        .print-wrapper {
                            padding: 0 !important;
                            margin: 0 !important;
                            width: 297mm !important;
                            height: 210mm !important;
                            overflow: hidden !important;
                            background: white !important;
                        }

                        .bulletin-print-area {
                            position: fixed !important;
                            inset: 0 !important;
                            width: 297mm !important;
                            height: 210mm !important;
                            padding: 5mm !important;
                            margin: 0 !important;
                            box-sizing: border-box !important;
                            background: white !important;
                            overflow: hidden !important;
                            display: flex !important;
                            align-items: flex-start !important;
                            justify-content: center !important;
                        }

                        .bulletin-paper {
                            width: 287mm !important;
                            height: 200mm !important;
                            max-width: none !important;
                            max-height: 200mm !important;
                            margin: 0 auto !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            border: 2px solid #000 !important;
                            overflow: hidden !important;
                            transform: scale(var(--print-scale)) !important;
                            transform-origin: top center !important;
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }

                        .print-text-black {
                            color: #000 !important;
                        }

                        .print-compact-table {
                            font-size: var(--print-table-font) !important;
                        }

                        .print-compact-table th,
                        .print-compact-table td {
                            padding-top: var(--print-cell-padding) !important;
                            padding-bottom: var(--print-cell-padding) !important;
                            line-height: 1.05 !important;
                        }

                        .print-signature-box {
                            min-height: var(--print-signature-height) !important;
                        }
                    }
                `}
            </style>

            <div className="print-wrapper space-y-6">
                <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href={pageBackHref}
                        className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 font-bold text-slate-600 transition hover:bg-slate-200"
                    >
                        <ArrowLeft size={18} />
                        Retour
                    </Link>

                    <button
                        type="button"
                        onClick={printBulletin}
                        className="inline-flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                    >
                        <Printer size={18} />
                        Imprimer seulement le bulletin
                    </button>
                </div>

                <div className="no-print rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-violet-700 p-6 text-white shadow-xl">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
                                <Award size={18} />
                                Aperçu du bulletin trimestriel
                            </div>

                            <h1 className="text-3xl font-black">
                                {student?.user?.name || "Élève"}
                            </h1>

                            <p className="mt-2 text-white/80">
                                {classeLabel || "Classe non définie"} —{" "}
                                {trimestreLabel}
                            </p>
                        </div>

                        <div className="rounded-3xl bg-white/15 p-5 text-center">
                            <p className="text-sm font-semibold text-white/80">
                                Moyenne du trimestre
                            </p>

                            <p className="text-4xl font-black">
                                {formatNumber(bulletin.moyenne)}/20
                            </p>

                            <p className="mt-1 text-sm font-bold text-white/80">
                                Rang : {bulletin.rang || "-"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bulletin-print-area">
                    <div
                        className="bulletin-paper mx-auto max-w-[1180px] overflow-hidden rounded-2xl border-2 border-slate-900 bg-white shadow-2xl"
                        style={printVariables}
                    >
                        <div className="border-b-2 border-slate-900">
                            <div className="grid grid-cols-[1fr_2fr_1fr]">
                                <div className="border-r-2 border-slate-900 p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-slate-700">
                                            <School size={27} />
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-slate-500">
                                                Établissement
                                            </p>

                                            <p className="text-base font-black uppercase text-slate-900">
                                                {schoolName}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-2 text-xs font-semibold text-slate-500">
                                        Année scolaire :{" "}
                                        <span className="font-black text-slate-900">
                                            {year}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex flex-col items-center justify-center p-3 text-center">
                                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
                                        {schoolName}
                                    </p>

                                    <h1 className="mt-1 text-3xl font-black uppercase tracking-wide text-slate-900">
                                        Bulletin de notes
                                    </h1>

                                    <p className="mt-1 text-xs font-black uppercase text-slate-700">
                                        {trimestreLabel}
                                    </p>
                                </div>

                                <div className="border-l-2 border-slate-900 p-3">
                                    <div className="flex h-full items-center justify-center p-2 text-center">
                                        <img
                                            src="/logoAPE.jfif"
                                            alt="Logo Lycée Privé A.P.E"
                                            className="h-20 w-20 object-contain rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 border-b-2 border-slate-900 text-xs">
                            <InfoBox
                                icon={<UserRound size={16} />}
                                label="Nom et prénom"
                                value={student?.user?.name || "-"}
                            />

                            <InfoBox
                                icon={<FileText size={16} />}
                                label="Matricule"
                                value={student?.matricule || "-"}
                            />

                            <InfoBox
                                icon={<GraduationCap size={16} />}
                                label="Classe"
                                value={classeLabel || "-"}
                            />

                            <InfoBox
                                icon={<CalendarDays size={16} />}
                                label="Trimestre"
                                value={trimestreLabel}
                                last
                            />
                        </div>

                        <div className="grid grid-cols-4 border-b-2 border-slate-900">
                            <SummaryBox
                                label="Moyenne"
                                value={`${formatNumber(bulletin.moyenne)}/20`}
                            />

                            <SummaryBox
                                label="Rang"
                                value={bulletin.rang || "-"}
                            />

                            <SummaryBox
                                label="Appréciation"
                                value={generalAppreciation}
                            />

                            <SummaryBox
                                label="Décision"
                                value={decision}
                                last
                            />
                        </div>

                        <div className="p-3">
                            <table className="print-compact-table w-full border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="border border-slate-900 px-2 py-1 text-center font-black uppercase">
                                            N°
                                        </th>

                                        <th className="border border-slate-900 px-2 py-1 text-left font-black uppercase">
                                            Matières
                                        </th>

                                        <th className="border border-slate-900 px-2 py-1 text-center font-black uppercase">
                                            Coef.
                                        </th>

                                        <th className="border border-slate-900 px-2 py-1 text-center font-black uppercase">
                                            Moyenne /20
                                        </th>

                                        <th className="border border-slate-900 px-2 py-1 text-center font-black uppercase">
                                            Moy. coeff.
                                        </th>

                                        <th className="border border-slate-900 px-2 py-1 text-center font-black uppercase">
                                            Appréciation
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {subjectRows.map((detail, index) => (
                                        <tr key={detail.id || index}>
                                            <td className="border border-slate-900 px-2 py-1 text-center font-bold text-slate-700">
                                                {index + 1}
                                            </td>

                                            <td className="border border-slate-900 px-2 py-1 font-bold uppercase text-slate-900">
                                                {detail.subject?.name || "-"}
                                            </td>

                                            <td className="border border-slate-900 px-2 py-1 text-center font-bold">
                                                {detail.coefficient || 1}
                                            </td>

                                            <td className="border border-slate-900 px-2 py-1 text-center font-black text-blue-700 print-text-black">
                                                {formatNumber(detail.average)}
                                            </td>

                                            <td className="border border-slate-900 px-2 py-1 text-center font-black text-emerald-700 print-text-black">
                                                {formatNumber(
                                                    detail.weighted_average
                                                )}
                                            </td>

                                            <td className="border border-slate-900 px-2 py-1 text-center font-bold">
                                                {detail.appreciation ||
                                                    getGeneralAppreciation(
                                                        detail.average
                                                    )}
                                            </td>
                                        </tr>
                                    ))}

                                    {subjectRows.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="border border-slate-900 px-3 py-8 text-center font-bold text-slate-500"
                                            >
                                                Aucun détail disponible.
                                            </td>
                                        </tr>
                                    )}

                                    <tr className="bg-slate-100">
                                        <td
                                            colSpan="2"
                                            className="border border-slate-900 px-2 py-1 text-right font-black uppercase"
                                        >
                                            Total
                                        </td>

                                        <td className="border border-slate-900 px-2 py-1 text-center font-black">
                                            {totalCoefficient}
                                        </td>

                                        <td className="border border-slate-900 px-2 py-1 text-center font-black">
                                            -
                                        </td>

                                        <td className="border border-slate-900 px-2 py-1 text-center font-black">
                                            {formatNumber(totalWeighted)}
                                        </td>

                                        <td className="border border-slate-900 px-2 py-1 text-center font-black">
                                            {generalAppreciation}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-4 border-y-2 border-slate-900">
                            <SummaryBox
                                label="Total coefficients"
                                value={totalCoefficient}
                            />

                            <SummaryBox
                                label="Moyenne trimestrielle"
                                value={`${formatNumber(bulletin.moyenne)}/20`}
                            />

                            <SummaryBox
                                label="Rang"
                                value={bulletin.rang || "-"}
                            />

                            <SummaryBox
                                label="Décision"
                                value={decision}
                                last
                            />
                        </div>

                        <div className="grid grid-cols-3 border-b-2 border-slate-900">
                            <DisciplineBox label="Absence" value="-" />

                            <DisciplineBox label="Retard" value="-" />

                            <DisciplineBox label="Conduite" value="-" last />
                        </div>

                        <div className="grid grid-cols-3">
                            <SignatureBox title="Appréciations du conseil" />

                            <SignatureBox title="Signature des parents" />

                            <SignatureBox
                                title="Le Directeur / Responsable"
                                last
                            />
                        </div>
                    </div>
                </div>

                <div className="no-print grid gap-5 md:grid-cols-3">
                    <SmallCard
                        icon={<BookOpen size={22} />}
                        label="Matières évaluées"
                        value={subjectRows.length}
                        color="blue"
                    />

                    <SmallCard
                        icon={<CheckCircle2 size={22} />}
                        label="Appréciation"
                        value={generalAppreciation}
                        color="emerald"
                    />

                    <SmallCard
                        icon={<Award size={22} />}
                        label="Rang"
                        value={bulletin.rang || "-"}
                        color="violet"
                    />
                </div>
            </div>
        </>
    );
}

function InfoBox({ icon, label, value, last = false }) {
    return (
        <div
            className={`flex items-center gap-2 p-2 ${
                last ? "" : "border-r-2 border-slate-900"
            }`}
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                {icon}
            </div>

            <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">
                    {label}
                </p>

                <p className="font-black uppercase text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function SummaryBox({ label, value, last = false }) {
    return (
        <div
            className={`p-2 text-center ${
                last ? "" : "border-r-2 border-slate-900"
            }`}
        >
            <p className="text-[10px] font-black uppercase text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-lg font-black text-slate-900">{value}</p>
        </div>
    );
}

function DisciplineBox({ label, value, last = false }) {
    return (
        <div
            className={`p-2 text-center ${
                last ? "" : "border-r-2 border-slate-900"
            }`}
        >
            <p className="text-[10px] font-black uppercase text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
        </div>
    );
}

function SignatureBox({ title, last = false }) {
    return (
        <div
            className={`print-signature-box min-h-[60px] p-2 ${
                last ? "" : "border-r-2 border-slate-900"
            }`}
        >
            <p className="text-center text-xs font-black uppercase text-slate-700">
                {title}
            </p>

            <div className="mt-6 border-t border-dashed border-slate-400 pt-1 text-center text-[10px] font-semibold text-slate-400">
                Signature
            </div>
        </div>
    );
}

function SmallCard({ icon, label, value, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        violet: "bg-violet-50 text-violet-600",
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        colors[color] || colors.blue
                    }`}
                >
                    {icon}
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-500">
                        {label}
                    </p>

                    <p className="text-2xl font-black text-slate-800">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function formatNumber(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return value;
    }

    return number.toFixed(2);
}

function getGeneralAppreciation(value) {
    const average = Number(value);

    if (Number.isNaN(average)) {
        return "-";
    }

    if (average >= 16) {
        return "Très bien";
    }

    if (average >= 14) {
        return "Bien";
    }

    if (average >= 12) {
        return "Assez bien";
    }

    if (average >= 10) {
        return "Passable";
    }

    return "Insuffisant";
}