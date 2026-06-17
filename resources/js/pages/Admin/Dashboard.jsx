import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import {
    Users,
    UserCheck,
    BookOpen,
    School,
    BarChart3,
    PieChart,
} from 'lucide-react';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

export default function Dashboard({ stats, studentsByClass }) {
    const labels = studentsByClass.map((c) => c.name);
    const values = studentsByClass.map((c) => c.count);

    const colors = [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#14b8a6',
    ];

    const doughnutData = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 10,
            },
        ],
    };

    const barData = {
        labels,
        datasets: [
            {
                label: 'Nombre d’élèves',
                data: values,
                backgroundColor: colors,
                borderRadius: 12,
                borderSkipped: false,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 18,
                },
            },
        },
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
                grid: {
                    color: '#e5e7eb',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const statCards = [
        {
            title: 'Élèves',
            value: stats.students,
            icon: Users,
            color: 'from-blue-500 to-blue-700',
        },
        {
            title: 'Enseignants',
            value: stats.teachers,
            icon: UserCheck,
            color: 'from-emerald-500 to-emerald-700',
        },
        {
            title: 'Matières',
            value: stats.subjects,
            icon: BookOpen,
            color: 'from-amber-500 to-orange-600',
        },
        {
            title: 'Classes',
            value: stats.classes,
            icon: School,
            color: 'from-violet-500 to-purple-700',
        },
    ];

    return (
        <AppLayout
            header={
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        Dashboard Admin
                    </h2>
                    <p className="text-sm text-slate-500">
                        Vue générale de la gestion scolaire
                    </p>
                </div>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="space-y-8">

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.color} p-6 text-white shadow-xl`}
                            >
                                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20" />

                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white/80">
                                            Total {card.title}
                                        </p>
                                        <p className="mt-2 text-4xl font-black">
                                            {card.value}
                                        </p>
                                    </div>

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                                        <Icon size={30} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">
                                    Répartition par classe
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Vue circulaire des effectifs
                                </p>
                            </div>

                            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                                <PieChart size={24} />
                            </div>
                        </div>

                        <div className="h-[340px]">
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">
                                    Histogramme des élèves
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Nombre d’élèves par classe
                                </p>
                            </div>

                            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                                <BarChart3 size={24} />
                            </div>
                        </div>

                        <div className="h-[340px]">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}