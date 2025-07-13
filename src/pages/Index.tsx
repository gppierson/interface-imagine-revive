import { useState, useMemo } from "react";
import { PropertyHeader } from "@/components/PropertyHeader";
import { PropertyFilters } from "@/components/PropertyFilters";
import { PropertyCard } from "@/components/PropertyCard";

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

// Sample data
const initialProperties: Property[] = [
  {
    id: "1",
    address: "1069 S 1600 W, Perry UT 84302",
    type: "sale",
    status: "listed",
    notes: [
      { id: "1", content: "testing", date: "2025-07-13" },
      { id: "2", content: "testing", date: "2025-07-13" }
    ],
    dateAdded: "2025-07-13"
  },
  {
    id: "2", 
    address: "1090 Cambridge Cir, Layton UT 84040",
    type: "sale",
    status: "listed",
    notes: [
      { id: "3", content: "test", date: "2025-07-13" }
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
    status: "pending",
    notes: [
      { id: "4", content: "Great location for retail", date: "2025-07-13" }
    ],
    dateAdded: "2025-07-12"
  },
  {
    id: "5",
    address: "1200 Business Park Dr, Provo UT 84601",
    type: "business",
    status: "listed",
    notes: [],
    dateAdded: "2025-07-11"
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
      <PropertyHeader 
        listingsCount={properties.length}
        clientsCount={0}
        lastUpdated="7/12/2025"
      />

      <PropertyFilters
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredAndSortedProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground text-lg mb-2">No properties found</div>
            <div className="text-muted-foreground text-sm">
              Try adjusting your filters or search criteria
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onUpdateProperty={handleUpdateProperty}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
