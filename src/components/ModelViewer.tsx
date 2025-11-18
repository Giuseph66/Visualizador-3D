import { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface ModelViewerProps {
  geometry: THREE.BufferGeometry | null;
  scale: { x: number; y: number; z: number };
}

function Model({ geometry, scale }: ModelViewerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (geometry && meshRef.current) {
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox;
      if (boundingBox) {
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        meshRef.current.position.set(-center.x, -center.y, -center.z);

        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 2;
        camera.position.set(distance, distance, distance);
        camera.lookAt(0, 0, 0);
      }
    }
  }, [geometry, camera]);

  if (!geometry) return null;

  return (
    <group scale={[scale.x, scale.y, scale.z]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#00a8e8"
          metalness={0.3}
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export const ModelViewer = ({ geometry, scale }: ModelViewerProps) => {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden bg-secondary/30 border border-border">
      <Canvas>
        <PerspectiveCamera makeDefault position={[100, 100, 100]} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <gridHelper args={[200, 20, "#00a8e8", "#1e3a5f"]} />
        <Model geometry={geometry} scale={scale} />
      </Canvas>
    </div>
  );
};
