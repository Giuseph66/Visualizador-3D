import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Printer as PrinterIcon, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Filament, Printer } from "@/types/model";
import { saveFilaments, loadFilaments, savePrinters, loadPrinters } from "@/utils/localStorage";
import { DEFAULT_FILAMENTS, DEFAULT_PRINTERS } from "@/utils/pricing";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

const Settings = () => {
  const navigate = useNavigate();
  const [filaments, setFilaments] = useState<Filament[]>(
    loadFilaments() || DEFAULT_FILAMENTS
  );
  const [printers, setPrinters] = useState<Printer[]>(
    loadPrinters() || DEFAULT_PRINTERS
  );

  useEffect(() => {
    saveFilaments(filaments);
  }, [filaments]);

  useEffect(() => {
    savePrinters(printers);
  }, [printers]);

  const addFilament = () => {
    const newFilament: Filament = {
      id: `filament_${Date.now()}`,
      name: "Novo Filamento",
      pricePerKg: 80,
      density: 1.24,
    };
    setFilaments([...filaments, newFilament]);
    toast.success("Filamento adicionado!");
  };

  const updateFilament = (id: string, field: keyof Filament, value: any) => {
    setFilaments(
      filaments.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const deleteFilament = (id: string) => {
    if (filaments.length <= 1) {
      toast.error("Deve haver pelo menos um filamento!");
      return;
    }
    setFilaments(filaments.filter((f) => f.id !== id));
    toast.success("Filamento removido!");
  };

  const addPrinter = () => {
    const newPrinter: Printer = {
      id: `printer_${Date.now()}`,
      name: "Nova Impressora",
      powerW: 200,
      valuePrice: 2000,
      lifetimeHours: 5000,
      energyTariffKwh: 0.75,
    };
    setPrinters([...printers, newPrinter]);
    toast.success("Impressora adicionada!");
  };

  const updatePrinter = (id: string, field: keyof Printer, value: any) => {
    setPrinters(
      printers.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const deletePrinter = (id: string) => {
    if (printers.length <= 1) {
      toast.error("Deve haver pelo menos uma impressora!");
      return;
    }
    setPrinters(printers.filter((p) => p.id !== id));
    toast.success("Impressora removida!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie filamentos e impressoras
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Filamentos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Filamentos</h2>
            </div>
            <Button onClick={addFilament} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            {filaments.map((filament) => (
              <Card key={filament.id} className="p-4 bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs">Nome</Label>
                    <Input
                      value={filament.name}
                      onChange={(e) =>
                        updateFilament(filament.id, "name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Preço (R$/kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={filament.pricePerKg}
                      onChange={(e) =>
                        updateFilament(
                          filament.id,
                          "pricePerKg",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Densidade (g/cm³)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={filament.density}
                      onChange={(e) =>
                        updateFilament(
                          filament.id,
                          "density",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteFilament(filament.id)}
                      className="w-full gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Separator />

        {/* Impressoras */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PrinterIcon className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Impressoras</h2>
            </div>
            <Button onClick={addPrinter} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            {printers.map((printer) => (
              <Card key={printer.id} className="p-4 bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-3">
                    <Label className="text-xs">Nome</Label>
                    <Input
                      value={printer.name}
                      onChange={(e) =>
                        updatePrinter(printer.id, "name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Potência (W)</Label>
                    <Input
                      type="number"
                      value={printer.powerW}
                      onChange={(e) =>
                        updatePrinter(
                          printer.id,
                          "powerW",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Valor (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={printer.valuePrice}
                      onChange={(e) =>
                        updatePrinter(
                          printer.id,
                          "valuePrice",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Vida Útil (horas)</Label>
                    <Input
                      type="number"
                      value={printer.lifetimeHours}
                      onChange={(e) =>
                        updatePrinter(
                          printer.id,
                          "lifetimeHours",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs">Tarifa de Energia (R$/kWh)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={printer.energyTariffKwh}
                      onChange={(e) =>
                        updatePrinter(
                          printer.id,
                          "energyTariffKwh",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePrinter(printer.id)}
                      className="w-full gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
