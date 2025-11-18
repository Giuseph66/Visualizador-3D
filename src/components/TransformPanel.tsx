import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Model3D } from "@/types/model";
import { Move, RotateCw, Maximize2, RotateCcw } from "lucide-react";

interface TransformPanelProps {
  model: Model3D | null;
  transformMode: "translate" | "rotate" | "scale";
  onTransformModeChange: (mode: "translate" | "rotate" | "scale") => void;
  onPositionChange: (axis: "x" | "y" | "z", value: number) => void;
  onRotationChange: (axis: "x" | "y" | "z", value: number) => void;
  onScaleChange: (axis: "x" | "y" | "z" | "uniform", value: number) => void;
  onCenterOnBed: () => void;
  onPlaceOnBed: () => void;
  onResetTransform: () => void;
  onRotate90: (axis: "x" | "y" | "z") => void;
  onLayFlat: () => void;
}

export const TransformPanel = ({
  model,
  transformMode,
  onTransformModeChange,
  onPositionChange,
  onRotationChange,
  onScaleChange,
  onCenterOnBed,
  onPlaceOnBed,
  onResetTransform,
  onRotate90,
  onLayFlat,
}: TransformPanelProps) => {
  if (!model) {
    return (
      <Card className="p-6 bg-card border-border">
        <p className="text-sm text-muted-foreground text-center">
          Selecione um modelo para editar
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Transformações</h3>

      {/* Transform mode buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant={transformMode === "translate" ? "default" : "outline"}
          size="sm"
          onClick={() => onTransformModeChange("translate")}
          className="flex items-center gap-2"
        >
          <Move className="w-4 h-4" />
          Mover
        </Button>
        <Button
          variant={transformMode === "rotate" ? "default" : "outline"}
          size="sm"
          onClick={() => onTransformModeChange("rotate")}
          className="flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Rotação
        </Button>
        <Button
          variant={transformMode === "scale" ? "default" : "outline"}
          size="sm"
          onClick={() => onTransformModeChange("scale")}
          className="flex items-center gap-2"
        >
          <Maximize2 className="w-4 h-4" />
          Escala
        </Button>
      </div>

      {/* Position */}
      {transformMode === "translate" && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Posição (mm)</h4>
          {(["x", "y", "z"] as const).map((axis) => (
            <div key={axis} className="flex items-center gap-2">
              <Label className="w-8 uppercase text-xs">{axis}</Label>
              <Input
                type="number"
                value={model.position[axis].toFixed(2)}
                onChange={(e) =>
                  onPositionChange(axis, parseFloat(e.target.value) || 0)
                }
                className="h-8"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={onCenterOnBed}>
              Centralizar
            </Button>
            <Button size="sm" variant="outline" onClick={onPlaceOnBed}>
              Base (Z=0)
            </Button>
          </div>
        </div>
      )}

      {/* Rotation */}
      {transformMode === "rotate" && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Rotação (graus)</h4>
          {(["x", "y", "z"] as const).map((axis) => (
            <div key={axis} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="w-8 uppercase text-xs">{axis}</Label>
                <Input
                  type="number"
                  value={model.rotation[axis].toFixed(2)}
                  onChange={(e) =>
                    onRotationChange(axis, parseFloat(e.target.value) || 0)
                  }
                  className="h-8"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRotate90(axis)}
                  className="shrink-0"
                >
                  +90°
                </Button>
              </div>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={onLayFlat} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Deitar Peça
          </Button>
        </div>
      )}

      {/* Scale */}
      {transformMode === "scale" && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Escala</h4>
          <div className="flex items-center gap-2">
            <Label className="w-20 text-xs">Uniforme</Label>
            <Input
              type="number"
              step="0.1"
              value={model.scale.x.toFixed(2)}
              onChange={(e) =>
                onScaleChange("uniform", parseFloat(e.target.value) || 1)
              }
              className="h-8"
            />
          </div>
          {(["x", "y", "z"] as const).map((axis) => (
            <div key={axis} className="flex items-center gap-2">
              <Label className="w-20 uppercase text-xs">{axis}</Label>
              <Input
                type="number"
                step="0.1"
                value={model.scale[axis].toFixed(2)}
                onChange={(e) =>
                  onScaleChange(axis, parseFloat(e.target.value) || 1)
                }
                className="h-8"
              />
            </div>
          ))}
        </div>
      )}

      {/* Reset */}
      <Button
        size="sm"
        variant="destructive"
        onClick={onResetTransform}
        className="w-full"
      >
        Resetar Transformações
      </Button>
    </Card>
  );
};
