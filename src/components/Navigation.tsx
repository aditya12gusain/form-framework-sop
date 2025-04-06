import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
    const pathname = useLocation().pathname;
    return (
        <nav className="flex gap-4 p-4 bg-gray-100">
            <Link
                to="/"
                className={cn(
                    "px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md",
                    {
                        "bg-gray-200": pathname === "/",
                    }
                )}
            >
                Base Implementation
            </Link>
            <Link
                to="/advanced"
                className={cn(
                    "px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md",
                    {
                        "bg-gray-200": pathname === "/advanced",
                    }
                )}
            >
                Advanced Implementation
            </Link>
        </nav>
    );
}
