import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Pallet, PlacedBox } from '../types';
import * as THREE from 'three';

interface PalletVisualizationProps {
  pallet: Pallet;
  placedBoxes: PlacedBox[];
}

function PalletMesh({ pallet }: { pallet: Pallet }) {
  return (
    <mesh position={[pallet.length / 2, -5, pallet.width / 2]}>
      <boxGeometry args={[pallet.length, 10, pallet.width]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
}

function BoxMesh({ box, index }: { box: PlacedBox; index: number }) {
  const hue = (index * 137.5) % 360;
  const color = `hsl(${hue}, 70%, 60%)`;

  return (
    <mesh
      position={[
        box.x + box.length / 2,
        box.y + box.height / 2,
        box.z + box.width / 2,
      ]}
    >
      <boxGeometry args={[box.length, box.height, box.width]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.8}
        wireframe={false}
      />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(box.length, box.height, box.width)]} />
        <lineBasicMaterial color="#333" />
      </lineSegments>
    </mesh>
  );
}

function Scene({ pallet, placedBoxes }: PalletVisualizationProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, 10, -5]} intensity={0.4} />

      <PalletMesh pallet={pallet} />

      {placedBoxes.map((box, index) => (
        <BoxMesh key={index} box={box} index={index} />
      ))}

      <Grid
        args={[pallet.length * 2, pallet.width * 2]}
        cellSize={10}
        cellThickness={0.5}
        cellColor="#cbd5e1"
        sectionSize={50}
        sectionThickness={1}
        sectionColor="#94a3b8"
        fadeDistance={500}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
        position={[pallet.length / 2, -10, pallet.width / 2]}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={50}
        maxDistance={500}
      />
    </>
  );
}

export function PalletVisualization({ pallet, placedBoxes }: PalletVisualizationProps) {
  const maxDimension = Math.max(pallet.length, pallet.width, pallet.height);
  const cameraDistance = maxDimension * 2;

  return (
    <div className="w-full h-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
      <Canvas
        camera={{
          position: [cameraDistance, cameraDistance * 0.8, cameraDistance],
          fov: 50,
        }}
      >
        <Scene pallet={pallet} placedBoxes={placedBoxes} />
      </Canvas>
    </div>
  );
}
