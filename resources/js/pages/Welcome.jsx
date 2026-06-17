import { Head, Link } from '@inertiajs/react';
import {
    GraduationCap,
    Users,
    UserCheck,
    BookOpenCheck,
    CalendarX,
    BarChart3,
    FileText,
    ArrowRight,
    ShieldCheck,
    Menu,
    School,
    ClipboardList,
    Layers,
} from 'lucide-react';

export default function Welcome({
    auth,
    dashboardUrl = null,
    stats = {},
    currentSchoolYear = null,
    latestBulletins = [],
}) {
    const dashboardHref = dashboardUrl || route('dashboard');

    const formatNumber = (value) => {
        return new Intl.NumberFormat('fr-FR').format(value || 0);
    };

    const schoolYearLabel =
        currentSchoolYear?.year ||
        currentSchoolYear?.name ||
        'Année scolaire non définie';

    const features = [
        {
            icon: Users,
            title: 'Gestion des élèves',
            value: formatNumber(stats.students),
            description: 'Dossiers, classes, contacts et informations scolaires centralisés.',
        },
        {
            icon: UserCheck,
            title: 'Enseignants',
            value: formatNumber(stats.teachers),
            description: 'Organisation des matières, classes et responsabilités pédagogiques.',
        },
        {
            icon: BookOpenCheck,
            title: 'Notes & évaluations',
            value: formatNumber(stats.evaluations),
            description: 'Saisie des notes, calcul des moyennes et suivi des performances.',
        },
        {
            icon: FileText,
            title: 'Bulletins',
            value: formatNumber(stats.bulletins),
            description: 'Génération rapide de bulletins avec moyennes, rangs et appréciations.',
        },
        {
            icon: School,
            title: 'Classes & sections',
            value: formatNumber(stats.classes),
            description: `${formatNumber(stats.sections)} section(s) enregistrée(s) dans le système.`,
        },
        {
            icon: BarChart3,
            title: 'Matières',
            value: formatNumber(stats.subjects),
            description: 'Matières scolaires utilisées pour les notes, coefficients et bulletins.',
        },
    ];

    const heroStats = [
        ['Élèves', formatNumber(stats.students), 'bg-blue-50 text-blue-700'],
        ['Enseignants', formatNumber(stats.teachers), 'bg-emerald-50 text-emerald-700'],
        ['Classes', formatNumber(stats.classes), 'bg-violet-50 text-violet-700'],
        ['Bulletins', formatNumber(stats.bulletins), 'bg-orange-50 text-orange-700'],
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Head title="Accueil" />

            <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href={route('welcome')} className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30">
                            <GraduationCap size={26} />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold leading-tight">
                                SchoolManager
                            </h1>
                            <p className="text-xs text-slate-400">
                                Gestion interne
                            </p>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-3 md:flex">
                        {auth?.user ? (
                            <Link
                                href={dashboardHref}
                                className="rounded-full bg-white px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-blue-100"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="rounded-full bg-blue-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>

                    <button className="md:hidden">
                        <Menu />
                    </button>
                </div>
            </header>

            <main className="relative overflow-hidden pt-24">
                <div className="absolute left-[-10%] top-10 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
                <div className="absolute right-[-10%] top-40 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />

                <section className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur">
                            <ShieldCheck size={18} />
                            {schoolYearLabel}
                        </div>

                        <h2 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                            Gestion interne de votre école.
                        </h2>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                            Les comptes élèves, enseignants et utilisateurs sont créés uniquement par l’administrateur.
                            Connectez-vous pour accéder à votre espace.
                        </p>

                        <div className="mt-10">
                            {auth?.user ? (
                                <Link
                                    href={dashboardHref}
                                    className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-7 py-4 font-bold text-white shadow-xl shadow-blue-500/30 transition hover:-translate-y-1 hover:bg-blue-600"
                                >
                                    Accéder au tableau de bord
                                    <ArrowRight size={20} />
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-7 py-4 font-bold text-white shadow-xl shadow-blue-500/30 transition hover:-translate-y-1 hover:bg-blue-600"
                                >
                                    Se connecter
                                    <ArrowRight size={20} />
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
                        <div className="rounded-[1.5rem] bg-white p-6 text-slate-900">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black">
                                        Administration scolaire
                                    </h3>

                                    <p className="mt-1 text-sm font-semibold text-slate-500">
                                        Données réelles de la base
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                    <BarChart3 size={26} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {heroStats.map(([label, value, color]) => (
                                    <div
                                        key={label}
                                        className={`rounded-2xl p-5 ${color}`}
                                    >
                                        <p className="text-3xl font-black">
                                            {value}
                                        </p>
                                        <p className="text-sm font-semibold opacity-80">
                                            {label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {latestBulletins.length > 0 && (
                                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                                    <div className="mb-3 flex items-center gap-2 font-black text-slate-800">
                                        <FileText size={18} />
                                        Derniers bulletins
                                    </div>

                                    <div className="space-y-2">
                                        {latestBulletins.map((bulletin) => (
                                            <div
                                                key={bulletin.id}
                                                className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm shadow-sm"
                                            >
                                                <span className="font-bold text-slate-700">
                                                    {bulletin.student?.user?.name || 'Élève'}
                                                </span>

                                                <span className="rounded-lg bg-emerald-50 px-2 py-1 font-black text-emerald-700">
                                                    {bulletin.moyenne}/20
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="relative mx-auto max-w-7xl px-6 py-24">
                    <div className="mb-14 text-center">
                        <h2 className="text-4xl font-black md:text-5xl">
                            Une plateforme réservée à l’administration scolaire
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-slate-400">
                            L’administrateur gère les élèves, enseignants, utilisateurs, notes, évaluations et bulletins.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={index}
                                    className="group rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur transition duration-300 hover:-translate-y-2 hover:bg-white/[0.1]"
                                >
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 transition group-hover:bg-blue-500 group-hover:text-white">
                                        <Icon size={28} />
                                    </div>

                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <h3 className="text-xl font-bold">
                                            {feature.title}
                                        </h3>

                                        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-blue-100">
                                            {feature.value}
                                        </span>
                                    </div>

                                    <p className="leading-7 text-slate-400">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="relative mx-auto max-w-7xl px-6 pb-24">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <MiniStat
                            icon={<Users size={28} />}
                            label="Utilisateurs"
                            value={formatNumber(stats.users)}
                        />

                        <MiniStat
                            icon={<ClipboardList size={28} />}
                            label="Trimestres"
                            value={formatNumber(stats.trimestres)}
                        />

                        <MiniStat
                            icon={<Layers size={28} />}
                            label="Années scolaires"
                            value={formatNumber(stats.schoolYears)}
                        />
                    </div>
                </section>

                <section className="relative mx-auto max-w-7xl px-6 pb-24">
                    <div className="rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center shadow-2xl shadow-blue-950/40 md:p-16">
                        <h2 className="text-4xl font-black md:text-5xl">
                            Accès sécurisé à la gestion scolaire
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-blue-100">
                            Seuls les utilisateurs enregistrés par l’administrateur peuvent accéder à la plateforme.
                        </p>

                        <div className="mt-8">
                            {auth?.user ? (
                                <Link
                                    href={dashboardHref}
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-700 transition hover:bg-blue-50"
                                >
                                    Aller au tableau de bord
                                    <ArrowRight size={20} />
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-700 transition hover:bg-blue-50"
                                >
                                    Connexion
                                    <ArrowRight size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} SchoolManager — Gestion scolaire interne.
            </footer>
        </div>
    );
}

function MiniStat({ icon, label, value }) {
    return (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                {icon}
            </div>

            <p className="text-4xl font-black text-white">
                {value}
            </p>

            <p className="mt-2 font-semibold text-slate-400">
                {label}
            </p>
        </div>
    );
}