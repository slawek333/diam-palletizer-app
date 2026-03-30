import { PackingResult } from '../types';
import { Package, Layers, Scale, TrendingUp, Shield } from 'lucide-react';

interface GeneralSummaryProps {
  result: PackingResult | null;
  shippingMode: 'pallet' | 'courier';
}

export function GeneralSummary({ result, shippingMode }: GeneralSummaryProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>
        <p className="text-slate-500">Select parts and containers to see packing summary</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Packing Summary</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-slate-500">Boxes Required</div>
            <div className="text-2xl font-bold text-slate-900">{result.boxesNeeded}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Layers className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-slate-500">Parts Per Box</div>
            <div className="text-2xl font-bold text-slate-900">{result.partsPerBox}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Scale className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-sm text-slate-500">Total Weight</div>
            <div className="text-2xl font-bold text-slate-900">{result.totalWeight.toFixed(1)} kg</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-sm text-slate-500">Box Utilization</div>
            <div className="text-2xl font-bold text-slate-900">{result.boxUtilization.toFixed(1)}%</div>
          </div>
        </div>

        {shippingMode === 'pallet' && (
          <>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Layers className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Pallet Utilization</div>
                <div className="text-2xl font-bold text-slate-900">{result.palletUtilization.toFixed(1)}%</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <Shield className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Stability Score</div>
                <div className="text-2xl font-bold text-slate-900">{result.stabilityScore.toFixed(1)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
