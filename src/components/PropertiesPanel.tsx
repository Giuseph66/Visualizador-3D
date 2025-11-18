import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PrintSettings } from "@/types/model";
import { Separator } from "@/components/ui/separator";

interface PropertiesPanelProps {
  settings: PrintSettings;
  volume: number;
  weight: number;
  dimensions: { x: number; y: number; z: number };
  onSettingsChange: (key: keyof PrintSettings, value: any) => void;
}

// Helper function to calculate estimated print time
const calculatePrintTime = (
  volume: number,
  layerHeight: number,
  dimensions: { z: number },
  infill: number
): string => {
  // Simplified estimation based on volume and settings
  const layers = dimensions.z / layerHeight;
  const printSpeed = 50; // mm/s average
  const travelSpeed = 150; // mm/s
  
  // Rough estimation: more infill = more time
  const infillFactor = 0.5 + (infill / 100) * 0.5;
  const estimatedMinutes = (layers * 2 + volume * 0.01 * infillFactor);
  
  const hours = Math.floor(estimatedMinutes / 60);
  const minutes = Math.round(estimatedMinutes % 60);
  
  return `${hours}h ${minutes}min`;
};

const calculateCost = (weight: number, pricePerKg: number): number => {
  return (weight / 1000) * pricePerKg;
};

export const PropertiesPanel = ({
  settings,
  volume,
  weight,
  dimensions,
  onSettingsChange,
}: PropertiesPanelProps) => {
  // Chrome on Android sometimes has issues with complex dropdown portals.
  // Use a native select fallback on such devices to improve compatibility.
  const [isChromeOnAndroid, setIsChromeOnAndroid] = useState(false);
  useEffect(() => {
    if (typeof navigator !== "undefined" && /Android|Chrome/.test(navigator.userAgent)) {
      setIsChromeOnAndroid(true);
    }
  }, []);
  const layers = Math.ceil(dimensions.z / settings.layerHeight);
  const printTime = calculatePrintTime(volume, settings.layerHeight, dimensions, settings.infill);
  const filamentCost = calculateCost(weight, 25); // R$25/kg default

  return (
    <Card className="p-6 bg-card border-border space-y-6 overflow-auto max-h-[calc(100vh-120px)]">
      <h3 className="text-lg font-semibold text-foreground">Propriedades</h3>

      {/* Geometric Info */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          Informações do Modelo
        </h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">X (mm)</Label>
            <p className="font-mono">{dimensions.x.toFixed(2)}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Y (mm)</Label>
            <p className="font-mono">{dimensions.y.toFixed(2)}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Z (mm)</Label>
            <p className="font-mono">{dimensions.z.toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <Label className="text-xs text-muted-foreground">Volume</Label>
            <p className="font-mono text-primary">{volume.toFixed(2)} cm³</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Peso Est.</Label>
            <p className="font-mono text-accent">{weight.toFixed(2)} g</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <Label className="text-xs text-muted-foreground">Camadas</Label>
            <p className="font-mono">{layers}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Tempo Est.</Label>
            <p className="font-mono">{printTime}</p>
          </div>
        </div>
        <div className="pt-2">
          <Label className="text-xs text-muted-foreground">Custo Est. Filamento</Label>
          <p className="font-mono text-lg text-primary">R$ {filamentCost.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Base: R$25/kg PLA</p>
        </div>
      </div>

      <Separator />

      {/* Print Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">
          Parâmetros de Impressão
        </h4>

        {/* Layer Height */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs">Altura de Camada (mm)</Label>
            <Input
              type="number"
              step="0.05"
              value={settings.layerHeight}
              onChange={(e) =>
                onSettingsChange("layerHeight", parseFloat(e.target.value) || 0.2)
              }
              className="w-20 h-7 text-xs"
            />
          </div>
          <Slider
            value={[settings.layerHeight]}
            onValueChange={([value]) => onSettingsChange("layerHeight", value)}
            min={0.05}
            max={0.4}
            step={0.05}
          />
        </div>

        {/* Line Width */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs">Largura de Linha (mm)</Label>
            <Input
              type="number"
              step="0.05"
              value={settings.lineWidth}
              onChange={(e) =>
                onSettingsChange("lineWidth", parseFloat(e.target.value) || 0.4)
              }
              className="w-20 h-7 text-xs"
            />
          </div>
        </div>

        {/* Infill */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs">Preenchimento (%)</Label>
            <Input
              type="number"
              value={settings.infill}
              onChange={(e) =>
                onSettingsChange("infill", parseInt(e.target.value) || 20)
              }
              className="w-20 h-7 text-xs"
            />
          </div>
          <Slider
            value={[settings.infill]}
            onValueChange={([value]) => onSettingsChange("infill", value)}
            min={0}
            max={100}
            step={5}
          />
        </div>

        {/* Infill Type - Chrome Android fallback to native select for compatibility */}
        {isChromeOnAndroid ? (
          <div className="space-y-2">
            <Label className="text-xs">Tipo de Preenchimento</Label>
            <select
              value={settings.infillType}
              onChange={(e) => onSettingsChange("infillType", e.target.value)}
              className="h-8 px-2 border rounded"
            >
              <option value="grid">Grid</option>
              <option value="lines">Lines</option>
              <option value="gyroid">Gyroid</option>
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-xs">Tipo de Preenchimento</Label>
            <Select
              value={settings.infillType}
              onValueChange={(value) => onSettingsChange("infillType", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="lines">Lines</SelectItem>
                <SelectItem value="gyroid">Gyroid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Walls */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs">Número de Paredes</Label>
            <Input
              type="number"
              value={settings.walls}
              onChange={(e) =>
                onSettingsChange("walls", parseInt(e.target.value) || 2)
              }
              className="w-20 h-7 text-xs"
            />
          </div>
        </div>

        {/* Top/Bottom Layers */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="text-xs">Camadas Superior</Label>
            <Input
              type="number"
              value={settings.topLayers}
              onChange={(e) =>
                onSettingsChange("topLayers", parseInt(e.target.value) || 3)
              }
              className="h-7 text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Camadas Inferior</Label>
            <Input
              type="number"
              value={settings.bottomLayers}
              onChange={(e) =>
                onSettingsChange("bottomLayers", parseInt(e.target.value) || 3)
              }
              className="h-7 text-xs"
            />
          </div>
        </div>

        <Separator />

        {/* Support */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="support"
              checked={settings.support}
              onCheckedChange={(checked) =>
                onSettingsChange("support", checked)
              }
            />
            <Label htmlFor="support" className="text-sm">
              Gerar Suportes
            </Label>
          </div>
          {settings.support && (
            <Select
              value={settings.supportType}
              onValueChange={(value) => onSettingsChange("supportType", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buildplate">Toque na Base</SelectItem>
                <SelectItem value="everywhere">Em Todo Lugar</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Brim/Raft */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="brim"
              checked={settings.brim}
              onCheckedChange={(checked) => onSettingsChange("brim", checked)}
            />
            <Label htmlFor="brim" className="text-sm">
              Brim
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="raft"
              checked={settings.raft}
              onCheckedChange={(checked) => onSettingsChange("raft", checked)}
            />
            <Label htmlFor="raft" className="text-sm">
              Raft
            </Label>
          </div>
        </div>

        <Separator />

        {/* Material Density */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs">Densidade (g/cm³)</Label>
            <Input
              type="number"
              step="0.01"
              value={settings.density}
              onChange={(e) =>
                onSettingsChange("density", parseFloat(e.target.value) || 1.24)
              }
              className="w-20 h-7 text-xs"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            PLA: ~1.24, ABS: ~1.04, PETG: ~1.27
          </p>
        </div>
      </div>
    </Card>
  );
};
