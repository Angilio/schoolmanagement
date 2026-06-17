import { Link } from '@inertiajs/react';
import {
    Home,
    BookOpen,
    GraduationCap,
    ClipboardList,
    UserRound,
    Settings,
    ShieldCheck,
} from 'lucide-react';

export default function TeacherSidebar() {
    const isActive = (name) => {
        const current = route().current();

        return current === name || current.startsWith(name + '.');
    };

    const menuItems = [
        {
            label: 'Dashboard',
            routeName: 'teacher.dashboard',
            href: route('teacher.dashboard'),
            icon: Home,
        },
        // {
        //     label: 'Mes classes',
        //     routeName: 'teacher.classes',
        //     href: '#',
        //     icon: GraduationCap,
        // },
        // {
        //     label: 'Mes matières',
        //     routeName: 'teacher.subjects',
        //     href: '#',
        //     icon: BookOpen,
        // },
        // {
        //     label: 'Évaluations',
        //     routeName: 'teacher.evaluations',
        //     href: '#',
        //     icon: ClipboardList,
        // },
        {
            label: 'Saisie des notes',
            routeName: 'teacher.notes',
            href: route('teacher.notes.index'),
            icon: UserRound,
        },
    ];

    const linkClass = (active) =>
        `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 ${
            active
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
        }`;

    return (
        <div className="flex h-full flex-col border-r border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-5">
                <div className="flex items-center gap-3 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white shadow-lg shadow-emerald-600/25">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
                        <ShieldCheck size={26} />
                    </div>

                    <div>
                        <h2 className="text-lg font-black leading-tight">
                            Espace Prof
                        </h2>
                        <p className="text-xs text-emerald-100">
                            Enseignant
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
                <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Menu enseignant
                </p>

                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = item.href !== '#' && isActive(item.routeName);

                        return (
                            <li key={item.label}>
                                <Link href={item.href} className={linkClass(active)}>
                                    <span
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                                            active
                                                ? 'bg-white/20 text-white'
                                                : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                                        }`}
                                    >
                                        <Icon size={19} />
                                    </span>

                                    <span className="flex-1">
                                        {item.label}
                                    </span>

                                    {active && (
                                        <span className="h-2 w-2 rounded-full bg-white" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* <div className="mt-8">
                    <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Configuration
                    </p>

                    <Link href="#" className={linkClass(false)}>
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                            <Settings size={19} />
                        </span>

                        <span className="flex-1">
                            Paramètres
                        </span>
                    </Link>
                </div> */}
            </div>

            <div className="border-t border-slate-200 p-4">
                <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                    <p className="text-sm font-bold text-emerald-700">
                        Enseignant
                    </p>
                    <p className="mt-1 text-xs text-emerald-500">
                        Espace pédagogique
                    </p>
                </div>
            </div>
        </div>
    );
}