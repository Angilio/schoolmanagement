import AppLayout from "@/Layouts/AppLayout";
import BulletinView from "@/Components/BulletinView";

export default function Show({ bulletin }) {
    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Mon bulletin
                    </h2>
                    <p className="text-sm text-slate-500">
                        Détail du bulletin scolaire.
                    </p>
                </div>
            }
        >
            <BulletinView
                bulletin={bulletin}
                title="Mon bulletin"
                backHref={route("student.bulletins.index")}
                theme="emerald"
            />
        </AppLayout>
    );
}