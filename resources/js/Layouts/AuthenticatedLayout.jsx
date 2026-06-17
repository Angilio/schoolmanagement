import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import {
    LayoutDashboard,
    User,
    LogOut,
    Menu,
    X,
    Bell,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-100">

            {/* BACKGROUND */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
            </div>

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">

                        {/* LEFT */}
                        <div className="flex items-center gap-10">

                            <Link
                                href="/"
                                className="flex items-center gap-3"
                            >
                                <div className="rounded-2xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-500/30">
                                    <ApplicationLogo className="h-8 w-8 fill-current" />
                                </div>

                                <div className="hidden sm:block">
                                    <h1 className="text-lg font-black text-slate-800">
                                        SchoolManager
                                    </h1>
                                    <p className="text-xs text-slate-500">
                                        Gestion scolaire
                                    </p>
                                </div>
                            </Link>

                            {/* NAVIGATION */}
                            <div className="hidden items-center gap-2 md:flex">

                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="rounded-xl"
                                >
                                    <span className="flex items-center gap-2">
                                        <LayoutDashboard size={18} />
                                        Tableau de bord
                                    </span>
                                </NavLink>

                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="hidden items-center gap-4 sm:flex">

                            {/* NOTIFICATION */}
                            <button className="relative rounded-2xl bg-white p-3 text-slate-600 shadow hover:bg-slate-50">
                                <Bell size={20} />

                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                            </button>

                            {/* USER MENU */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow transition hover:shadow-lg"
                                    >
                                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white">
                                            {user.image ? (
                                                <img
                                                    src={`/storage/${user.image}`}
                                                    alt={user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>

                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-800">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content width="64">

                                    <Dropdown.Link
                                        href={route('profile.edit')}
                                    >
                                        <span className="flex items-center gap-2">
                                            <User size={16} />
                                            Compte utilisateur
                                        </span>
                                    </Dropdown.Link>

                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        <span className="flex items-center gap-2 text-red-500">
                                            <LogOut size={16} />
                                            Déconnexion
                                        </span>
                                    </Dropdown.Link>

                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* MOBILE BUTTON */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="rounded-xl bg-white p-2 shadow"
                            >
                                {showingNavigationDropdown ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div
                    className={`sm:hidden ${
                        showingNavigationDropdown ? 'block' : 'hidden'
                    }`}
                >
                    <div className="space-y-2 border-t border-slate-200 bg-white px-4 py-4">

                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Tableau de bord
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href={route('profile.edit')}>
                            Compte utilisateur
                        </ResponsiveNavLink>

                        <ResponsiveNavLink
                            method="post"
                            href={route('logout')}
                            as="button"
                        >
                            Déconnexion
                        </ResponsiveNavLink>

                    </div>
                </div>
            </nav>

            {/* HEADER */}
            {header && (
                <header className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-white/20 bg-white/70 px-8 py-6 shadow-xl backdrop-blur-xl">
                        {header}
                    </div>
                </header>
            )}

            {/* CONTENT */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-3xl">
                    {children}
                </div>
            </main>
        </div>
    );
}