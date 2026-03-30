import { Simulation } from '../types';
import { Package, Calendar } from 'lucide-react';

interface SimulationItemProps {
  simulation: Simulation;
  onSelect: () => void;
  isSelected: boolean;
}

export function SimulationItem({ simulation, onSelect, isSelected }: SimulationItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-slate-600" />
          <h3 className="font-semibold text-slate-900">{simulation.partName}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          simulation.shippingMode === 'pallet'
            ? 'bg-green-100 text-green-700'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {simulation.shippingMode === 'pallet' ? 'Pallet' : 'Courier'}
        </span>
      </div>

      <div className="text-sm text-slate-600 mb-2">
        <div>{simulation.containerName}</div>
        <div className="text-xs">{simulation.palletName}</div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Calendar className="w-3 h-3" />
        <span>{simulation.timestamp.toLocaleString()}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-slate-500">Parts/Box</div>
          <div className="font-semibold text-slate-900">{simulation.result.partsPerBox}</div>
        </div>
        <div>
          <div className="text-slate-500">Box Util.</div>
          <div className="font-semibold text-slate-900">{simulation.result.boxUtilization.toFixed(1)}%</div>
        </div>
      </div>
    </button>
  );
}
