import { CostSettings, CostCalculation, Filament, Printer } from "@/types/model";

export const calculateCost = (
  pesoEstimadoGramas: number,
  settings: CostSettings,
  filament: Filament,
  printer: Printer,
  tempoImpressaoHoras: number
): CostCalculation => {
  // 1. Custo de material (R$)
  const custoMaterial = (pesoEstimadoGramas / 1000) * filament.pricePerKg;

  // 2. Custo de energia (R$)
  const custoEnergia =
    (printer.powerW / 1000) *
    tempoImpressaoHoras *
    printer.energyTariffKwh;

  // 3. Custo de amortização/desgaste da impressora (R$)
  const custoAmortizacao =
    (printer.valuePrice / printer.lifetimeHours) *
    tempoImpressaoHoras;

  // 4. Custo de mão de obra (R$)
  const custoMaoDeObra =
    settings.valorHoraMaoDeObra * settings.horasMaoDeObra;

  // 5. Custos extras (R$)
  const custosExtras =
    settings.custoEmbalagem +
    settings.custoManutencao +
    settings.outrosCustos;

  // 6. Custo base
  const custoBase =
    custoMaterial +
    custoEnergia +
    custoAmortizacao +
    custoMaoDeObra +
    custosExtras;

  // 7. Taxa de falha / desperdício (%)
  const custoComFalha = custoBase * (1 + settings.taxaFalhaPercent / 100);

  // 8. Custo total
  const custoTotal = custoComFalha;

  // 9. Precificação (Preço e Lucro)
  const precoSugerido = custoTotal * (1 + settings.markupPercent / 100);
  const lucroBruto = precoSugerido - custoTotal;

  // 10. Descontos, impostos e taxas
  const totalTaxas =
    (precoSugerido *
      (settings.impostosPercent +
        settings.taxaCartaoPercent +
        settings.taxaMarketplacePercent)) /
    100;
  const lucroLiquido = lucroBruto - totalTaxas;

  return {
    custoMaterial,
    custoEnergia,
    custoAmortizacao,
    custoMaoDeObra,
    custosExtras,
    custoBase,
    custoComFalha,
    custoTotal,
    precoSugerido,
    lucroBruto,
    totalTaxas,
    lucroLiquido,
  };
};

export const DEFAULT_FILAMENTS: Filament[] = [
  { id: "pla", name: "PLA", pricePerKg: 80.0, density: 1.24 },
  { id: "petg", name: "PETG", pricePerKg: 95.0, density: 1.27 },
  { id: "abs", name: "ABS", pricePerKg: 85.0, density: 1.04 },
  { id: "tpu", name: "TPU", pricePerKg: 120.0, density: 1.21 },
  { id: "nylon", name: "Nylon", pricePerKg: 150.0, density: 1.14 },
];

export const DEFAULT_PRINTERS: Printer[] = [
  {
    id: "ender3",
    name: "Ender 3",
    powerW: 200,
    valuePrice: 1500.0,
    lifetimeHours: 5000,
    energyTariffKwh: 0.75,
  },
  {
    id: "prusa_mk4",
    name: "Prusa MK4",
    powerW: 250,
    valuePrice: 4000.0,
    lifetimeHours: 8000,
    energyTariffKwh: 0.75,
  },
  {
    id: "bambu_x1c",
    name: "Bambu Lab X1C",
    powerW: 350,
    valuePrice: 6000.0,
    lifetimeHours: 10000,
    energyTariffKwh: 0.75,
  },
];

export const DEFAULT_COST_SETTINGS: CostSettings = {
  // Material e Impressora
  selectedFilamentId: "pla",
  selectedPrinterId: "ender3",
  
  // Mão de obra
  valorHoraMaoDeObra: 30.0,
  horasMaoDeObra: 0.5,
  
  // Custos extras
  custoEmbalagem: 2.0,
  custoManutencao: 1.0,
  outrosCustos: 0.0,
  
  // Taxa de falha
  taxaFalhaPercent: 10,
  
  // Markup
  markupPercent: 200,
  
  // Taxas
  impostosPercent: 6,
  taxaCartaoPercent: 5,
  taxaMarketplacePercent: 10,
};
