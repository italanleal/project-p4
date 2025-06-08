export default function Dashboard({ user, onLogout, onRefresh }) {
    return (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {user.display_name}</h1>

                {user.images?.[0] && (
                    <img
                        src={user.images[0].url}
                        alt={user.display_name}
                        className="rounded-full mx-auto mb-4 w-32 h-32 object-cover border-4 border-green-500"
                    />
                )}

                <table className="w-full text-sm mb-6">
                    <tbody>
                    <tr className="border-b border-gray-700">
                        <td className="py-2 font-semibold">Display Name</td>
                        <td className="py-2 text-right">{user.display_name}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                        <td className="py-2 font-semibold">ID</td>
                        <td className="py-2 text-right">{user.id}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                        <td className="py-2 font-semibold">Email</td>
                        <td className="py-2 text-right">{user.email}</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-semibold">Country</td>
                        <td className="py-2 text-right">{user.country}</td>
                    </tr>
                    </tbody>
                </table>

                <div className="flex gap-4">
                    <button
                        onClick={onRefresh}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl transition duration-150"
                    >
                        Refresh Token
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition duration-150"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
}
