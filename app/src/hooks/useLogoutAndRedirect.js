import { useUser } from "@/context/UserProvider";
import { useNavigate } from "react-router-dom";

export function useLogoutAndRedirect() {
    const { logout, logoutFull } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleLogoutFull = () => {
        logoutFull();
        navigate("/");
    };

    return { handleLogout, handleLogoutFull };
}
