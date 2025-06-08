export default function Dashboard({ user, onLogout, onRefresh }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-green-600 via-emerald-600 to-teal-400 text-transparent bg-clip-text">
                    Welcome, {user.display_name}
                </h1>

                {user.images?.[0] && (
                    <img
                        src={user.images[0].url}
                        alt={user.display_name}
                        className="rounded-full mx-auto mb-6 w-32 h-32 object-cover border-4 border-emerald-500 shadow-md"
                    />
                )}

                <table className="w-full text-sm mb-6">
                    <tbody>
                    <tr className="border-b border-gray-200">
                        <td className="py-2 font-medium text-gray-600">Display Name</td>
                        <td className="py-2 text-right font-semibold text-gray-800">{user.display_name}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                        <td className="py-2 font-medium text-gray-600">ID</td>
                        <td className="py-2 text-right font-semibold text-gray-800">{user.id}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                        <td className="py-2 font-medium text-gray-600">Email</td>
                        <td className="py-2 text-right font-semibold text-gray-800">{user.email}</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-medium text-gray-600">Country</td>
                        <td className="py-2 text-right font-semibold text-gray-800">{user.country}</td>
                    </tr>
                    </tbody>
                </table>

                <div className="flex gap-4">
                    <button
                        onClick={onRefresh}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-2xl shadow transition duration-200"
                    >
                        Refresh Token
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-2xl shadow transition duration-200"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
}
