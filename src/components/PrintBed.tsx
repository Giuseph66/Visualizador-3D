import * as THREE from "three";

export const PrintBed = () => {
  return (
    <group>
      {/* Infinite grid */}
      <gridHelper
        args={[2000, 100, "#00a8e8", "#1e3a5f"]}
        position={[0, 0, 0]}
      />
      
      {/* Central marker - small circle to indicate center */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8, 10, 32]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.6} />
      </mesh>
      
      {/* Axis indicators at center */}
      <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 50, 0xff0000]} />
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 50, 0x00ff00]} />
      <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 50, 0x0000ff]} />
    </group>
  );
};
