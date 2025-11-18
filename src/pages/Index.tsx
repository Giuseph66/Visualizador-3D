import { useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Model3D, PrintSettings, CostSettings } from "@/types/model";
import { FileUpload } from "@/components/FileUpload";
import { Editor3DView } from "@/components/Editor3DView";
import { ModelList } from "@/components/ModelList";
import { TransformPanel } from "@/components/TransformPanel";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { CostCalculator } from "@/components/CostCalculator";
import { ProjectSummary } from "@/components/ProjectSummary";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Printer, Upload, Settings, Menu, Sliders } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { loadFilaments, loadPrinters } from "@/utils/localStorage";
import { DEFAULT_FILAMENTS, DEFAULT_PRINTERS } from "@/utils/pricing";
import {
  calculateVolume,
  calculateWeight,
  calculateDimensions,
  centerModelOnBed,
  placeModelOnBed,
  findLargestFace,
} from "@/utils/modelCalculations";
import {
  savePrintSettings,
  loadPrintSettings,
  loadCostSettings,
} from "@/utils/localStorage";
import { DEFAULT_COST_SETTINGS } from "@/utils/pricing";

const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  layerHeight: 0.2,
  lineWidth: 0.4,
  infill: 20,
  infillType: "grid",
  walls: 2,
  topLayers: 3,
  bottomLayers: 3,
  support: false,
  supportType: "buildplate",
  brim: false,
  raft: false,
  density: 1.24,
};

const Index = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState<Model3D[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">(
    "translate"
  );
  const [printSettings, setPrintSettings] = useState<PrintSettings>(
    loadPrintSettings() || DEFAULT_PRINT_SETTINGS
  );
  const [costSettings] = useState<CostSettings>(
    loadCostSettings() || DEFAULT_COST_SETTINGS
  );
  const [showUpload, setShowUpload] = useState(true);

  // Get filament for density calculation
  const filaments = loadFilaments() || DEFAULT_FILAMENTS;
  const selectedFilament = filaments.find((f) => f.id === costSettings.selectedFilamentId) || filaments[0];

  // Save settings to localStorage whenever they change
  useEffect(() => {
    savePrintSettings(printSettings);
  }, [printSettings]);

  // Calculate total volume and weight
  const selectedModel = models.find((m) => m.id === selectedModelId);
  const volume = selectedModel
    ? calculateVolume(selectedModel.geometry, selectedModel.scale)
    : 0;
  const weight = calculateWeight(volume, selectedFilament.density, printSettings.infill);
  const dimensions = selectedModel
    ? calculateDimensions(selectedModel.geometry, selectedModel.scale)
    : { x: 0, y: 0, z: 0 };

  const handleFileLoad = useCallback((geometry: THREE.BufferGeometry) => {
    const newModel: Model3D = {
      id: `model_${Date.now()}_${Math.random()}`,
      name: `Modelo ${models.length + 1}`,
      geometry: geometry.clone(),
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      locked: false,
      color: "#00a8e8",
    };

    setModels((prev) => [...prev, newModel]);
    setSelectedModelId(newModel.id);
    setShowUpload(false);
    toast.success("Modelo carregado!");
  }, [models.length]);

  const handleModelTransform = useCallback(
    (id: string, type: "position" | "rotation" | "scale", value: any) => {
      setModels((prev) =>
        prev.map((model) =>
          model.id === id ? { ...model, [type]: value } : model
        )
      );
    },
    []
  );

  const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
    if (!selectedModelId) return;
    setModels((prev) =>
      prev.map((model) =>
        model.id === selectedModelId
          ? { ...model, position: { ...model.position, [axis]: value } }
          : model
      )
    );
  };

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    if (!selectedModelId) return;
    setModels((prev) =>
      prev.map((model) =>
        model.id === selectedModelId
          ? { ...model, rotation: { ...model.rotation, [axis]: value } }
          : model
      )
    );
  };

  const handleScaleChange = (
    axis: "x" | "y" | "z" | "uniform",
    value: number
  ) => {
    if (!selectedModelId) return;
    setModels((prev) =>
      prev.map((model) =>
        model.id === selectedModelId
          ? {
              ...model,
              scale:
                axis === "uniform"
                  ? { x: value, y: value, z: value }
                  : { ...model.scale, [axis]: value },
            }
          : model
      )
    );
  };

  const handleCenterOnBed = () => {
    if (!selectedModel) return;
    // Center at origin since bed is infinite
    handleModelTransform(selectedModel.id, "position", { x: 0, y: selectedModel.position.y, z: 0 });
    toast.success("Modelo centralizado!");
  };

  const handlePlaceOnBed = () => {
    if (!selectedModel) return;
    const dimensions = calculateDimensions(selectedModel.geometry, selectedModel.scale);
    const newY = dimensions.y / 2; // Place at half height to sit on bed
    handleModelTransform(selectedModel.id, "position", {
      ...selectedModel.position,
      y: newY,
    });
    toast.success("Modelo posicionado na mesa!");
  };

  const handleResetTransform = () => {
    if (!selectedModelId) return;
    setModels((prev) =>
      prev.map((model) =>
        model.id === selectedModelId
          ? {
              ...model,
              position: { x: 0, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 },
            }
          : model
      )
    );
    toast.success("Transformações resetadas!");
  };

  const handleRotate90 = (axis: "x" | "y" | "z") => {
    if (!selectedModel) return;
    const newRotation = { ...selectedModel.rotation };
    newRotation[axis] += 90;
    handleModelTransform(selectedModel.id, "rotation", newRotation);
  };

  const handleLayFlat = () => {
    if (!selectedModel) return;
    const largestFace = findLargestFace(selectedModel.geometry);
    
    const rotations: Record<string, { x: number; y: number; z: number }> = {
      x: { x: 90, y: 0, z: 0 },
      y: { x: 0, y: 0, z: 0 },
      z: { x: 0, y: 0, z: 0 },
    };
    
    handleModelTransform(selectedModel.id, "rotation", rotations[largestFace]);
    toast.success("Peça deitada!");
  };

  const handleToggleVisibility = (id: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === id ? { ...model, visible: !model.visible } : model
      )
    );
  };

  const handleToggleLock = (id: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === id ? { ...model, locked: !model.locked } : model
      )
    );
  };

  const handleDuplicate = (id: string) => {
    const modelToDuplicate = models.find((m) => m.id === id);
    if (!modelToDuplicate) return;

    const newModel: Model3D = {
      ...modelToDuplicate,
      id: `model_${Date.now()}_${Math.random()}`,
      name: `${modelToDuplicate.name} (cópia)`,
      geometry: modelToDuplicate.geometry.clone(),
      position: {
        x: modelToDuplicate.position.x + 20,
        y: modelToDuplicate.position.y,
        z: modelToDuplicate.position.z + 20,
      },
    };

    setModels((prev) => [...prev, newModel]);
    toast.success("Modelo duplicado!");
  };

  const handleDelete = (id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
    if (selectedModelId === id) {
      setSelectedModelId(null);
    }
    toast.success("Modelo removido!");
  };

  const handleRename = (id: string, name: string) => {
    setModels((prev) =>
      prev.map((model) => (model.id === id ? { ...model, name } : model))
    );
  };

  const handleSettingsChange = (key: keyof PrintSettings, value: any) => {
    setPrintSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === "Delete" && selectedModelId) {
        handleDelete(selectedModelId);
      } else if (e.key === "g" || e.key === "G") {
        setTransformMode("translate");
      } else if (e.key === "r" || e.key === "R") {
        setTransformMode("rotate");
      } else if (e.key === "s" || e.key === "S") {
        setTransformMode("scale");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedModelId]);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card px-3 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
              <Printer className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-base md:text-xl font-bold text-foreground">Editor 3D Print</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Editor de modelos para impressão 3D
              </p>
            </div>
          </div>
          <div className="flex gap-1 md:gap-2">
            <ThemeToggle />
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Configurações</span>
            </Button>
            <Button
              onClick={() => setShowUpload(true)}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Carregar STL</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Model List Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden absolute top-4 left-4 z-10"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-4">
            <ModelList
              models={models}
              selectedModelId={selectedModelId}
              onSelectModel={setSelectedModelId}
              onToggleVisibility={handleToggleVisibility}
              onToggleLock={handleToggleLock}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Left Sidebar - Model List */}
        <div className="hidden md:block w-64 border-r border-border bg-card/50 p-4 overflow-auto">
          <ModelList
            models={models}
            selectedModelId={selectedModelId}
            onSelectModel={setSelectedModelId}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        </div>

        {/* Center - 3D View */}
        <div className="flex-1 bg-secondary/20">
          {showUpload && models.length === 0 ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-md w-full">
                <FileUpload onFileLoad={handleFileLoad} />
              </div>
            </div>
          ) : (
          <Editor3DView
            models={models}
            selectedModelId={selectedModelId}
            transformMode={transformMode}
            onModelTransform={handleModelTransform}
            onModelSelect={setSelectedModelId}
          />
          )}
        </div>

        {/* Mobile Controls Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden absolute top-4 right-4 z-10"
            >
              <Sliders className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96 p-4 overflow-auto">
            <div className="space-y-4">
              {models.length > 0 && (
                <ProjectSummary
                  models={models}
                  costSettings={costSettings}
                  density={selectedFilament.density}
                  infill={printSettings.infill}
                />
              )}

              <TransformPanel
                model={selectedModel || null}
                transformMode={transformMode}
                onTransformModeChange={setTransformMode}
                onPositionChange={handlePositionChange}
                onRotationChange={handleRotationChange}
                onScaleChange={handleScaleChange}
                onCenterOnBed={handleCenterOnBed}
                onPlaceOnBed={handlePlaceOnBed}
                onResetTransform={handleResetTransform}
                onRotate90={handleRotate90}
                onLayFlat={handleLayFlat}
              />

              {selectedModel && (
                <>
                  <PropertiesPanel
                    settings={printSettings}
                    volume={volume}
                    weight={weight}
                    dimensions={dimensions}
                    onSettingsChange={handleSettingsChange}
                  />
                  <CostCalculator weight={weight} />
                </>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 font-semibold">
                  Atalhos:
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>G - Mover | R - Rotacionar | S - Escala</p>
                  <p>Delete - Remover modelo</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Right Sidebar - Controls & Properties */}
        <div className="hidden md:flex w-96 border-l border-border bg-card/50 flex-col overflow-hidden">
          <div className="p-4 space-y-4 overflow-auto flex-1">
            {/* Resumo do Projeto */}
            {models.length > 0 && (
              <ProjectSummary
                models={models}
                costSettings={costSettings}
                density={selectedFilament.density}
                infill={printSettings.infill}
              />
            )}

            <TransformPanel
              model={selectedModel || null}
              transformMode={transformMode}
              onTransformModeChange={setTransformMode}
              onPositionChange={handlePositionChange}
              onRotationChange={handleRotationChange}
              onScaleChange={handleScaleChange}
              onCenterOnBed={handleCenterOnBed}
              onPlaceOnBed={handlePlaceOnBed}
              onResetTransform={handleResetTransform}
              onRotate90={handleRotate90}
              onLayFlat={handleLayFlat}
            />

            {selectedModel && (
              <>
                <PropertiesPanel
                  settings={printSettings}
                  volume={volume}
                  weight={weight}
                  dimensions={dimensions}
                  onSettingsChange={handleSettingsChange}
                />

                {/* Calculadora de Custo do Modelo Selecionado */}
                <CostCalculator weight={weight} />
              </>
            )}
          </div>

          {/* Keyboard shortcuts info */}
          <div className="p-4 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">
              Atalhos:
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>G - Mover | R - Rotacionar | S - Escala</p>
              <p>Delete - Remover modelo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && models.length > 0 && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <FileUpload onFileLoad={handleFileLoad} />
            <Button
              onClick={() => setShowUpload(false)}
              variant="outline"
              className="w-full mt-4"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
