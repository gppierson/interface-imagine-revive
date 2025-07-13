import { useState, useMemo } from "react";
import { CompactHeader } from "@/components/CompactHeader";
import { PropertyRow } from "@/components/PropertyRow";

type PropertyType = "all" | "sale" | "lease" | "business";
type SortOption = "address" | "date" | "status";
type StatusFilter = "all" | "listed" | "pending" | "sold" | "withdrawn";

interface Property {
  id: string;
  address: string;
  type: "sale" | "lease" | "business";
  status: "listed" | "pending" | "sold" | "withdrawn";
  nickname?: string;
  notes: Array<{
    id: string;
    content: string;
    date: string;
  }>;
  dateAdded: string;
}

// Sample data with more properties for better demonstration
const initialProperties: Property[] = [
  {
    id: "1",
    address: "1069 S 1600 W, Perry UT 84302",
    type: "sale",
    status: "listed",
    notes: [
      { id: "1", content: "Great location near schools", date: "2025-07-13" },
      { id: "2", content: "Needs minor repairs", date: "2025-07-13" }
    ],
    dateAdded: "2025-07-13"
  },
  {
    id: "2", 
    address: "1090 Cambridge Cir, Layton UT 84040",
    type: "sale",
    status: "pending",
    nickname: "Cambridge Property",
    notes: [
      { id: "3", content: "Offer pending inspection", date: "2025-07-13" }
    ],
    dateAdded: "2025-07-13"
  },
  {
    id: "3",
    address: "1480 Ridgeline Dr, South Ogden UT 84405", 
    type: "sale",
    status: "listed",
    notes: [],
    dateAdded: "2025-07-13"
  },
  {
    id: "4",
    address: "500 Main Street, Salt Lake City UT 84101",
    type: "lease",
    status: "listed",
    nickname: "Downtown Office",
    notes: [
      { id: "4", content: "Perfect for retail business", date: "2025-07-13" }
    ],
    dateAdded: "2025-07-12"
  },
  {
    id: "5",
    address: "1200 Business Park Dr, Provo UT 84601",
    type: "business",
    status: "sold",
    notes: [],
    dateAdded: "2025-07-11"
  },
  {
    id: "6",
    address: "800 Tech Boulevard, Lehi UT 84043",
    type: "lease",
    status: "pending",
    nickname: "Tech Hub",
    notes: [
      { id: "5", content: "High-tech office space", date: "2025-07-10" },
      { id: "6", content: "Multiple interested parties", date: "2025-07-12" }
    ],
    dateAdded: "2025-07-10"
  },
  {
    id: "7",
    address: "2500 Industrial Way, West Valley UT 84119",
    type: "business",
    status: "withdrawn",
    notes: [
      { id: "7", content: "Owner decided not to sell", date: "2025-07-11" }
    ],
    dateAdded: "2025-07-09"
  }
];

const Index = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [propertyType, setPropertyType] = useState<PropertyType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("address");
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpdateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties;

    // Filter by type
    if (propertyType !== "all") {
      filtered = filtered.filter(p => p.type === propertyType);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "address":
          return a.address.localeCompare(b.address);
        case "date":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [properties, propertyType, statusFilter, sortBy, searchQuery]);

  const counts = useMemo(() => ({
    sale: properties.filter(p => p.type === "sale").length,
    lease: properties.filter(p => p.type === "lease").length, 
    business: properties.filter(p => p.type === "business").length,
    total: properties.length
  }), [properties]);

  return (
    <div className="min-h-screen bg-background">
      <CompactHeader
        propertyType={propertyType}
        onPropertyTypeChange={setPropertyType}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
      />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredAndSortedProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-2">No properties found</div>
            <div className="text-muted-foreground text-sm">
              Try adjusting your filters or search criteria
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedProperties.map((property) => (
                  <PropertyRow
                    key={property.id}
                    property={property}
                    onUpdate={handleUpdateProperty}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
