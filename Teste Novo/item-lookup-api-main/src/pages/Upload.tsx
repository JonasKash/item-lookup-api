import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  GitCommit, 
  FileSpreadsheet, 
  Database, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

const UploadPage = () => {
  const [loading, setLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [lastCommit, setLastCommit] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    
    try {
      // O upload real já foi feito no componente FileUpload
      // Aqui apenas processamos o resultado
      console.log("Arquivo processado:", file.name);
      
      toast({
        title: "Arquivo processado!",
        description: `${file.name} foi adicionado ao sistema.`,
      });
      
    } catch (error) {
      console.error("Erro no upload:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGitCommit = async () => {
    setCommitLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Atualização de planilhas de estoque'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro no commit');
      }

      const result = await response.json();
      
      const timestamp = new Date().toLocaleString('pt-BR');
      setLastCommit(`Commit realizado - ${timestamp}`);
      
      toast({
        title: "Commit realizado com sucesso!",
        description: "As planilhas foram atualizadas no servidor.",
      });
      
    } catch (error) {
      console.error("Erro no commit:", error);
      toast({
        variant: "destructive",
        title: "Erro no commit",
        description: "Não foi possível realizar o commit no git.",
      });
    } finally {
      setCommitLoading(false);
    }
  };

  const handleRefreshDatabase = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/sync-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro na sincronização');
      }

      const result = await response.json();
      
      toast({
        title: "Base de dados atualizada!",
        description: "Os dados foram sincronizados com sucesso.",
      });
      
    } catch (error) {
      console.error("Erro na atualização:", error);
      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description: "Não foi possível atualizar a base de dados.",
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
            <Upload className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Upload de Planilhas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Faça upload das planilhas de estoque para atualizar a base de dados do sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <FileUpload onFileUpload={handleFileUpload} loading={loading} />
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            {/* Git Commit Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCommit className="h-5 w-5" />
                  Git Commit
                </CardTitle>
                <CardDescription>
                  Faça commit das alterações para o servidor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleGitCommit}
                  disabled={commitLoading || loading}
                  className="w-full"
                  size="lg"
                >
                  {commitLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Fazendo Commit...
                    </>
                  ) : (
                    <>
                      <GitCommit className="h-4 w-4 mr-2" />
                      Fazer Commit
                    </>
                  )}
                </Button>

                {lastCommit && (
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Último commit:</p>
                    <Badge variant="outline" className="font-mono">
                      {lastCommit}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Database Sync Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Sincronizar Base
                </CardTitle>
                <CardDescription>
                  Atualiza a base de dados com as novas planilhas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleRefreshDatabase}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Atualizar Base
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Instruções
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Faça upload das planilhas Excel (.xlsx, .xls)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Clique em "Fazer Commit" para enviar ao servidor
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Use "Atualizar Base" para sincronizar os dados
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Servidor Git</span>
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Conectado
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Base de Dados</span>
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Ativa
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Última Sincronização</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleString('pt-BR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage; 