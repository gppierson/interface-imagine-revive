import { useState, useMemo } from "react";
import { ClientHeader } from "@/components/ClientHeader";
import { ClientRow } from "@/components/ClientRow";

export type ClientStatus = "New Lead" | "Looking" | "Viewing" | "Negotiating" | "On Hold" | "Done" | "Lost";

export interface ClientNote {
  id: string;
  note_text: string;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  looking_for: string;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
  notes: ClientNote[];
}

const initialClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    company: "Tech Startup Inc",
    phone: "(555) 123-4567",
    email: "john@techstartup.com",
    looking_for: "Office space downtown, 2000-3000 sq ft",
    status: "Looking",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
    notes: [
      {
        id: "1",
        note_text: "Initial consultation call completed. Looking for modern office space with parking.",
        created_at: "2024-01-15"
      }
    ]
  },
  {
    id: "2",
    name: "Sarah Johnson",
    company: "Johnson Retail",
    phone: "(555) 987-6543",
    email: "sarah@johnsonretail.com",
    looking_for: "Retail storefront, high foot traffic area",
    status: "Viewing",
    created_at: "2024-01-10",
    updated_at: "2024-01-18",
    notes: [
      {
        id: "2",
        note_text: "Viewed 3 properties on Main Street. Prefers corner location.",
        created_at: "2024-01-18"
      },
      {
        id: "3",
        note_text: "Budget confirmed at $4000-6000/month. Ready to move quickly.",
        created_at: "2024-01-12"
      }
    ]
  },
  {
    id: "3",
    name: "Mike Chen",
    company: "",
    phone: "(555) 456-7890",
    email: "mike.chen@email.com",
    looking_for: "Industrial warehouse, 5000+ sq ft",
    status: "Negotiating",
    created_at: "2024-01-05",
    updated_at: "2024-01-20",
    notes: [
      {
        id: "4",
        note_text: "Negotiating lease terms for Warehouse District property. Requesting 3-year lease.",
        created_at: "2024-01-20"
      }
    ]
  }
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "All">("All");

  const handleUpdateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id 
        ? { ...client, ...updates, updated_at: new Date().toISOString().split('T')[0] }
        : client
    ));
  };

  const handleAddNote = (clientId: string, noteText: string) => {
    const newNote: ClientNote = {
      id: Date.now().toString(),
      note_text: noteText,
      created_at: new Date().toISOString().split('T')[0]
    };

    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            notes: [newNote, ...client.notes],
            updated_at: new Date().toISOString().split('T')[0]
          }
        : client
    ));
  };

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.company.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.looking_for.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    // Sort by updated date (most recent first)
    return filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [clients, searchQuery, statusFilter]);

  const counts = useMemo(() => {
    return {
      all: clients.length,
      "New Lead": clients.filter(c => c.status === "New Lead").length,
      "Looking": clients.filter(c => c.status === "Looking").length,
      "Viewing": clients.filter(c => c.status === "Viewing").length,
      "Negotiating": clients.filter(c => c.status === "Negotiating").length,
      "On Hold": clients.filter(c => c.status === "On Hold").length,
      "Done": clients.filter(c => c.status === "Done").length,
      "Lost": clients.filter(c => c.status === "Lost").length,
    };
  }, [clients]);

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        counts={counts}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Looking For</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Notes</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedClients.length > 0 ? (
                  filteredAndSortedClients.map((client) => (
                    <ClientRow
                      key={client.id}
                      client={client}
                      onUpdateClient={handleUpdateClient}
                      onAddNote={handleAddNote}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 px-4 text-center text-muted-foreground">
                      No clients found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;