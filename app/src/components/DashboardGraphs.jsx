export default function DashboardGraphs({ user }) {
    return (
        <div className="min-h-screen space-y-3 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-6">

            <header className="mb-8 text-center">
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-400 text-transparent bg-clip-text">
                    Your Music Graph
                </h2>
                <p className="text-gray-600 mt-2">Visualize and explore your music connections.</p>
            </header>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-emerald-600 mb-4">Search Music & View Connections</h3>
                {/* Search input + filter controls + graph rendering */}
            </div>

            <section className="grid md:grid-cols-4 gap-8 mb-12">
                <GraphCard title="Top Artists Graph"/>
            </section>

        </div>
    );
}

function GraphCard({title}) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h4 className="text-lg font-semibold mb-2">{title}</h4>
            <div
                className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-lg">
                <span>Graph will render here</span>
            </div>
        </div>
    );
}
