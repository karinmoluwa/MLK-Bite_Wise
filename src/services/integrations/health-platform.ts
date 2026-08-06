export type HealthMetric = {
  type: "steps" | "activeCalories" | "heartRate" | "sleep";
  value: number;
  unit: string;
  recordedAt: string;
};

export interface HealthPlatformAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  readMetrics(from: Date, to: Date): Promise<HealthMetric[]>;
}
