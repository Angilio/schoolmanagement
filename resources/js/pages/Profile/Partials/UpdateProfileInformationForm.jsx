import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Loader2,
    Mail,
    Save,
    Send,
    UserRound,
} from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const {
        data,
        setData,
        patch,
        errors,
        processing,
        recentlySuccessful,
    } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nom complet"
                        className="mb-2 text-sm font-black text-slate-700"
                    />

                    <div className="relative">
                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <UserRound className="h-5 w-5" />
                        </div>

                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Votre nom complet"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                        />
                    </div>

                    <InputError
                        className="mt-2 font-semibold"
                        message={errors.name}
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Adresse email"
                        className="mb-2 text-sm font-black text-slate-700"
                    />

                    <div className="relative">
                        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <Mail className="h-5 w-5" />
                        </div>

                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="adresse@email.com"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                        />
                    </div>

                    <InputError
                        className="mt-2 font-semibold"
                        message={errors.email}
                    />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                        <p className="text-sm font-semibold leading-6 text-amber-800">
                            Votre adresse email n’est pas vérifiée.
                        </p>

                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-black text-white transition hover:bg-amber-700"
                        >
                            <Send className="h-4 w-4" />
                            Renvoyer l’email de vérification
                        </Link>

                        {status === 'verification-link-sent' && (
                            <p className="mt-3 text-sm font-black text-emerald-700">
                                Un nouveau lien de vérification a été envoyé à
                                votre adresse email.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Save className="h-5 w-5" />
                        )}

                        {processing
                            ? 'Enregistrement...'
                            : 'Enregistrer les informations'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Informations enregistrées.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}