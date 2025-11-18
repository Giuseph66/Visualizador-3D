import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface CalculationControlsProps {
  density: number;
  infill: number;
  scale: { x: number; y: number; z: number };
  onDensityChange: (value: number) => void;
  onInfillChange: (value: number) => void;
  onScaleChange: (axis: "x" | "y" | "z" | "uniform", value: number) => void;
}

export const CalculationControls = ({
  density,
  infill,
  scale,
  onDensityChange,
  onInfillChange,
  onScaleChange,
}: CalculationControlsProps) => {
  return (
    <Card className="p-6 bg-card border-border space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          Configurações de Cálculo
        </h3>

        {/* Densidade */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="density" className="text-sm font-medium">
              Densidade do Filamento (g/cm³)
            </Label>
            <Input
              id="density"
              type="number"
              step="0.01"
              min="0.5"
              max="3"
              value={density}
              onChange={(e) => onDensityChange(parseFloat(e.target.value) || 1.24)}
              className="w-24 h-8 text-right"
            />
          </div>
          <Slider
            value={[density]}
            onValueChange={([value]) => onDensityChange(value)}
            min={0.5}
            max={3}
            step={0.01}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            PLA: ~1.24, ABS: ~1.04, PETG: ~1.27
          </p>
        </div>

        {/* Infill */}
        <div className="space-y-3 mt-6">
          <div className="flex justify-between items-center">
            <Label htmlFor="infill" className="text-sm font-medium">
              Preenchimento (%)
            </Label>
            <Input
              id="infill"
              type="number"
              min="0"
              max="100"
              value={infill}
              onChange={(e) => onInfillChange(parseFloat(e.target.value) || 20)}
              className="w-24 h-8 text-right"
            />
          </div>
          <Slider
            value={[infill]}
            onValueChange={([value]) => onInfillChange(value)}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Escala */}
      <div className="border-t border-border pt-6">
        <h4 className="text-sm font-semibold mb-4 text-foreground">
          Dimensionamento da Peça
        </h4>

        <div className="space-y-4">
          {/* Escala Uniforme */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="scale-uniform" className="text-sm">
                Escala Uniforme
              </Label>
              <Input
                id="scale-uniform"
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={scale.x}
                onChange={(e) =>
                  onScaleChange("uniform", parseFloat(e.target.value) || 1)
                }
                className="w-24 h-8 text-right"
              />
            </div>
            <Slider
              value={[scale.x]}
              onValueChange={([value]) => onScaleChange("uniform", value)}
              min={0.1}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Eixos individuais */}
          <div className="grid grid-cols-3 gap-3">
            {(["x", "y", "z"] as const).map((axis) => (
              <div key={axis} className="space-y-2">
                <Label htmlFor={`scale-${axis}`} className="text-xs uppercase">
                  {axis}
                </Label>
                <Input
                  id={`scale-${axis}`}
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={scale[axis]}
                  onChange={(e) =>
                    onScaleChange(axis, parseFloat(e.target.value) || 1)
                  }
                  className="w-full h-8 text-center text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
