import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Hash, DollarSign } from "lucide-react";

export interface Item {
  codigo: string;
  descricao: string;
  estoque: number;
  preco: number;
  localizacao: string;
}

interface ItemCardProps {
  item: Item;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card hover:shadow-xl transition-all duration-300 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Package className="h-5 w-5" />
          Item Encontrado
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Código</p>
            <p className="font-mono font-medium text-foreground">{item.codigo}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Descrição</p>
          <p className="font-semibold text-lg text-foreground">{item.descricao}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Estoque</p>
              <Badge 
                variant={item.estoque > 0 ? "default" : "destructive"}
                className={item.estoque > 0 ? "bg-success hover:bg-success/80" : ""}
              >
                {item.estoque} unid.
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Preço</p>
              <p className="font-semibold text-foreground">
                R$ {item.preco.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t">
          <MapPin className="h-4 w-4 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Localização</p>
            <Badge variant="outline" className="border-accent text-accent">
              {item.localizacao}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};