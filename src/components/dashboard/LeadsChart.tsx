import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { LeadStatus } from "@/types/lead";

interface LeadsChartProps {
  data: Array<{ status: LeadStatus; total: number }>;
}

const STATUS_CHART_COLORS: Record<LeadStatus, string> = {
  "Novo": "hsl(var(--status-novo))",
  "Abordagem Enviada": "hsl(var(--status-abordagem))",
  "Follow Up": "hsl(var(--status-followup))",
  "Desqualificado": "hsl(var(--status-desqualificado))",
  "Agendado": "hsl(var(--status-agendado))",
};

export function LeadsChart({ data }: LeadsChartProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Distribuição de Leads por Status</CardTitle>
        <CardDescription>
          Visualização comparativa dos leads em cada etapa do funil
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="status" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--card-foreground))",
                }}
                labelStyle={{ color: "hsl(var(--card-foreground))" }}
              />
              <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_CHART_COLORS[entry.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
