import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BulletinView from "@/Components/BulletinView";

export default function BulletinShow({ bulletin }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Bulletin de mon enfant
                    </h2>

                    <p className="text-sm text-slate-500">
                        Consultation du bulletin trimestriel.
                    </p>
                </div>
            }
        >
            <BulletinView
                bulletin={bulletin}
                title="Bulletin de mon enfant"
                backHref={route("parent.dashboard")}
                schoolName="LYCÉE PRIVÉ A.P.E"
            />
        </AuthenticatedLayout>
    );
}