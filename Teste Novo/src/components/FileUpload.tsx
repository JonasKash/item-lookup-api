import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  loading?: boolean;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export const FileUpload = ({ onFileUpload, loading = false }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const excelFiles = acceptedFiles.filter(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );

    if (excelFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos Excel (.xlsx ou .xls)",
      });
      return;
    }

    for (const file of excelFiles) {
      const uploadedFile: UploadedFile = {
        file,
        status: 'uploading',
        progress: 0
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);

      let progressInterval: NodeJS.Timeout;

      try {
        // Simula progresso de upload
        progressInterval = setInterval(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === file 
                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                : f
            )
          );
        }, 100);

        // Upload real para a API
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Erro no upload');
        }

        await onFileUpload(file);

        clearInterval(progressInterval);
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === file 
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        );

        toast({
          title: "Arquivo enviado com sucesso!",
          description: `${file.name} foi processado e adicionado ao sistema.`,
        });

      } catch (error) {
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === file 
              ? { ...f, status: 'error', progress: 0, error: 'Erro no upload' }
              : f
          )
        );

        toast({
          variant: "destructive",
          title: "Erro no upload",
          description: `Não foi possível processar ${file.name}.`,
        });
      }
    }
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true,
    disabled: loading
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Upload de Planilhas
          </CardTitle>
          <CardDescription>
            Arraste e solte arquivos Excel (.xlsx, .xls) ou clique para selecionar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium text-primary">Solte os arquivos aqui...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Arraste arquivos Excel aqui ou clique para selecionar
                </p>
                <p className="text-sm text-muted-foreground">
                  Suporta arquivos .xlsx e .xls
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Arquivos Processados</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                disabled={loading}
              >
                Limpar Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((uploadedFile, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{uploadedFile.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Icon */}
                    {uploadedFile.status === 'uploading' && (
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                    {uploadedFile.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {uploadedFile.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}

                    {/* Progress Bar */}
                    {uploadedFile.status === 'uploading' && (
                      <div className="w-24">
                        <Progress value={uploadedFile.progress} className="h-2" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <Badge
                      variant={
                        uploadedFile.status === 'success' ? 'default' :
                        uploadedFile.status === 'error' ? 'destructive' : 'secondary'
                      }
                    >
                      {uploadedFile.status === 'uploading' && 'Enviando...'}
                      {uploadedFile.status === 'success' && 'Concluído'}
                      {uploadedFile.status === 'error' && 'Erro'}
                    </Badge>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.file)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 