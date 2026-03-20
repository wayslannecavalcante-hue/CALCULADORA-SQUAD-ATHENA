export interface MetricData {
  id: string;
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'pie' | 'bar' | 'line' | 'area' | 'composed' | 'donut';
  data: ChartDataPoint[];
  dataKeys?: string[]; // For multi-bar charts
  colors?: string[];
  stacked?: boolean;
  layout?: 'horizontal' | 'vertical';
  width?: string; // e.g. "100%"
  height?: number;
}

export interface DashboardData {
  metrics: MetricData[];
  charts: ChartConfig[];
}
