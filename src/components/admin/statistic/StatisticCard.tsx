"use client";

interface StatisticCardProps {
    title: string;
    value: number;
    icon: string;
    color: string;
    description: string;
}

export default function StatisticCard({ title, value, icon, color, description }: StatisticCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className={`${color} p-4 text-white flex justify-between items-center`}>
                <div>
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <p className="text-sm opacity-80">{description}</p>
                </div>
                <div className="text-4xl">{icon}</div>
            </div>
            <div className="p-4">
                <div className="text-3xl font-bold">{value.toLocaleString()}</div>
                <div className="mt-2 text-sm text-gray-500">
                    {/* Add trend indicator if needed */}
                </div>
            </div>
        </div>
    );
}
