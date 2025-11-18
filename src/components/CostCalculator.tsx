import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  DollarSign,
  Package,
  Users,
  AlertCircle,
  TrendingUp,
  Printer,
} from "lucide-react";
import { CostSettings, CostCalculation, Filament, Printer as PrinterType } from "@/types/model";
import { calculateCost, DEFAULT_COST_SETTINGS } from "@/utils/pricing";
import { saveCostSettings, loadCostSettings, loadFilaments, loadPrinters } from "@/utils/localStorage";
import { DEFAULT_FILAMENTS, DEFAULT_PRINTERS } from "@/utils/pricing";

interface CostCalculatorProps {
  weight: number; // gramas
}

export const CostCalculator = ({ weight }: CostCalculatorProps) => {
  const [settings, setSettings] = useState<CostSettings>(
    loadCostSettings() || DEFAULT_COST_SETTINGS
  );
  const [calculation, setCalculation] = useState<CostCalculation | null>(null);
  const [printTime, setPrintTime] = useState<number>(1.0); // horas
  
  // Chrome on Android fallback for selects
  const [isChromeOnAndroid, setIsChromeOnAndroid] = useState(false);
  useEffect(() => {
    if (typeof navigator !== "undefined" && /Android|Chrome/.test(navigator.userAgent)) {
      setIsChromeOnAndroid(true);
    }
  }, []);

  const filaments = loadFilaments() || DEFAULT_FILAMENTS;
  const printers = loadPrinters() || DEFAULT_PRINTERS;
  
  const selectedFilament = filaments.find((f) => f.id === settings.selectedFilamentId) || filaments[0];
  const selectedPrinter = printers.find((p) => p.id === settings.selectedPrinterId) || printers[0];

  useEffect(() => {
    saveCostSettings(settings);
  }, [settings]);

  const handleCalculate = () => {
    const result = calculateCost(weight, settings, selectedFilament, selectedPrinter, printTime);
    setCalculation(result);
  };

  const updateSetting = <K extends keyof CostSettings>(
    key: K,
    value: CostSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Calculadora de Custo
          </h3>
        </div>

        {/* INPUTS */}
        <div className="space-y-6">
          {/* Material */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Material</h4>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Filamento</Label>
              {isChromeOnAndroid ? (
                <select
                  value={settings.selectedFilamentId}
                  onChange={(e) => updateSetting("selectedFilamentId", e.target.value)}
                  className="h-8 w-full border rounded px-2"
                >
                  {filaments.map((filament) => (
                    <option key={filament.id} value={filament.id}>
                      {filament.name} - {formatCurrency(filament.pricePerKg)}/kg
                    </option>
                  ))}
                </select>
              ) : (
                <Select
                  value={settings.selectedFilamentId}
                  onValueChange={(value) => updateSetting("selectedFilamentId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filaments.map((filament) => (
                      <SelectItem key={filament.id} value={filament.id}>
                        {filament.name} - {formatCurrency(filament.pricePerKg)}/kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <Separator />

          {/* Impressora */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Impressora" className="w-4 h-4" />
              <h4 className="text-sm font-semibold text-foreground">Impressora</h4>
            </div>
              <div className="space-y-2">
              <Label className="text-xs">Impressora</Label>
              {isChromeOnAndroid ? (
                <select
                  value={settings.selectedPrinterId}
                  onChange={(e) => updateSetting("selectedPrinterId", e.target.value)}
                  className="h-8 w-full border rounded px-2"
                >
                  {printers.map((printer) => (
                    <option key={printer.id} value={printer.id}>
                      {printer.name} - {printer.powerW}W
                    </option>
                  ))}
                </select>
              ) : (
                <Select
                  value={settings.selectedPrinterId}
                  onValueChange={(value) => updateSetting("selectedPrinterId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {printers.map((printer) => (
                      <SelectItem key={printer.id} value={printer.id}>
                        {printer.name} - {printer.powerW}W
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="flex justify-between items-center mt-2">
                <Label className="text-xs">Tempo de Impressão (h)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={printTime}
                  onChange={(e) => setPrintTime(parseFloat(e.target.value) || 0)}
                  className="w-24 h-8 text-right text-xs"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Mão de obra */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-semibold text-foreground">Mão de Obra</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Valor/Hora (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.valorHoraMaoDeObra}
                  onChange={(e) =>
                    updateSetting("valorHoraMaoDeObra", parseFloat(e.target.value) || 0)
                  }
                  className="w-24 h-8 text-right text-xs"
                />
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-xs">Horas Trabalhadas</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={settings.horasMaoDeObra}
                  onChange={(e) =>
                    updateSetting("horasMaoDeObra", parseFloat(e.target.value) || 0)
                  }
                  className="w-24 h-8 text-right text-xs"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Custos extras */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-green-500" />
              <h4 className="text-sm font-semibold text-foreground">Custos Extras</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Embalagem (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.custoEmbalagem}
                  onChange={(e) =>
                    updateSetting("custoEmbalagem", parseFloat(e.target.value) || 0)
                  }
                  className="w-24 h-8 text-right text-xs"
                />
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-xs">Manutenção (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.custoManutencao}
                  onChange={(e) =>
                    updateSetting("custoManutencao", parseFloat(e.target.value) || 0)
                  }
                  className="w-24 h-8 text-right text-xs"
                />
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-xs">Outros (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.outrosCustos}
                  onChange={(e) =>
                    updateSetting("outrosCustos", parseFloat(e.target.value) || 0)
                  }
                  className="w-24 h-8 text-right text-xs"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Taxa de falha */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <h4 className="text-sm font-semibold text-foreground">Taxa de Falha</h4>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-xs">Percentual (%)</Label>
              <Input
                type="number"
                step="1"
                min="0"
                max="100"
                value={settings.taxaFalhaPercent}
                onChange={(e) =>
                  updateSetting("taxaFalhaPercent", parseFloat(e.target.value) || 0)
                }
                className="w-24 h-8 text-right text-xs"
              />
            </div>
          </div>

          <Separator />

          {/* Precificação */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <h4 className="text-sm font-semibold text-foreground">Precificação</h4>
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-xs">Markup (%)</Label>
              <Input
                type="number"
                step="1"
                min="0"
                value={settings.markupPercent}
                onChange={(e) =>
                  updateSetting("markupPercent", parseFloat(e.target.value) || 0)
                }
                className="w-24 h-8 text-right text-xs"
              />
            </div>
          </div>

          <Separator />

          {/* Impostos e Taxas */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-red-500" />
              <h4 className="text-sm font-semibold text-foreground">Impostos e Taxas</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Impostos (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.impostosPercent}
                  onChange={(e) =>
                    updateSetting("impostosPercent", parseFloat(e.target.value) || 0)
                  }
                  className="w-24 h-8 text-right text-xs"
                />
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-xs">Taxa Cartão (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.taxaCartaoPercent}
                  onChange={(e) =>
                    updateSetting("taxaCartaoPercent", parseFloat(e.target.value) || 0)
                  }
                  className="w-24 h-8 text-right text-xs"
                />
              </div>
              <div className="flex justify-between items-center">
                <Label className="text-xs">Taxa Marketplace (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.taxaMarketplacePercent}
                  onChange={(e) =>
                    updateSetting(
                      "taxaMarketplacePercent",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-24 h-8 text-right text-xs"
                />
              </div>
            </div>
          </div>

          {/* Botão Calcular */}
          <Button onClick={handleCalculate} className="w-full" size="lg">
            <Calculator className="w-4 h-4 mr-2" />
            Calcular Custo
          </Button>
        </div>
      </Card>

      {/* RESULTADOS */}
      {calculation && (
        <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Resumo de Custos
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Material:</span>
                <span className="text-foreground">
                  {formatCurrency(calculation.custoMaterial)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Energia:</span>
                <span className="text-foreground">
                  {formatCurrency(calculation.custoEnergia)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amortização:</span>
                <span className="text-foreground">
                  {formatCurrency(calculation.custoAmortizacao)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mão de Obra:</span>
                <span className="text-foreground">
                  {formatCurrency(calculation.custoMaoDeObra)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Custos Extras:</span>
                <span className="text-foreground">
                  {formatCurrency(calculation.custosExtras)}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-medium">
              <span className="text-foreground">Custo Base:</span>
              <span className="text-foreground">
                {formatCurrency(calculation.custoBase)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">+ Taxa de Falha:</span>
              <span className="text-orange-600 dark:text-orange-400">
                {formatCurrency(calculation.custoComFalha - calculation.custoBase)}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span className="text-foreground">Custo Total:</span>
              <span className="text-foreground">
                {formatCurrency(calculation.custoTotal)}
              </span>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg">
              <span className="text-primary">Preço Sugerido:</span>
              <span className="text-primary">
                {formatCurrency(calculation.precoSugerido)}
              </span>
            </div>

            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600 dark:text-green-400">Lucro Bruto:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {formatCurrency(calculation.lucroBruto)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-600 dark:text-red-400">- Taxas:</span>
                <span className="text-red-600 dark:text-red-400">
                  {formatCurrency(calculation.totalTaxas)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-green-600 dark:text-green-400">Lucro Líquido:</span>
                <span className="text-green-600 dark:text-green-400 text-lg">
                  {formatCurrency(calculation.lucroLiquido)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
