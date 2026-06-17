import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from './AuthenticatedLayout';
import { roleSidebarMap } from '@/Components/Sidebars/RoleSidebarMap';
import { Menu, X } from 'lucide-react';

export default function AppLayout({ children, header = null }) {
    const { auth } = usePage().props;

    const roleName = auth?.user?.roles?.[0]?.name;
    const SidebarComponent = roleSidebarMap[roleName];

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-100">

                {sidebarOpen && (
                    <button
                        type="button"
                        aria-label="Fermer le menu"
                        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {SidebarComponent && (
                    <aside
                        className={`
                            fixed left-0 top-0 z-50 h-screen w-72
                            border-r border-slate-200 bg-white shadow-2xl
                            transition-transform duration-300 ease-in-out
                            lg:translate-x-0 lg:shadow-none

                            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        `}
                    >
                        <SidebarComponent />

                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="absolute right-4 top-4 rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 lg:hidden"
                        >
                            <X size={22} />
                        </button>
                    </aside>
                )}

                <div className={`${SidebarComponent ? 'lg:pl-72' : ''}`}>
                    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                        <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-3">
                                {SidebarComponent && (
                                    <button
                                        type="button"
                                        onClick={() => setSidebarOpen(true)}
                                        className="rounded-2xl bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200 lg:hidden"
                                    >
                                        <Menu size={24} />
                                    </button>
                                )}

                                <div>
                                    {header || (
                                        <>
                                            <h1 className="text-xl font-black text-slate-800">
                                                Tableau de bord
                                            </h1>
                                            <p className="text-sm text-slate-500">
                                                Gestion scolaire interne
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="min-h-[calc(100vh-5rem)] overflow-x-hidden py-2 sm:px-6 lg:px-8">
                        <div className="mx-auto w-full max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}