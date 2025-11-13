import { useState } from "react";
import { Lead, LeadStatus } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LeadFormProps {
  lead?: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (lead: Partial<Lead>) => void;
}

const statusOptions: LeadStatus[] = [
  "Novo",
  "Abordagem Enviada",
  "Follow Up",
  "Desqualificado",
  "Agendado",
];

export function LeadForm({ lead, open, onOpenChange, onSave }: LeadFormProps) {
  const [formData, setFormData] = useState<Partial<Lead>>(
    lead || {
      nome: "",
      telefone: "",
      status: "Novo",
      ultimo_contato: "",
      data_agendamento: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{lead ? "Editar Lead" : "Novo Lead"}</DialogTitle>
          <DialogDescription>
            {lead
              ? "Atualize as informações do lead"
              : "Adicione um novo lead ao CRM"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                required
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                required
                placeholder="(11) 98765-4321"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ultimo_contato">Último Contato</Label>
              <Input
                id="ultimo_contato"
                value={formData.ultimo_contato}
                onChange={(e) =>
                  setFormData({ ...formData, ultimo_contato: e.target.value })
                }
                placeholder="Ex: 12/01/2025"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_agendamento">Data Agendamento</Label>
              <Input
                id="data_agendamento"
                value={formData.data_agendamento}
                onChange={(e) =>
                  setFormData({ ...formData, data_agendamento: e.target.value })
                }
                placeholder="Ex: 15/01/2025 10:00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: LeadStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
