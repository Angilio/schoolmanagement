import AppLayout from "@/Layouts/AppLayout";
import BulletinView from "@/Components/BulletinView";

export default function Show({ bulletin }) {
    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Détail bulletin
                    </h2>
                    <p className="text-sm text-slate-500">
                        Consultation du bulletin généré.
                    </p>
                </div>
            }
        >
            <BulletinView
                bulletin={bulletin}
                title="Bulletin scolaire"
                backHref={route("admin.bulletins.index")}
                theme="blue"
            />
        </AppLayout>
    );
}