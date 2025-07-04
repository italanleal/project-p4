import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator.jsx";
import {useLogoutAndRedirect} from "@/hooks/useLogoutAndRedirect.js";

export default function AppNavbar({ links = [], user }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleLogout, handleLogoutFull } = useLogoutAndRedirect();

    return (
        <nav
            className="bg-background text-foreground border-b border-border px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <img src="/icons/favicon-32x32.png" alt="Logo Connectify" className="h-8 w-8"/>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-300 text-transparent bg-clip-text">
                    Connectify
                </span>
            </div>


            {/* Direita: Links e usuário */}
            <div className="flex items-center gap-6">
                {/* Navegação */}
                <div className="flex gap-4 text-sm">
                    {links.map(({label, to}) => (
                        <Link
                            key={to}
                            to={to}
                            className={`transition-colors hover:text-primary ${
                                location.pathname === to ? "text-primary font-medium" : ""
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Avatar dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage
                                src={user.profileImageUrl ?? ""}
                                alt={user?.userDisplayName ?? "User Avatar"}
                            />
                            <AvatarFallback>
                                {user?.userDisplayName?.[0]?.toUpperCase() ?? "U"}

                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                            Ver Perfil
                        </DropdownMenuItem>
                        <Separator className="m-1"/>
                        <DropdownMenuItem onClick={handleLogout}>
                            Sair
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogoutFull}>
                            Sair e pedir novo acesso
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
