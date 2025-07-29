import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Warehouse, Upload } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Warehouse className="h-6 w-6" />
            Estoque API
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button
                variant={location.pathname === "/" ? "default" : "ghost"}
                size="sm"
              >
                <Warehouse className="h-4 w-4 mr-2" />
                Consulta
              </Button>
            </Link>
            <Link to="/upload">
              <Button
                variant={location.pathname === "/upload" ? "default" : "ghost"}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}; 