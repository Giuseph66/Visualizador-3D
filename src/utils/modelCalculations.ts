import * as THREE from "three";
import { Model3D } from "@/types/model";

export const calculateVolume = (
  geometry: THREE.BufferGeometry,
  scale: { x: number; y: number; z: number }
): number => {
  const positions = geometry.attributes.position.array;
  let totalVolume = 0;

  for (let i = 0; i < positions.length; i += 9) {
    const v0 = new THREE.Vector3(
      positions[i] * scale.x,
      positions[i + 1] * scale.y,
      positions[i + 2] * scale.z
    );
    const v1 = new THREE.Vector3(
      positions[i + 3] * scale.x,
      positions[i + 4] * scale.y,
      positions[i + 5] * scale.z
    );
    const v2 = new THREE.Vector3(
      positions[i + 6] * scale.x,
      positions[i + 7] * scale.y,
      positions[i + 8] * scale.z
    );

    totalVolume += v0.dot(v1.cross(v2)) / 6;
  }

  // Convert from mm³ to cm³
  return Math.abs(totalVolume) / 1000;
};

export const calculateWeight = (
  volume: number,
  density: number,
  infill: number
): number => {
  return volume * density * (infill / 100);
};

export const calculateDimensions = (
  geometry: THREE.BufferGeometry,
  scale: { x: number; y: number; z: number }
): { x: number; y: number; z: number } => {
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  
  if (!bbox) return { x: 0, y: 0, z: 0 };

  const size = new THREE.Vector3();
  bbox.getSize(size);

  return {
    x: size.x * scale.x,
    y: size.y * scale.y,
    z: size.z * scale.z,
  };
};

export const centerModelOnBed = (
  model: Model3D,
  bedWidth: number,
  bedDepth: number
): { x: number; y: number; z: number } => {
  return {
    x: 0,
    y: model.position.y,
    z: 0,
  };
};

export const placeModelOnBed = (
  model: Model3D,
  geometry: THREE.BufferGeometry
): { x: number; y: number; z: number } => {
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  
  if (!bbox) return model.position;

  const minY = bbox.min.y * model.scale.y;
  
  return {
    x: model.position.x,
    y: -minY,
    z: model.position.z,
  };
};

export const findLargestFace = (
  geometry: THREE.BufferGeometry
): "x" | "y" | "z" => {
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  
  if (!bbox) return "z";

  const size = new THREE.Vector3();
  bbox.getSize(size);

  const areas = {
    x: size.y * size.z,
    y: size.x * size.z,
    z: size.x * size.y,
  };

  if (areas.z >= areas.x && areas.z >= areas.y) return "z";
  if (areas.x >= areas.y) return "x";
  return "y";
};
