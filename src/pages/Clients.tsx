import { useState, useMemo } from "react";
import { ClientHeader } from "@/components/ClientHeader";
import { ClientRow } from "@/components/ClientRow";

export type ClientStatus = "New Lead" | "Looking" | "Negotiating" | "On Hold" | "Done" | "Lost";

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
    status: "Looking",
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
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    looking_for: "",
    status: "New Lead" as ClientStatus
  });

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

  const handleAddClient = () => {
    if (newClient.name.trim() && newClient.looking_for.trim()) {
      const client: Client = {
        id: Date.now().toString(),
        ...newClient,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
        notes: []
      };
      
      setClients(prev => [client, ...prev]);
      setNewClient({
        name: "",
        company: "",
        phone: "",
        email: "",
        looking_for: "",
        status: "New Lead"
      });
      setShowAddClient(false);
    }
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Add Client Form */}
        {showAddClient && (
          <div className="bg-white rounded-lg shadow-sm border border-border p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-3 sm:py-2 border border-border rounded-md text-sm"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Company</label>
                <input
                  type="text"
                  value={newClient.company}
                  onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-3 sm:py-2 border border-border rounded-md text-sm"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input
                  type="text"
                  value={newClient.phone}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-3 sm:py-2 border border-border rounded-md text-sm"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-3 sm:py-2 border border-border rounded-md text-sm"
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">Looking For *</label>
              <textarea
                value={newClient.looking_for}
                onChange={(e) => setNewClient(prev => ({ ...prev, looking_for: e.target.value }))}
                className="w-full px-3 py-3 sm:py-2 border border-border rounded-md text-sm resize-none"
                rows={3}
                placeholder="What is the client looking for?"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAddClient}
                disabled={!newClient.name.trim() || !newClient.looking_for.trim()}
                className="bg-primary text-primary-foreground px-6 py-3 sm:py-2 rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Client
              </button>
              <button
                onClick={() => {
                  setShowAddClient(false);
                  setNewClient({
                    name: "",
                    company: "",
                    phone: "",
                    email: "",
                    looking_for: "",
                    status: "New Lead"
                  });
                }}
                className="bg-muted text-muted-foreground px-6 py-3 sm:py-2 rounded-md text-sm hover:bg-muted/80"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-gradient-header">
            <button
              onClick={() => setShowAddClient(!showAddClient)}
              className="bg-primary text-primary-foreground px-6 py-3 sm:px-4 sm:py-2 rounded-md text-sm hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              {showAddClient ? 'Cancel' : 'Add New Client'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gradient-header border-b border-border">
                <tr>
                  <th className="text-left py-4 px-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
                  <th className="text-left py-4 px-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                  <th className="text-left py-4 px-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Looking For</th>
                  <th className="text-left py-4 px-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notes</th>
                  <th className="text-left py-4 px-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
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
                    <td colSpan={6} className="py-12 px-4 text-center text-muted-foreground">
                      <div className="animate-fade-in">
                        <div className="text-lg font-medium mb-2">No clients found</div>
                        <div className="text-sm">Try adjusting your filters or add a new client</div>
                      </div>
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