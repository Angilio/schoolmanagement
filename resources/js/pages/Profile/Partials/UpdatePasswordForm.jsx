import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, KeyRound, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const {
        data,
        setData,
        errors,
        post,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        _method: 'put',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        /*
        |--------------------------------------------------------------------------
        | Important pour la production
        |--------------------------------------------------------------------------
        | On évite la vraie requête PUT.
        | Laravel reçoit POST + _method=put et le traite comme PUT.
        |--------------------------------------------------------------------------
        */
        post(route('password.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset(
                    'current_password',
                    'password',
                    'password_confirmation'
                );
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-6">
                <PasswordField
                    id="current_password"
                    label="Mot de passe actuel"
                    value={data.current_password}
                    error={errors.current_password}
                    show={showCurrentPassword}
                    setShow={setShowCurrentPassword}
                    inputRef={currentPasswordInput}
                    onChange={(e) =>
                        setData('current_password', e.target.value)
                    }
                    placeholder="Entrer le mot de passe actuel"
                    autoComplete="current-password"
                />

                <PasswordField
                    id="password"
                    label="Nouveau mot de passe"
                    value={data.password}
                    error={errors.password}
                    show={showPassword}
                    setShow={setShowPassword}
                    inputRef={passwordInput}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Entrer le nouveau mot de passe"
                    autoComplete="new-password"
                />

                <PasswordField
                    id="password_confirmation"
                    label="Confirmer le nouveau mot de passe"
                    value={data.password_confirmation}
                    error={errors.password_confirmation}
                    show={showConfirmation}
                    setShow={setShowConfirmation}
                    onChange={(e) =>
                        setData('password_confirmation', e.target.value)
                    }
                    placeholder="Confirmer le nouveau mot de passe"
                    autoComplete="new-password"
                />

                <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm font-black text-amber-800">
                                Conseil
                            </p>
                            <p className="mt-1 text-sm font-semibold leading-6 text-amber-700">
                                Utilisez au moins 8 caractères avec des lettres,
                                chiffres et symboles.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-rose-600/25 transition hover:-translate-y-0.5 hover:from-rose-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <KeyRound className="h-5 w-5" />
                        )}

                        {processing
                            ? 'Modification en cours...'
                            : 'Changer mon mot de passe'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                            <ShieldCheck className="h-4 w-4" />
                            Mot de passe modifié.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

function PasswordField({
    id,
    label,
    value,
    error,
    show,
    setShow,
    inputRef,
    onChange,
    placeholder,
    autoComplete,
}) {
    return (
        <div>
            <InputLabel
                htmlFor={id}
                value={label}
                className="mb-2 text-sm font-black text-slate-700"
            />

            <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="h-5 w-5" />
                </div>

                <input
                    id={id}
                    ref={inputRef}
                    value={value}
                    onChange={onChange}
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-14 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className={`absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border transition ${
                        show
                            ? 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
                    }`}
                    title={
                        show
                            ? 'Masquer le mot de passe'
                            : 'Afficher le mot de passe'
                    }
                >
                    {show ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </button>
            </div>

            <InputError message={error} className="mt-2 font-semibold" />
        </div>
    );
}