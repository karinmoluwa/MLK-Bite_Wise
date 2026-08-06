import type { CSSProperties } from "react";
export function FuelGauge({ value=73 }: { value?:number }) { return <div className="ds-gauge" style={{"--gauge": `${value}%`} as CSSProperties} role="img" aria-label={`${value}% of calorie goal used`}><span><strong>{value}%</strong><small>Daily goal</small></span></div>; }
export function PieChart() { return <div className="ds-pie" role="img" aria-label="Macronutrients: protein 30%, carbohydrates 45%, fat 25%"><span>Macros</span></div>; }
export function TrendChart() { return <div className="ds-trend" role="img" aria-label="Weekly trend rising across seven days">{[42,55,48,67,72,69,84].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div>; }
