import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    GraduationCap,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowRight,
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <Head title="Connexion" />

            <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
            <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
                <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl lg:grid-cols-2">

                    <div className="hidden bg-gradient-to-br from-blue-600 to-indigo-800 p-10 lg:block">
                        <div className="flex h-full flex-col justify-between">
                            <div>
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                                        <GraduationCap size={28} />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-black">SchoolManager</h1>
                                        <p className="text-sm text-blue-100">Gestion scolaire interne</p>
                                    </div>
                                </div>

                                <h2 className="mt-20 text-5xl font-black leading-tight">
                                    Accès sécurisé à votre espace scolaire.
                                </h2>

                                <p className="mt-6 max-w-md text-blue-100">
                                    Les comptes sont créés uniquement par l’administrateur.
                                    Connectez-vous pour accéder à votre tableau de bord.
                                </p>
                            </div>

                            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={26} />
                                    <div>
                                        <p className="font-bold">Plateforme privée</p>
                                        <p className="text-sm text-blue-100">
                                            Réservée aux élèves, enseignants et personnels enregistrés.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 text-slate-900 sm:p-10 lg:p-12">
                        <div className="mb-8 flex items-center justify-between">
    
    <div>
        <h2 className="text-3xl font-black">Connexion</h2>
        <p className="mt-2 text-slate-500">
            Entrez vos identifiants fournis par l’administrateur.
        </p>
    </div>

    <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
    >
        ← Accueil
    </Link>

</div>

  

                        {status && (
                            <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-700">
                                    Adresse email
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="exemple@email.com"
                                    />
                                </div>

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-700">
                                    Mot de passe
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />

                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-12 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="Votre mot de passe"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="ms-2 text-sm text-slate-600">
                                        Se souvenir de moi
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                )}
                            </div>

                            <PrimaryButton
                                className="flex w-full justify-center rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
                                disabled={processing}
                            >
                                {processing ? 'Connexion...' : (
                                    <span className="flex items-center gap-2">
                                        Se connecter
                                        <ArrowRight size={20} />
                                    </span>
                                )}
                            </PrimaryButton>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Accès réservé aux utilisateurs enregistrés par l’administrateur.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}