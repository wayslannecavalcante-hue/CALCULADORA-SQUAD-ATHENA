import React, { useMemo, useRef, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { MetricCard } from './MetricCard';
import { ChartCard } from './ChartCard';
import { Edit, Save, Download, Loader2 } from 'lucide-react';
import { ChartDataPoint } from '../types';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const parseCurrency = (value: string | number): number => {
  if (typeof value === 'number') return value;
  // Remove dots (thousands separators) and replace comma with dot (decimal separator)
  const cleanValue = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

export const Dashboard: React.FC = () => {
  const { data, isEditing, toggleEditMode } = useDashboard();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const getMetric = (id: string) => data.metrics.find((m) => m.id === id);
  const getChart = (id: string) => data.charts.find((c) => c.id === id);

  const rates = useMemo(() => {
    if (!data) return { generalChurnRate: 0, csRates: [] };

    const churnMesMetric = data.metrics.find((m) => m.id === 'churn-mes');
    const mrrGeralMetric = data.metrics.find((m) => m.id === 'mrr-geral');

    const churnMes = parseCurrency(churnMesMetric?.value || 0);
    const mrrGeral = parseCurrency(mrrGeralMetric?.value || 0);

    const generalChurnRate = mrrGeral ? (churnMes / mrrGeral) * 100 : 0;

    // Calculate Churn per CS
    const churnPorCsChart = data.charts.find((c) => c.id === 'churn-por-cs');
    const feePorCsMrrChart = data.charts.find((c) => c.id === 'fee-por-cs-mrr');

    const csRates = (churnPorCsChart?.data || []).map((churnItem) => {
      const csName = churnItem.name;
      // Try to find matching fee data. Using simple inclusion check as names might vary slightly
      const feeItem = feePorCsMrrChart?.data.find((f) => 
        csName.includes(f.name) || f.name.includes(csName)
      );

      if (!feeItem) return { name: csName, rate: 0 };

      const churnValue = Number(churnItem.value) || 0;
      
      // Sum all numeric values in feeItem except 'name'
      const feeTotal = Object.entries(feeItem).reduce((acc, [key, val]) => {
        if (key !== 'name' && typeof val === 'number') {
          return acc + val;
        }
        return acc;
      }, 0);

      const rate = feeTotal ? (churnValue / feeTotal) * 100 : 0;
      return { name: csName, rate };
    });

    return { generalChurnRate, csRates };
  }, [data]);

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    
    setIsGeneratingPDF(true);

    try {
      // Small delay to ensure UI is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = dashboardRef.current!;
      const width = element.scrollWidth;
      const height = element.scrollHeight;

      const dataUrl = await toPng(element, {
        cacheBust: true,
        backgroundColor: '#000000',
        width: width,
        height: height,
        filter: (node) => {
          if (node.classList && node.classList.contains('no-print')) {
            return false;
          }
          return true;
        },
        style: {
          fontFeatureSettings: '"liga" 0',
          height: `${height}px`,
          overflow: 'visible',
        }
      });

      // Use A4 Portrait
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // 10mm margin
      
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      const widthRatio = contentWidth / width;
      const scaledHeight = height * widthRatio;
      
      let heightLeft = scaledHeight;
      let position = 0; // Relative to the top of the content area (starts at 0)

      // Add first page
      pdf.addImage(dataUrl, 'PNG', margin, margin, contentWidth, scaledHeight);
      heightLeft -= contentHeight;

      // Add subsequent pages if needed
      while (heightLeft > 0) {
        position -= contentHeight; // Move the image up by one content page height
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', margin, margin + position, contentWidth, scaledHeight);
        heightLeft -= contentHeight;
      }

      pdf.save('nova-era-dashboard.pdf');

    } catch (error) {
      console.error('Error generating PDF:', error);
      
      if (confirm('Ocorreu um erro ao gerar o PDF automático. Deseja tentar imprimir/salvar como PDF pelo navegador?')) {
        window.print();
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-black p-6 text-white font-sans">
      <div className="max-w-7xl mx-auto space-y-12" ref={dashboardRef}>
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
          <div className="flex items-center space-x-2">
             {/* Simple lightning bolt icon to mimic the logo */}
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-cyan-400">
               <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
             </svg>
             <h1 className="text-3xl font-extrabold tracking-tighter text-white">
               NOVA<span className="text-cyan-400">ERA</span> <span className="text-zinc-500 text-lg font-normal ml-2">DASHBOARD</span>
             </h1>
          </div>
          <div className="flex space-x-4 no-print">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center px-4 py-2 rounded-lg text-white font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  GERANDO...
                </>
              ) : (
                <>
                  <Download size={20} className="mr-2" />
                  BAIXAR PDF
                </>
              )}
            </button>
            <button
              onClick={toggleEditMode}
              className={`flex items-center px-4 py-2 rounded-lg text-white font-bold transition-all ${
                isEditing 
                  ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' 
                  : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700'
              }`}
            >
              {isEditing ? <Save size={20} className="mr-2" /> : <Edit size={20} className="mr-2" />}
              {isEditing ? 'SALVAR ALTERAÇÕES' : 'EDITAR'}
            </button>
          </div>
        </div>

        {/* SECTION 1: DADOS EMPRESA */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-px bg-zinc-800 flex-1"></div>
            <h2 className="text-xl font-bold text-cyan-400 tracking-widest uppercase">Dados Empresa</h2>
            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>

          {/* Row 1: Clients */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['total-clientes', 'clientes-mrr', 'clientes-arr', 'lt'].map((id) => {
              const metric = getMetric(id);
              return metric ? <MetricCard key={id} metric={metric} /> : null;
            })}
          </div>

          {/* Row 2: Financials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getMetric('valor-total') && <MetricCard metric={getMetric('valor-total')!} />}
            {getMetric('arr-geral') && <MetricCard metric={getMetric('arr-geral')!} />}
            {getMetric('mrr-geral') && <MetricCard metric={getMetric('mrr-geral')!} />}
            
            {/* General Churn Rate Card */}
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between h-full hover:border-red-500/50 transition-colors">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">TAXA DE CHURN GERAL</h3>
              <div>
                <span className="text-3xl font-bold text-red-500">{rates.generalChurnRate.toFixed(2)}%</span>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase">Churn Mês / MRR Geral</p>
              </div>
            </div>

            {getMetric('churn-mes') && <MetricCard metric={getMetric('churn-mes')!} />}
            {getMetric('ticket-medio') && <MetricCard metric={getMetric('ticket-medio')!} />}
          </div>

          {/* Row 3: Status & Prioritization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {getChart('status-da-base') && <ChartCard config={getChart('status-da-base')!} />}
            {getChart('priorizacao') && <ChartCard config={getChart('priorizacao')!} />}
            {getChart('situacao') && <ChartCard config={getChart('situacao')!} />}
          </div>
        </section>

        {/* SECTION 2: DADOS TIME */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4 mb-6 mt-12">
            <div className="h-px bg-zinc-800 flex-1"></div>
            <h2 className="text-xl font-bold text-cyan-400 tracking-widest uppercase">Dados Time</h2>
            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>

          {/* Row 1: CS Churn Rates */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-zinc-800 pb-2 tracking-widest uppercase flex items-center">
              TAXAS POR CS <span className="text-zinc-500 text-xs ml-2 font-normal normal-case">(CÁLCULO AUTOMÁTICO)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rates.csRates.map((cs) => (
                <div key={cs.name} className="bg-black/50 p-4 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors">
                  <p className="text-xs text-zinc-400 font-bold uppercase mb-1 truncate tracking-wider" title={cs.name}>
                    Churn {cs.name.split(' ')[0]}
                  </p>
                  <p className={`text-2xl font-bold ${cs.rate > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {cs.rate.toFixed(2)}%
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase">Churn / Fee MRR</p>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: CS Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {getChart('status-por-cs') && <ChartCard config={getChart('status-por-cs')!} />}
            {getChart('churn-por-cs') && <ChartCard config={getChart('churn-por-cs')!} />}
          </div>

          {/* Row 3: Fee Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {getChart('fee-por-cs-total') && <ChartCard config={getChart('fee-por-cs-total')!} />}
            {getChart('fee-por-cs-mrr') && <ChartCard config={getChart('fee-por-cs-mrr')!} />}
            {getChart('fee-por-cs-arr') && <ChartCard config={getChart('fee-por-cs-arr')!} />}
          </div>

          {/* Row 4: ARR Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {getChart('arr-por-cs') && <ChartCard config={getChart('arr-por-cs')!} />}
            </div>
            <div>
              {getChart('arr-por-squad') && <ChartCard config={getChart('arr-por-squad')!} />}
            </div>
          </div>
        </section>

        <div className="text-center text-zinc-600 text-xs mt-12 pb-8">
          Fornecido por <span className="font-bold text-zinc-400">ClickUp</span> &bull; NOVA ERA
        </div>
      </div>
    </div>
  );
};

