import { DashboardData } from '../types';

export const initialData: DashboardData = {
  metrics: [
    { id: 'total-clientes', label: 'TOTAL CLIENTES', value: 50 },
    { id: 'clientes-mrr', label: 'CLIENTES MRR', value: 38 },
    { id: 'clientes-arr', label: 'CLIENTES ARR', value: 12 },
    { id: 'lt', label: 'LT', value: '8,25' },
    { id: 'valor-total', label: 'VALOR TOTAL', value: '147.433', prefix: 'R$ ' },
    { id: 'mrr-geral', label: 'MRR GERAL', value: '113.700', prefix: 'R$ ' },
    { id: 'arr-geral', label: 'ARR GERAL', value: '33.733', prefix: 'R$ ' },
    { id: 'churn-mes', label: 'CHURN MÊS', value: '29.550', prefix: 'R$ ' },
    { id: 'ticket-medio', label: 'TICKET MÉDIO', value: '2.948,66', prefix: 'R$ ' },
  ],
  charts: [
    {
      id: 'status-da-base',
      title: 'STATUS DA BASE',
      type: 'pie',
      data: [
        { name: 'PLANEJAMENTO', value: 1 },
        { name: 'ATIVO', value: 18 },
        { name: 'EM RISCO', value: 12 },
        { name: 'AVISO', value: 19 },
      ],
      colors: ['#8884d8', '#4F46E5', '#F59E0B', '#EF4444'], // Purple, Indigo, Amber, Red
    },
    {
      id: 'priorizacao',
      title: 'PRIORIZAÇÃO',
      type: 'bar',
      data: [
        { name: 'A', value: 20, fill: '#22C55E' },
        { name: 'B', value: 15, fill: '#EAB308' },
        { name: 'C', value: 5, fill: '#EF4444' },
      ],
    },
    {
      id: 'situacao',
      title: 'SITUAÇÃO',
      type: 'bar',
      layout: 'vertical',
      stacked: true,
      data: [
        { name: 'Total', ongoing: 35, lt2_ate_lt3: 10, onboarding: 5 },
      ],
      dataKeys: ['ongoing', 'lt2_ate_lt3', 'onboarding'],
      colors: ['#22C55E', '#3B82F6', '#A855F7'],
    },
    {
      id: 'area-de-membros',
      title: 'ÁREA DE MEMBROS',
      type: 'donut',
      data: [
        { name: 'Total', value: 50, fill: '#22C55E' },
        { name: 'Remaining', value: 0, fill: '#E5E7EB' }, // Placeholder for donut effect
      ],
      colors: ['#22C55E', '#E5E7EB'],
    },
    {
      id: 'chatbot',
      title: 'CHATBOT',
      type: 'donut',
      data: [
        { name: 'Total', value: 11, fill: '#EF4444' },
        { name: 'Remaining', value: 39, fill: '#3B82F6' },
      ],
      colors: ['#EF4444', '#3B82F6'],
    },
    {
      id: 'crm',
      title: 'CRM',
      type: 'donut',
      data: [
        { name: 'Total', value: 13, fill: '#3B82F6' },
        { name: 'Remaining', value: 37, fill: '#EF4444' },
      ],
      colors: ['#3B82F6', '#EF4444'],
    },
    {
      id: 'status-por-cs',
      title: 'STATUS POR CS',
      type: 'bar',
      stacked: true,
      data: [
        { name: 'Victoria Cavalcante', planejamento: 0, ativo: 0, em_risco: 4, aviso: 0 },
        { name: 'Jonas', planejamento: 0, ativo: 0, em_risco: 6, aviso: 12 }, // Assuming stacked values
        { name: 'Adriel Queiroz', planejamento: 0, ativo: 17, em_risco: 8, aviso: 0 },
        { name: 'Arthur Araújo', planejamento: 0, ativo: 17, em_risco: 6, aviso: 0 },
      ],
      dataKeys: ['planejamento', 'ativo', 'em_risco', 'aviso'],
      colors: ['#9CA3AF', '#3B82F6', '#F59E0B', '#EF4444'],
    },
    {
      id: 'fee-por-cs-total',
      title: 'FEE POR CS (TOTAL)',
      type: 'bar',
      stacked: true,
      data: [
        { name: 'Victoria', planejamento: 0, ativo: 0, em_risco: 13150, aviso: 0 },
        { name: 'Jonas', planejamento: 0, ativo: 0, em_risco: 18450, aviso: 0 },
        { name: 'Adriel', planejamento: 0, ativo: 48750, em_risco: 25400, aviso: 0 },
        { name: 'Arthur', planejamento: 0, ativo: 50092, em_risco: 40000, aviso: 0 },
      ],
      dataKeys: ['planejamento', 'ativo', 'em_risco', 'aviso'],
      colors: ['#9CA3AF', '#3B82F6', '#F59E0B', '#EF4444'],
    },
    {
      id: 'fee-por-cs-mrr',
      title: 'FEE POR CS (MRR)',
      type: 'bar',
      stacked: true,
      data: [
        { name: 'Victoria', planejamento: 0, ativo: 0, em_risco: 13150, aviso: 0 },
        { name: 'Jonas', planejamento: 0, ativo: 0, em_risco: 30450, aviso: 0 },
        { name: 'Adriel', planejamento: 0, ativo: 22400, em_risco: 20000, aviso: 0 },
        { name: 'Arthur', planejamento: 0, ativo: 36700, em_risco: 30000, aviso: 0 },
      ],
      dataKeys: ['planejamento', 'ativo', 'em_risco', 'aviso'],
      colors: ['#9CA3AF', '#3B82F6', '#F59E0B', '#EF4444'],
    },
    {
      id: 'fee-por-cs-arr',
      title: 'FEE POR CS (ARR)',
      type: 'bar',
      stacked: true,
      data: [
        { name: 'Victoria', planejamento: 0, ativo: 0, em_risco: 5000, aviso: 0 },
        { name: 'Jonas', planejamento: 0, ativo: 0, em_risco: 18350, aviso: 0 },
        { name: 'Adriel', planejamento: 0, ativo: 0, em_risco: 0, aviso: 0 },
        { name: 'Arthur', planejamento: 0, ativo: 13383, em_risco: 10000, aviso: 0 },
      ],
      dataKeys: ['planejamento', 'ativo', 'em_risco', 'aviso'],
      colors: ['#9CA3AF', '#3B82F6', '#F59E0B', '#EF4444'],
    },
    {
      id: 'churn-por-cs',
      title: 'CHURN POR CS',
      type: 'bar',
      data: [
        { name: 'Victoria Cavalcante', value: 5650, fill: '#EF4444' },
        { name: 'Jonas', value: 8000, fill: '#EF4444' },
        { name: 'Adriel Queiroz', value: 2500, fill: '#3B82F6' },
        { name: 'Arthur Araújo', value: 13400, fill: '#3B82F6' },
      ],
    },
    {
      id: 'arr-por-cs',
      title: 'ARR POR CS',
      type: 'bar',
      stacked: true,
      data: [
        { name: 'arr', jonas: 13000, adriel: 18000, arthur: 2722 },
      ],
      dataKeys: ['jonas', 'adriel', 'arthur'],
      colors: ['#EF4444', '#F87171', '#3B82F6'],
    },
    {
      id: 'arr-por-squad',
      title: 'ARR POR SQUAD',
      type: 'bar',
      data: [
        { name: 'arr', value: 33733, fill: '#EA580C' },
      ],
    },
    // Reuniões Semanais
    {
      id: 'reuniao-semana-1',
      title: 'REUNIÃO SEMANA 1',
      type: 'bar',
      data: [
        { name: 'Victoria', value: 4, fill: '#EF4444' },
        { name: 'Jonas', value: 12, fill: '#22C55E' },
        { name: 'Adriel', value: 17, fill: '#EF4444' },
        { name: 'Arthur', value: 17, fill: '#22C55E' },
      ],
    },
    {
      id: 'reuniao-semana-2',
      title: 'REUNIÃO SEMANA 2',
      type: 'bar',
      data: [
        { name: 'Victoria', value: 4, fill: '#EF4444' },
        { name: 'Jonas', value: 12, fill: '#22C55E' },
        { name: 'Adriel', value: 17, fill: '#EF4444' },
        { name: 'Arthur', value: 17, fill: '#22C55E' },
      ],
    },
    {
      id: 'reuniao-semana-3',
      title: 'REUNIÃO SEMANA 3',
      type: 'bar',
      data: [
        { name: 'Victoria', value: 4, fill: '#EF4444' },
        { name: 'Jonas', value: 12, fill: '#22C55E' },
        { name: 'Adriel', value: 17, fill: '#EF4444' },
        { name: 'Arthur', value: 17, fill: '#22C55E' },
      ],
    },
    {
      id: 'reuniao-semana-4',
      title: 'REUNIÃO SEMANA 4',
      type: 'bar',
      data: [
        { name: 'Victoria', value: 4, fill: '#EF4444' },
        { name: 'Jonas', value: 12, fill: '#22C55E' },
        { name: 'Adriel', value: 17, fill: '#EF4444' },
        { name: 'Arthur', value: 17, fill: '#22C55E' },
      ],
    },
    // Relatórios Semanais
    {
      id: 'relatorio-semana-1',
      title: 'RELATÓRIO SEMANA 1',
      type: 'bar',
      data: [
        { name: 'Victoria', value: 4, fill: '#EF4444' },
        { name: 'Jonas', value: 12, fill: '#22C55E' },
        { name: 'Adriel', value: 17, fill: '#EF4444' },
        { name: 'Arthur', value: 17, fill: '#22C55E' },
      ],
    },
    {
      id: 'relatorio-semana-2',
      title: 'RELATÓRIO SEMANA 2',
      type: 'bar',
      data: [
        { name: 'Victoria', value: 4, fill: '#EF4444' },
        { name: 'Jonas', value: 12, fill: '#22C55E' },
        { name: 'Adriel', value: 17, fill: '#EF4444' },
        { name: 'Arthur', value: 17, fill: '#22C55E' },
      ],
    },
    {
      id: 'relatorio-semana-3',
      title: 'RELATÓRIO SEMANA 3',
      type: 'bar',
      data: [
        { name: 'Victoria', value: 4, fill: '#EF4444' },
        { name: 'Jonas', value: 12, fill: '#22C55E' },
        { name: 'Adriel', value: 17, fill: '#EF4444' },
        { name: 'Arthur', value: 17, fill: '#22C55E' },
      ],
    },
    {
      id: 'relatorio-semana-4',
      title: 'RELATÓRIO SEMANA 4',
      type: 'bar',
      data: [
        { name: 'Victoria', value: 4, fill: '#EF4444' },
        { name: 'Jonas', value: 12, fill: '#22C55E' },
        { name: 'Adriel', value: 17, fill: '#EF4444' },
        { name: 'Arthur', value: 17, fill: '#22C55E' },
      ],
    },
  ],
};
