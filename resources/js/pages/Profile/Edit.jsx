import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    BadgeCheck,
    Camera,
    CheckCircle2,
    ImagePlus,
    KeyRound,
    Lock,
    Mail,
    Save,
    Settings,
    Shield,
    Sparkles,
    UploadCloud,
    User,
} from 'lucide-react';

import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const fileInput = useRef(null);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        image: null,
    });

    const roles = useMemo(() => {
        const userRoles = user?.roles || [];

        if (!Array.isArray(userRoles)) {
            return [];
        }

        return userRoles
            .map((role) => (typeof role === 'string' ? role : role?.name))
            .filter(Boolean);
    }, [user]);

    const mainRole = roles[0] || 'Utilisateur';

    const photoUrl = useMemo(() => {
        if (preview) {
            return preview;
        }

        if (!user?.image) {
            return null;
        }

        if (
            user.image.startsWith('http') ||
            user.image.startsWith('/storage/')
        ) {
            return user.image;
        }

        return `/storage/${user.image}`;
    }, [preview, user?.image]);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setData('image', file);
        setPreview(URL.createObjectURL(file));
    };

    const submitPhoto = (e) => {
        e.preventDefault();

        post(route('profile.photo.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset('image');
                setPreview(null);

                if (fileInput.current) {
                    fileInput.current.value = '';
                }
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Mon profil
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                        Gérez vos informations personnelles, votre photo et la
                        sécurité de votre compte.
                    </p>
                </div>
            }
        >
            <Head title="Mon profil" />

            <div className="min-h-screen bg-slate-50 px-4 py-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 p-6 text-white shadow-xl">
                        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-sm" />
                        <div className="absolute -bottom-20 left-20 h-52 w-52 rounded-full bg-white/10 blur-sm" />

                        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="relative mx-auto sm:mx-0">
                                    <div className="relative h-36 w-36 rounded-full bg-white/20 p-2 shadow-2xl">
                                        {photoUrl ? (
                                            <img
                                                src={photoUrl}
                                                alt={user?.name || 'Profil'}
                                                className="h-full w-full rounded-full border-4 border-white object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-white text-5xl font-black text-indigo-700">
                                                {user?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || (
                                                    <User size={48} />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInput.current?.click()
                                        }
                                        className="absolute bottom-3 right-2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-white shadow-lg transition hover:scale-105 hover:bg-indigo-700"
                                        title="Changer la photo"
                                    >
                                        <Camera className="h-5 w-5" />
                                    </button>

                                    <input
                                        ref={fileInput}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>

                                <div className="text-center sm:text-left">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                                        <BadgeCheck className="h-4 w-4" />
                                        Profil actif
                                    </div>

                                    <h1 className="mt-4 text-3xl font-black md:text-4xl">
                                        Bonjour, {user?.name}
                                    </h1>

                                    <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-blue-100 md:text-base">
                                        Depuis cette page, vous pouvez mettre à
                                        jour votre photo, modifier vos
                                        informations personnelles et renforcer la
                                        sécurité de votre compte.
                                    </p>

                                    <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-indigo-700">
                                            <Shield className="h-4 w-4" />
                                            {mainRole}
                                        </span>

                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
                                            <Mail className="h-4 w-4" />
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <form
                                onSubmit={submitPhoto}
                                className="w-full rounded-3xl bg-white/15 p-5 backdrop-blur lg:w-80"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white">
                                        <ImagePlus className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="font-black text-white">
                                            Photo de profil
                                        </p>
                                        <p className="text-xs font-semibold text-blue-100">
                                            JPG, PNG ou WEBP
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => fileInput.current?.click()}
                                    className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 font-bold text-white transition hover:bg-white/20"
                                >
                                    <UploadCloud className="h-5 w-5" />
                                    Choisir une photo
                                </button>

                                {data.image && (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-indigo-700 shadow-lg transition hover:bg-blue-50 disabled:opacity-60"
                                    >
                                        <Save className="h-5 w-5" />
                                        {processing
                                            ? 'Enregistrement...'
                                            : 'Enregistrer la photo'}
                                    </button>
                                )}

                                {errors.image && (
                                    <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                                        {errors.image}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        <InfoCard
                            icon={<User className="h-6 w-6" />}
                            label="Nom complet"
                            value={user?.name || 'Non renseigné'}
                            description="Identité affichée dans la plateforme"
                            color="indigo"
                        />

                        <InfoCard
                            icon={<Mail className="h-6 w-6" />}
                            label="Adresse email"
                            value={user?.email || 'Non renseigné'}
                            description="Utilisée pour la connexion"
                            color="blue"
                        />

                        <InfoCard
                            icon={<Shield className="h-6 w-6" />}
                            label="Sécurité"
                            value="Compte protégé"
                            description="Mot de passe modifiable"
                            color="emerald"
                        />
                    </div>

                    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                                        <Settings className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-slate-800">
                                            Informations personnelles
                                        </h3>
                                        <p className="mt-1 text-sm font-semibold text-slate-500">
                                            Modifiez votre nom et votre adresse
                                            email.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-2xl"
                                />
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                                        <KeyRound className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-slate-800">
                                            Sécurité du compte
                                        </h3>
                                        <p className="mt-1 text-sm font-semibold text-slate-500">
                                            Changez régulièrement votre mot de
                                            passe.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <UpdatePasswordForm className="max-w-2xl" />
                            </div>
                        </section>
                    </div>

                    <div className="rounded-[2rem] border border-indigo-100 bg-indigo-50 p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                                    <Sparkles className="h-6 w-6" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-slate-800">
                                        Conseil de sécurité
                                    </h3>
                                    <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
                                        Utilisez un mot de passe fort et évitez
                                        de partager vos identifiants. Votre
                                        compte permet d’accéder aux données de la
                                        plateforme selon votre rôle.
                                    </p>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-indigo-700 shadow-sm">
                                <CheckCircle2 className="h-4 w-4" />
                                Recommandé
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function InfoCard({ icon, label, value, description, color }) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-700',
        blue: 'bg-blue-50 text-blue-700',
        emerald: 'bg-emerald-50 text-emerald-700',
    };

    return (
        <div className="group rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        colors[color] || colors.indigo
                    }`}
                >
                    {icon}
                </div>

                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                    Profil
                </div>
            </div>

            <p className="text-sm font-bold text-slate-500">
                {label}
            </p>

            <p className="mt-2 break-words text-lg font-black text-slate-800">
                {value}
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-400">
                {description}
            </p>
        </div>
    );
}