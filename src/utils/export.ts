import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Simulation } from '../types';

export async function exportToExcel(simulations: Simulation[]): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Packing Simulations');

  worksheet.columns = [
    { header: 'Timestamp', key: 'timestamp', width: 20 },
    { header: 'Part', key: 'part', width: 25 },
    { header: 'Container', key: 'container', width: 25 },
    { header: 'Pallet', key: 'pallet', width: 25 },
    { header: 'Shipping Mode', key: 'mode', width: 15 },
    { header: 'Boxes Needed', key: 'boxes', width: 15 },
    { header: 'Parts Per Box', key: 'partsPerBox', width: 15 },
    { header: 'Total Weight (kg)', key: 'weight', width: 18 },
    { header: 'Box Utilization (%)', key: 'boxUtil', width: 18 },
    { header: 'Pallet Utilization (%)', key: 'palletUtil', width: 20 },
    { header: 'Stability Score', key: 'stability', width: 15 },
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE2E8F0' },
  };

  simulations.forEach(sim => {
    worksheet.addRow({
      timestamp: sim.timestamp.toLocaleString(),
      part: sim.partName,
      container: sim.containerName,
      pallet: sim.palletName,
      mode: sim.shippingMode === 'pallet' ? 'Pallet' : 'Courier',
      boxes: sim.result.boxesNeeded,
      partsPerBox: sim.result.partsPerBox,
      weight: sim.result.totalWeight.toFixed(2),
      boxUtil: sim.result.boxUtilization.toFixed(1),
      palletUtil: sim.result.palletUtilization.toFixed(1),
      stability: sim.result.stabilityScore.toFixed(1),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `packing-simulations-${Date.now()}.xlsx`);
}
