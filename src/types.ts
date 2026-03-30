export interface Part {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface Container {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  maxWeight: number;
}

export interface Pallet {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  maxWeight: number;
}

export interface PlacedBox {
  x: number;
  y: number;
  z: number;
  length: number;
  width: number;
  height: number;
  rotation: number;
}

export interface PackingResult {
  boxesNeeded: number;
  partsPerBox: number;
  totalWeight: number;
  boxUtilization: number;
  placedBoxes: PlacedBox[];
  palletUtilization: number;
  stabilityScore: number;
}

export interface Simulation {
  id: string;
  timestamp: Date;
  partName: string;
  containerName: string;
  palletName: string;
  shippingMode: 'pallet' | 'courier';
  result: PackingResult;
}
