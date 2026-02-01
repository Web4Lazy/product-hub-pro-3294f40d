import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { ClientStatus, CLIENTS } from "@/types/product";

export const SettingsPage = () => {
  const [clientStatuses, setClientStatuses] = useState<ClientStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientStatuses = async () => {
      try {
        const response = await fetch("/api/clienti/status");
        if (!response.ok) {
          throw new Error("Failed to fetch client statuses");
        }
        const data: ClientStatus[] = await response.json();
        setClientStatuses(data);
      } catch (err) {
        setError("Impossibile recuperare lo stato dei clienti");
        // Fallback: show all clients as not connected
        setClientStatuses(CLIENTS.map((nome) => ({ nome, collegato: false })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientStatuses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
      <h2 className="text-2xl font-semibold text-foreground mb-2">Settings</h2>

      <div className="mt-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-2">Clienti collegati</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Stato dei token di autorizzazione Amazon per ogni cliente. Gestiti dal backend.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-8 gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-muted-foreground">Caricamento stato clienti...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {clientStatuses.map((client) => (
                <div
                  key={client.nome}
                  className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg"
                >
                  <span className="font-medium text-foreground">{client.nome}</span>
                  {client.collegato ? (
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-success/20 text-success-foreground rounded-lg text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Collegato
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm font-medium">
                      <XCircle className="w-4 h-4" />
                      Non collegato
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-warning-background border border-warning-border rounded-lg">
              <p className="text-warning-foreground text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
