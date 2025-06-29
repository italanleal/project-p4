import { UserContext } from "./UserContext";

export function UserProvider({ children, user, onLogout, onRefresh }) {
    return (
        <UserContext.Provider value={{ user, onLogout, onRefresh }}>
            {children}
        </UserContext.Provider>
    );
}
