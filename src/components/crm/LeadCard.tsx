import { Lead, STATUS_COLORS } from "@/types/lead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Edit, Calendar, Clock } from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
}

export function LeadCard({ lead, onEdit }: LeadCardProps) {
  const statusColor = STATUS_COLORS[lead.status];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">{lead.nome}</h3>
            </div>
            <Badge className={`${statusColor.bg} ${statusColor.text} shrink-0`}>
              {lead.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{lead.telefone}</span>
            </div>
            {lead.ultimo_contato && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>Último contato: {lead.ultimo_contato}</span>
              </div>
            )}
            {lead.data_agendamento && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Agendado: {lead.data_agendamento}</span>
              </div>
            )}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onEdit(lead)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Lead
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
