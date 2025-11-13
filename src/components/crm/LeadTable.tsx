import { Lead, STATUS_COLORS } from "@/types/lead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
}

export function LeadTable({ leads, onEdit }: LeadTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Atualizado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhum lead encontrado
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => {
              const statusColor = STATUS_COLORS[lead.status];
              return (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.nome}</TableCell>
                  <TableCell>{lead.empresa}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.telefone}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColor.bg} ${statusColor.text}`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(lead.atualizadoEm, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(lead)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
