import * as THREE from "three";

export interface Model3D {
  id: string;
  name: string;
  geometry: THREE.BufferGeometry;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  visible: boolean;
  locked: boolean;
  color: string;
}

export interface PrintSettings {
  layerHeight: number;
  lineWidth: number;
  infill: number;
  infillType: "grid" | "lines" | "gyroid";
  walls: number;
  topLayers: number;
  bottomLayers: number;
  support: boolean;
  supportType: "buildplate" | "everywhere";
  brim: boolean;
  raft: boolean;
  density: number; // g/cm³
}

export interface BedSettings {
  width: number;
  depth: number;
  height: number;
}

export interface Filament {
  id: string;
  name: string;
  pricePerKg: number;
  density: number; // g/cm³
}

export interface Printer {
  id: string;
  name: string;
  powerW: number;
  valuePrice: number;
  lifetimeHours: number;
  energyTariffKwh: number;
}

export interface CostSettings {
  // Material e Impressora (selecionados por ID)
  selectedFilamentId: string;
  selectedPrinterId: string;
  
  // Mão de obra
  valorHoraMaoDeObra: number;
  horasMaoDeObra: number;
  
  // Custos extras
  custoEmbalagem: number;
  custoManutencao: number;
  outrosCustos: number;
  
  // Taxa de falha
  taxaFalhaPercent: number;
  
  // Markup
  markupPercent: number;
  
  // Taxas (opcional)
  impostosPercent: number;
  taxaCartaoPercent: number;
  taxaMarketplacePercent: number;
}

export interface CostCalculation {
  custoMaterial: number;
  custoEnergia: number;
  custoAmortizacao: number;
  custoMaoDeObra: number;
  custosExtras: number;
  custoBase: number;
  custoComFalha: number;
  custoTotal: number;
  precoSugerido: number;
  lucroBruto: number;
  totalTaxas: number;
  lucroLiquido: number;
}
