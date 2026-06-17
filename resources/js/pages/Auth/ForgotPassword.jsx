import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Mot de passe oublié" />

            <div className="w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 px-8 py-10 text-white">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20" />
                    <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-white/10" />

                    <div className="relative">
                        {/* <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                            <ShieldCheck size={30} />
                        </div> */}

                        <h1 className="text-3xl font-black">
                            Mot de passe oublié ?
                        </h1>

                        <p className="mt-3 text-sm leading-relaxed text-blue-100">
                            Pas de souci. Entrez votre adresse email et nous vous
                            enverrons un lien pour réinitialiser votre mot de passe.
                        </p>
                    </div>
                </div>

                <div className="p-8">
                    {status && (
                        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-bold text-slate-700"
                            >
                                Adresse email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoFocus
                                    placeholder="exemple@email.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Envoi en cours...' : 'Envoyer le lien'}
                            {!processing && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}