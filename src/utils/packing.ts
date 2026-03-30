import { Part, Container, Pallet, PackingResult, PlacedBox } from '../types';

interface Orientation {
  length: number;
  width: number;
  height: number;
  rotation: number;
}

function getAllOrientations(part: Part): Orientation[] {
  return [
    { length: part.length, width: part.width, height: part.height, rotation: 0 },
    { length: part.width, width: part.length, height: part.height, rotation: 90 },
    { length: part.length, width: part.height, height: part.width, rotation: 180 },
    { length: part.height, width: part.width, height: part.length, rotation: 270 },
    { length: part.width, width: part.height, height: part.length, rotation: 45 },
    { length: part.height, width: part.length, height: part.width, rotation: 135 },
  ];
}

function calculatePartsPerBox(part: Part, container: Container): { count: number; orientation: Orientation } {
  const orientations = getAllOrientations(part);
  let maxCount = 0;
  let bestOrientation = orientations[0];

  for (const orientation of orientations) {
    const fitLength = Math.floor(container.length / orientation.length);
    const fitWidth = Math.floor(container.width / orientation.width);
    const fitHeight = Math.floor(container.height / orientation.height);
    const count = fitLength * fitWidth * fitHeight;

    if (count > maxCount) {
      maxCount = count;
      bestOrientation = orientation;
    }
  }

  return { count: maxCount, orientation: bestOrientation };
}

function packBoxesOnPallet(
  boxLength: number,
  boxWidth: number,
  boxHeight: number,
  boxCount: number,
  pallet: Pallet
): PlacedBox[] {
  const placedBoxes: PlacedBox[] = [];
  const palletOrientations = [
    { length: boxLength, width: boxWidth, height: boxHeight, rotation: 0 },
    { length: boxWidth, width: boxLength, height: boxHeight, rotation: 90 },
  ];

  let bestLayout: PlacedBox[] = [];
  let maxBoxesFit = 0;

  for (const orientation of palletOrientations) {
    const layout: PlacedBox[] = [];
    const fitLength = Math.floor(pallet.length / orientation.length);
    const fitWidth = Math.floor(pallet.width / orientation.width);
    const layers = Math.floor(pallet.height / orientation.height);

    let boxesPlaced = 0;
    for (let layer = 0; layer < layers && boxesPlaced < boxCount; layer++) {
      for (let i = 0; i < fitLength && boxesPlaced < boxCount; i++) {
        for (let j = 0; j < fitWidth && boxesPlaced < boxCount; j++) {
          layout.push({
            x: i * orientation.length,
            y: layer * orientation.height,
            z: j * orientation.width,
            length: orientation.length,
            width: orientation.width,
            height: orientation.height,
            rotation: orientation.rotation,
          });
          boxesPlaced++;
        }
      }
    }

    if (boxesPlaced > maxBoxesFit) {
      maxBoxesFit = boxesPlaced;
      bestLayout = layout;
    }
  }

  return bestLayout;
}

function calculateStabilityScore(boxes: PlacedBox[], pallet: Pallet): number {
  if (boxes.length === 0) return 0;

  const centerX = pallet.length / 2;
  const centerZ = pallet.width / 2;

  let totalDistance = 0;
  let layerScore = 0;

  const layers = new Set(boxes.map(b => b.y));
  layerScore = Math.min(layers.size / 3, 1);

  boxes.forEach(box => {
    const boxCenterX = box.x + box.length / 2;
    const boxCenterZ = box.z + box.width / 2;
    const distance = Math.sqrt(
      Math.pow(boxCenterX - centerX, 2) +
      Math.pow(boxCenterZ - centerZ, 2)
    );
    totalDistance += distance;
  });

  const avgDistance = totalDistance / boxes.length;
  const maxDistance = Math.sqrt(Math.pow(pallet.length / 2, 2) + Math.pow(pallet.width / 2, 2));
  const centeringScore = 1 - (avgDistance / maxDistance);

  return (centeringScore * 0.6 + layerScore * 0.4) * 100;
}

export function optimizePacking(
  part: Part,
  container: Container,
  pallet: Pallet,
  shippingMode: 'pallet' | 'courier'
): PackingResult {
  const { count: partsPerBox, orientation } = calculatePartsPerBox(part, container);

  if (partsPerBox === 0) {
    return {
      boxesNeeded: 0,
      partsPerBox: 0,
      totalWeight: 0,
      boxUtilization: 0,
      placedBoxes: [],
      palletUtilization: 0,
      stabilityScore: 0,
    };
  }

  const boxVolume = container.length * container.width * container.height;
  const partVolume = part.length * part.width * part.height;
  const boxUtilization = (partsPerBox * partVolume) / boxVolume * 100;

  let placedBoxes: PlacedBox[] = [];
  let palletUtilization = 0;
  let stabilityScore = 0;

  if (shippingMode === 'pallet') {
    placedBoxes = packBoxesOnPallet(
      container.length,
      container.width,
      container.height,
      1,
      pallet
    );

    const usedVolume = placedBoxes.reduce((sum, box) =>
      sum + (box.length * box.width * box.height), 0
    );
    const palletVolume = pallet.length * pallet.width * pallet.height;
    palletUtilization = (usedVolume / palletVolume) * 100;

    stabilityScore = calculateStabilityScore(placedBoxes, pallet);
  }

  const totalWeight = part.weight * partsPerBox;

  return {
    boxesNeeded: 1,
    partsPerBox,
    totalWeight,
    boxUtilization,
    placedBoxes,
    palletUtilization,
    stabilityScore,
  };
}

export function suggestBestBox(part: Part, containers: Container[]): Container | null {
  let bestContainer: Container | null = null;
  let bestUtilization = 0;

  for (const container of containers) {
    const partsResult = calculatePartsPerBox(part, container);
    if (partsResult.count > 0) {
      const boxVolume = container.length * container.width * container.height;
      const partVolume = part.length * part.width * part.height;
      const utilization = (partsResult.count * partVolume) / boxVolume;

      if (utilization > bestUtilization) {
        bestUtilization = utilization;
        bestContainer = container;
      }
    }
  }

  return bestContainer;
}
