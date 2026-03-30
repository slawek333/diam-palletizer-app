import { useState, useEffect } from 'react';
import { Part, Container, Pallet, Simulation, PackingResult } from './types';
import { optimizePacking } from './utils/packing';
import { exportToExcel } from './utils/export';
import { SimulationItem } from './components/SimulationItem';
import { GeneralSummary } from './components/GeneralSummary';
import { PalletVisualization } from './components/PalletVisualization';
import { Package, Download, Play, Truck, Box } from 'lucide-react';

const DEFAULT_PARTS: Part[] = [
  { id: '1', name: 'Engine Component A', length: 45, width: 30, height: 25, weight: 12.5 },
  { id: '2', name: 'Transmission Part B', length: 60, width: 40, height: 35, weight: 18.0 },
  { id: '3', name: 'Brake Assembly C', length: 35, width: 25, height: 20, weight: 8.5 },
];

const DEFAULT_CONTAINERS: Container[] = [
  { id: '1', name: 'Master Box K3', length: 120, width: 80, height: 60, maxWeight: 500 },
  { id: '2', name: 'Standard Box K5', length: 100, width: 60, height: 50, maxWeight: 300 },
  { id: '3', name: 'Small Box K7', length: 80, width: 50, height: 40, maxWeight: 200 },
];

const DEFAULT_PALLETS: Pallet[] = [
  { id: '1', name: 'Euro Pallet', length: 120, width: 80, height: 144, maxWeight: 1500 },
  { id: '2', name: 'Standard Pallet', length: 120, width: 100, height: 144, maxWeight: 2000 },
  { id: '3', name: 'Block Pallet', length: 100, width: 120, height: 144, maxWeight: 1800 },
];

function App() {
  const [shippingMode, setShippingMode] = useState<'pallet' | 'courier'>('pallet');
  const [selectedPart, setSelectedPart] = useState<Part>(DEFAULT_PARTS[0]);
  const [selectedContainer, setSelectedContainer] = useState<Container>(DEFAULT_CONTAINERS[0]);
  const [selectedPallet, setSelectedPallet] = useState<Pallet>(DEFAULT_PALLETS[0]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  const [currentResult, setCurrentResult] = useState<PackingResult | null>(null);

  useEffect(() => {
    const result = optimizePacking(selectedPart, selectedContainer, selectedPallet, shippingMode);
    setCurrentResult(result);
  }, [selectedPart, selectedContainer, selectedPallet, shippingMode]);

  const handleRunSimulation = () => {
    if (!currentResult) return;

    const newSimulation: Simulation = {
      id: Date.now().toString(),
      timestamp: new Date(),
      partName: selectedPart.name,
      containerName: selectedContainer.name,
      palletName: selectedPallet.name,
      shippingMode,
      result: currentResult,
    };

    setSimulations(prev => [newSimulation, ...prev]);
    setSelectedSimulation(newSimulation);
  };

  const handleExport = async () => {
    if (simulations.length === 0) return;
    await exportToExcel(simulations);
  };

  const displayResult = selectedSimulation?.result || currentResult;
  const displayPallet = selectedSimulation
    ? DEFAULT_PALLETS.find(p => p.name === selectedSimulation.palletName) || selectedPallet
    : selectedPallet;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">DIAM Palletizer</h1>
            </div>

            <button
              onClick={handleExport}
              disabled={simulations.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-6 w-full">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Shipping Mode</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShippingMode('pallet')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                    shippingMode === 'pallet'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span className="text-sm font-medium">Pallet</span>
                </button>
                <button
                  onClick={() => setShippingMode('courier')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                    shippingMode === 'courier'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  <span className="text-sm font-medium">Courier</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Select Part</h2>
              <div className="space-y-2">
                {DEFAULT_PARTS.map(part => (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPart(part)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                      selectedPart.id === part.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{part.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {part.length}×{part.width}×{part.height} cm • {part.weight} kg
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Select Container</h2>
              <div className="space-y-2">
                {DEFAULT_CONTAINERS.map(container => (
                  <button
                    key={container.id}
                    onClick={() => setSelectedContainer(container)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                      selectedContainer.id === container.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{container.name}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {container.length}×{container.width}×{container.height} cm
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {shippingMode === 'pallet' && (
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">Select Pallet</h2>
                <div className="space-y-2">
                  {DEFAULT_PALLETS.map(pallet => (
                    <button
                      key={pallet.id}
                      onClick={() => setSelectedPallet(pallet)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                        selectedPallet.id === pallet.id
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{pallet.name}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {pallet.length}×{pallet.width}×{pallet.height} cm
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleRunSimulation}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Play className="w-4 h-4" />
              Run Simulation
            </button>
          </div>

          <div className="col-span-6 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">3D Visualization</h2>
              <div className="aspect-[4/3] w-full">
                {displayResult && displayPallet && (
                  <PalletVisualization
                    pallet={displayPallet}
                    placedBoxes={displayResult.placedBoxes}
                  />
                )}
              </div>
            </div>

            <GeneralSummary result={displayResult} shippingMode={shippingMode} />
          </div>

          <div className="col-span-3">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Simulations ({simulations.length})
              </h2>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {simulations.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">
                    No simulations yet. Run your first simulation to get started.
                  </p>
                ) : (
                  simulations.map(sim => (
                    <SimulationItem
                      key={sim.id}
                      simulation={sim}
                      onSelect={() => setSelectedSimulation(sim)}
                      isSelected={selectedSimulation?.id === sim.id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
