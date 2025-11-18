import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Briefcase, TrendingUp, DollarSign, Calculator } from "lucide-react";
import { Model3D, CostSettings } from "@/types/model";
import { calculateCost } from "@/utils/pricing";
import { calculateVolume, calculateWeight } from "@/utils/modelCalculations";
import { loadFilaments, loadPrinters } from "@/utils/localStorage";
import { DEFAULT_FILAMENTS, DEFAULT_PRINTERS } from "@/utils/pricing";

interface ProjectSummaryProps {
  models: Model3D[];
  costSettings: CostSettings;
  density: number;
  infill: number;
}

export const ProjectSummary = ({
  models,
  costSettings,
  density,
  infill,
}: ProjectSummaryProps) => {
  const [totals, setTotals] = useState<any>(null);
  const [printTime] = useState<number>(1.0); // Default print time

  const filaments = loadFilaments() || DEFAULT_FILAMENTS;
  const printers = loadPrinters() || DEFAULT_PRINTERS;

  const selectedFilament = filaments.find((f) => f.id === costSettings.selectedFilamentId) || filaments[0];
  const selectedPrinter = printers.find((p) => p.id === costSettings.selectedPrinterId) || printers[0];

  const handleCalculate = () => {
    const calculatedTotals = models.reduce(
      (acc, model) => {
        const volume = calculateVolume(model.geometry, model.scale);
        const weight = calculateWeight(volume, selectedFilament.density, infill);
        const cost = calculateCost(weight, costSettings, selectedFilament, selectedPrinter, printTime);

        return {
          custoTotal: acc.custoTotal + cost.custoTotal,
          precoSugerido: acc.precoSugerido + cost.precoSugerido,
          lucroBruto: acc.lucroBruto + cost.lucroBruto,
          lucroLiquido: acc.lucroLiquido + cost.lucroLiquido,
          totalTaxas: acc.totalTaxas + cost.totalTaxas,
        };
      },
      {
        custoTotal: 0,
        precoSugerido: 0,
        lucroBruto: 0,
        lucroLiquido: 0,
        totalTaxas: 0,
      }
    );
    setTotals(calculatedTotals);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (models.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-accent/10 border-accent/30">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-foreground">
          Resumo do Projeto
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Total de Modelos:
          </span>
          <span className="text-lg font-semibold text-foreground">
            {models.length}
          </span>
        </div>

        <Button onClick={handleCalculate} className="w-full" size="sm">
          <Calculator className="w-4 h-4 mr-2" />
          Calcular Custos do Projeto
        </Button>

        {totals && (
          <>
            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Custo Total:</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(totals.custoTotal)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Preço Total Sugerido:
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(totals.precoSugerido)}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-foreground">
                    Lucro Bruto:
                  </span>
                </div>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totals.lucroBruto)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground ml-6">
                  Total em Taxas:
                </span>
                <span className="text-sm text-red-600 dark:text-red-400">
                  -{formatCurrency(totals.totalTaxas)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-bold text-foreground">
                    Lucro Líquido:
                  </span>
                </div>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totals.lucroLiquido)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
