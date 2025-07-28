import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface SearchInputProps {
  onSearch: (codigo: string) => void;
  loading?: boolean;
}

export const SearchInput = ({ onSearch, loading = false }: SearchInputProps) => {
  const [codigo, setCodigo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.trim()) {
      onSearch(codigo.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Digite o código do item..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="pl-10 h-12 text-base border-2 focus:border-accent"
            disabled={loading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!codigo.trim() || loading}
          className="h-12 px-6 bg-primary hover:bg-primary/90"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Buscar"
          )}
        </Button>
      </div>
    </form>
  );
};