import { useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Model3D } from "@/types/model";
import { PrintBed } from "./PrintBed";
import { Model3DObject } from "./Model3DObject";

interface Editor3DViewProps {
  models: Model3D[];
  selectedModelId: string | null;
  transformMode: "translate" | "rotate" | "scale";
  onModelTransform: (id: string, type: "position" | "rotation" | "scale", value: any) => void;
  onModelSelect: (id: string | null) => void;
}

export const Editor3DView = ({
  models,
  selectedModelId,
  transformMode,
  onModelTransform,
  onModelSelect,
}: Editor3DViewProps) => {
  const orbitRef = useRef<any>(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([
    250, 250, 250,
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDraggingChange = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
    if (orbitRef.current) {
      orbitRef.current.enabled = !dragging;
    }
  }, []);

  const handleViewChange = (view: string) => {
    switch (view) {
      case "top":
        setCameraPosition([0, 500, 0]);
        break;
      case "front":
        setCameraPosition([0, 100, 500]);
        break;
      case "right":
        setCameraPosition([500, 100, 0]);
        break;
      case "perspective":
        setCameraPosition([300, 300, 300]);
        break;
    }
  };

  return (
    <div className="relative w-full h-full">
      <Canvas shadows camera={{ position: cameraPosition }}>
        <PerspectiveCamera makeDefault position={cameraPosition} />
        <OrbitControls
          ref={orbitRef}
          enableDamping
          dampingFactor={0.05}
          target={[0, 50, 0]}
          enabled={!isDragging}
          enableRotate={!isDragging}
          enablePan={!isDragging}
          enableZoom={!isDragging}
        />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[200, 200, 100]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-200, -200, -100]} intensity={0.4} />
        <hemisphereLight intensity={0.3} />

        <PrintBed />

        {models.map((model) => (
          <Model3DObject
            key={model.id}
            model={model}
            isSelected={model.id === selectedModelId}
            transformMode={transformMode}
            onTransform={onModelTransform}
            onSelect={onModelSelect}
            onDraggingChange={handleDraggingChange}
          />
        ))}
      </Canvas>

      {/* View controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {[
          { label: "Perspectiva", value: "perspective" },
          { label: "Topo", value: "top" },
          { label: "Frente", value: "front" },
          { label: "Direita", value: "right" },
        ].map((view) => (
          <button
            key={view.value}
            onClick={() => handleViewChange(view.value)}
            className="px-3 py-2 bg-card border border-border hover:border-primary text-foreground text-sm rounded transition-colors"
          >
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
};
