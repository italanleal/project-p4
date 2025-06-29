import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppNavbar({ onLogout, links = [], user }) {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav
            className="bg-background text-foreground border-b border-border px-4 py-2 flex justify-between items-center">
            {/* Esquerda: Logo */}
            <span className="text-xl font-bold tracking-tight text-primary">
        Connectify
    </span>

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
                                src={user.profileImageUrl}
                                alt={user?.userDisplayName}
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
                        <DropdownMenuItem onClick={onLogout}>
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
