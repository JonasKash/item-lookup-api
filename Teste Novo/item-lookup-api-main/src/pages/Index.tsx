import { useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import { ItemCard, Item } from "@/components/ItemCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useToast } from "@/hooks/use-toast";
import { Package2, Warehouse } from "lucide-react";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  // Dados de exemplo - será substituído pela API real
  const mockData: Record<string, Item> = {
    "00001013850064": {
      codigo: "00001013850064",
      descricao: "TAMPA ENCHIMENTO",
      estoque: 1,
      preco: 225.15,
      localizacao: "05A04"
    },
    "0000160521": {
      codigo: "0000160521",
      descricao: "JUNTA DA TAMPA DO CABECOTE",
      estoque: 4,
      preco: 629.06,
      localizacao: "22D01"
    },
    "0000173274": {
      codigo: "0000173274",
      descricao: "PINO DE PRESSAO",
      estoque: 1,
      preco: 47.25,
      localizacao: "04H08"
    }
  };

  const handleSearch = async (codigo: string) => {
    setLoading(true);
    setError("");
    setItem(null);

    try {
      // Simula chamada da API - substituir por fetch real
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula delay da API
      
      const foundItem = mockData[codigo];
      
      if (foundItem) {
        setItem(foundItem);
        toast({
          title: "Item encontrado!",
          description: `${foundItem.descricao} foi localizado no estoque.`,
        });
      } else {
        setError("Item não encontrado. Verifique o código e tente novamente.");
        toast({
          variant: "destructive",
          title: "Item não encontrado",
          description: "O código informado não existe no estoque.",
        });
      }
    } catch (error) {
      setError("Erro ao buscar item. Tente novamente.");
      toast({
        variant: "destructive",
        title: "Erro na busca",
        description: "Ocorreu um erro ao consultar o estoque.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Warehouse className="h-12 w-12 text-primary" />
              <Package2 className="h-6 w-6 text-accent absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Controle de Estoque
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Digite o código do item para consultar informações detalhadas sobre estoque, 
            preço e localização no depósito.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <SearchInput onSearch={handleSearch} loading={loading} />
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {error && <ErrorMessage message={error} />}
          {item && <ItemCard item={item} />}
        </div>

        {/* Instructions */}
        {!loading && !item && !error && (
          <div className="text-center mt-16 opacity-60">
            <p className="text-muted-foreground">
              Códigos de exemplo para teste: 00001013850064, 0000160521, 0000173274
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
