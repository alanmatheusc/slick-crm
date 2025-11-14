import { useState, useMemo, useEffect } from "react";
import { Lead, LeadStatus } from "@/types/lead";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { LeadsChart } from "@/components/dashboard/LeadsChart";
import { LeadCard } from "@/components/crm/LeadCard";
import { LeadTable } from "@/components/crm/LeadTable";
import { LeadForm } from "@/components/crm/LeadForm";
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  Search, 
  UserPlus,
  MessageSquare,
  UserCheck,
  UserX,
  Calendar 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Buscar leads da API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://smart-seahorse-57.hooks.n8n.cloud/webhook/getLeads");
        if (response.ok) {
          const data = await response.json();
          const formattedLeads = data.map((lead: any, index: number) => ({
            id: lead.id || `${Date.now()}-${index}`,
            nome: lead.nome || "",
            telefone: lead.telefone || "",
            status: lead.status || "Novo",
            ultimo_contato: lead.ultimo_contato || "",
            data_agendamento: lead.data_agendamento || "",
          }));
          setLeads(formattedLeads);
        } else {
          setLeads([]);
        }
      } catch (error) {
        console.error("Erro ao buscar leads:", error);
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Filtrar leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.telefone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  // Calcular métricas
  const metrics = useMemo(() => {
    const byStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<LeadStatus, number>);

    return {
      novo: byStatus["Novo"] || 0,
      abordagem: byStatus["Abordagem Enviada"] || 0,
      followup: byStatus["Follow Up"] || 0,
      desqualificado: byStatus["Desqualificado"] || 0,
      agendado: byStatus["Agendado"] || 0,
      total: leads.length,
    };
  }, [leads]);

  // Dados do gráfico
  const chartData = useMemo(() => {
    const statusList: LeadStatus[] = [
      "Novo",
      "Abordagem Enviada",
      "Follow Up",
      "Desqualificado",
      "Agendado",
    ];
    return statusList.map((status) => ({
      status,
      total: leads.filter((lead) => lead.status === status).length,
    }));
  }, [leads]);

  // Handlers
  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (selectedLead) {
      // Editar lead existente
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLead.id
            ? { ...lead, ...leadData }
            : lead
        )
      );
      toast({
        title: "Lead atualizado!",
        description: "As informações do lead foram atualizadas com sucesso.",
      });
    } else {
      // Adicionar novo lead
      const newLead: Lead = {
        id: Date.now().toString(),
        nome: leadData.nome || "",
        telefone: leadData.telefone || "",
        status: leadData.status || "Novo",
        ultimo_contato: leadData.ultimo_contato || "",
        data_agendamento: leadData.data_agendamento || "",
      };
      setLeads((prev) => [newLead, ...prev]);
      toast({
        title: "Lead criado!",
        description: "O novo lead foi adicionado ao CRM com sucesso.",
      });
    }
    setSelectedLead(null);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const handleNewLead = () => {
    setSelectedLead(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">CRM System</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie seus leads de forma eficiente
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {leads.length} leads
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="crm" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">CRM</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <MetricCard
                title="Novos"
                value={metrics.novo}
                icon={UserPlus}
                bgColor="bg-status-novo"
                textColor="text-status-novo-foreground"
              />
              <MetricCard
                title="Abordagem Enviada"
                value={metrics.abordagem}
                icon={MessageSquare}
                bgColor="bg-status-abordagem"
                textColor="text-status-abordagem-foreground"
              />
              <MetricCard
                title="Follow Up"
                value={metrics.followup}
                icon={UserCheck}
                bgColor="bg-status-followup"
                textColor="text-status-followup-foreground"
              />
              <MetricCard
                title="Desqualificado"
                value={metrics.desqualificado}
                icon={UserX}
                bgColor="bg-status-desqualificado"
                textColor="text-status-desqualificado-foreground"
              />
              <MetricCard
                title="Agendado"
                value={metrics.agendado}
                icon={Calendar}
                bgColor="bg-status-agendado"
                textColor="text-status-agendado-foreground"
              />
            </div>

            {/* Chart */}
            <LeadsChart data={chartData} />
          </TabsContent>

          {/* CRM Tab */}
          <TabsContent value="crm" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as LeadStatus | "all")}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="Novo">Novo</SelectItem>
                    <SelectItem value="Abordagem Enviada">Abordagem Enviada</SelectItem>
                    <SelectItem value="Follow Up">Follow Up</SelectItem>
                    <SelectItem value="Desqualificado">Desqualificado</SelectItem>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleNewLead} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Lead
              </Button>
            </div>

            {/* Leads List - Mobile (Cards) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              {filteredLeads.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou adicione um novo lead
                  </p>
                  <Button onClick={handleNewLead}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Lead
                  </Button>
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onEdit={handleEditLead} />
                ))
              )}
            </div>

            {/* Leads List - Desktop (Table) */}
            <div className="hidden lg:block">
              <LeadTable leads={filteredLeads} onEdit={handleEditLead} />
              {filteredLeads.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os filtros ou adicione um novo lead
                  </p>
                  <Button onClick={handleNewLead}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Lead
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Lead Form Dialog */}
      <LeadForm
        lead={selectedLead}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveLead}
      />
    </div>
  );
};

export default Index;
