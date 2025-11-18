import { useRef, useEffect } from "react";
import { TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Model3D } from "@/types/model";

interface Model3DObjectProps {
  model: Model3D;
  isSelected: boolean;
  transformMode: "translate" | "rotate" | "scale";
  onTransform: (id: string, type: "position" | "rotation" | "scale", value: any) => void;
  onSelect: (id: string | null) => void;
  onDraggingChange: (dragging: boolean) => void;
}

export const Model3DObject = ({
  model,
  isSelected,
  transformMode,
  onTransform,
  onSelect,
  onDraggingChange,
}: Model3DObjectProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const transformRef = useRef<any>(null);
  const { gl } = useThree();

  useEffect(() => {
    if (transformRef.current && isSelected) {
      const controls = transformRef.current;
      
      const handleChange = () => {
        if (!meshRef.current) return;

        const position = meshRef.current.position;
        const rotation = meshRef.current.rotation;
        const scale = meshRef.current.scale;

        onTransform(model.id, "position", {
          x: position.x,
          y: position.y,
          z: position.z,
        });
        onTransform(model.id, "rotation", {
          x: THREE.MathUtils.radToDeg(rotation.x),
          y: THREE.MathUtils.radToDeg(rotation.y),
          z: THREE.MathUtils.radToDeg(rotation.z),
        });
        onTransform(model.id, "scale", {
          x: scale.x,
          y: scale.y,
          z: scale.z,
        });
      };

      const handleDragging = (event: any) => {
        const isDragging = event.value;
        onDraggingChange(isDragging);
        gl.domElement.style.cursor = isDragging ? "grabbing" : "grab";
      };

      controls.addEventListener("change", handleChange);
      controls.addEventListener("dragging-changed", handleDragging);

      return () => {
        controls.removeEventListener("change", handleChange);
        controls.removeEventListener("dragging-changed", handleDragging);
      };
    }
  }, [isSelected, model.id, onTransform, onDraggingChange, gl]);

  return (
    <group>
      {isSelected && !model.locked && meshRef.current && (
        <TransformControls
          ref={transformRef}
          object={meshRef.current}
          mode={transformMode}
        />
      )}
      <mesh
        ref={meshRef}
        geometry={model.geometry}
        position={[model.position.x, model.position.y, model.position.z]}
        rotation={[
          THREE.MathUtils.degToRad(model.rotation.x),
          THREE.MathUtils.degToRad(model.rotation.y),
          THREE.MathUtils.degToRad(model.rotation.z),
        ]}
        scale={[model.scale.x, model.scale.y, model.scale.z]}
        visible={model.visible}
        onClick={(e) => {
          e.stopPropagation();
          if (!model.locked && model.visible) {
            onSelect(model.id);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!model.locked && model.visible) {
            gl.domElement.style.cursor = "pointer";
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          gl.domElement.style.cursor = "default";
        }}
      >
        <meshStandardMaterial
          color={isSelected ? "#00f5ff" : model.color}
          metalness={0.3}
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
