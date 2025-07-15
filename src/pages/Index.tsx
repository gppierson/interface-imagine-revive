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
  price?: string;
  squareFeet?: string;
  lotSize?: string;
    notes: Array<{
      id: string;
      content: string;
      date: string;
      author?: string;
    }>;
  dateAdded: string;
  leaseCommencement?: Date;
  sellerDisclosureDeadline?: Date;
  dueDiligenceDeadline?: Date;
  closingDate?: Date;
}

// Updated sample data matching the reference design
const initialProperties: Property[] = [
  {
    id: "1",
    address: "1069 S 1600 W, Perry UT 84302",
    type: "sale",
    status: "listed",
    price: "$987,900",
    squareFeet: "2,450 sq ft",
    lotSize: "2.35 acres",
    notes: [
      { id: "1", content: "testing", date: "7/13/2025", author: "John Doe" },
      { id: "2", content: "testing", date: "7/13/2025", author: "Jane Smith" }
    ],
    dateAdded: "7/13/2025"
  },
  {
    id: "2", 
    address: "1090 Cambridge Cir, Layton UT 84040",
    type: "sale",
    status: "listed",
    price: "$1,650,000",
    squareFeet: "3,200 sq ft",
    lotSize: "0.37 acres",
    notes: [
      { id: "3", content: "test", date: "7/13/2025", author: "John Doe" }
    ],
    dateAdded: "7/13/2025"
  },
  {
    id: "3",
    address: "1480 Ridgeline Dr, South Ogden UT 84405", 
    type: "sale",
    status: "listed",
    price: "$3,347,500",
    squareFeet: "5,800 sq ft",
    lotSize: "1 acres",
    notes: [],
    dateAdded: "7/13/2025"
  },
  {
    id: "4",
    address: "500 Main Street, Salt Lake City UT 84101",
    type: "lease",
    status: "listed",
    price: "$2,500/month",
    squareFeet: "1,200 sq ft",
    lotSize: "0.1 acres",
    notes: [
      { id: "4", content: "Perfect for retail business", date: "7/13/2025", author: "Sarah Wilson" }
    ],
    dateAdded: "7/12/2025"
  },
  {
    id: "5",
    address: "1200 Business Park Dr, Provo UT 84601",
    type: "business",
    status: "sold",
    price: "$450,000",
    squareFeet: "5,000 sq ft",
    lotSize: "0.5 acres",
    notes: [],
    dateAdded: "7/11/2025"
  },
  {
    id: "6",
    address: "800 Tech Boulevard, Lehi UT 84043",
    type: "lease",
    status: "pending",
    price: "$3,200/month",
    squareFeet: "2,400 sq ft",
    lotSize: "0.5 acres",
    notes: [
      { id: "5", content: "High-tech office space", date: "7/10/2025", author: "Mike Johnson" },
      { id: "6", content: "Multiple interested parties", date: "7/12/2025", author: "Emily Davis" }
    ],
    dateAdded: "7/10/2025"
  },
  {
    id: "7",
    address: "2500 Industrial Way, West Valley UT 84119",
    type: "business",
    status: "withdrawn",
    price: "$320,000",
    squareFeet: "3,800 sq ft",
    lotSize: "0.8 acres",
    notes: [
      { id: "7", content: "Owner decided not to sell", date: "7/11/2025", author: "Tom Brown" }
    ],
    dateAdded: "7/9/2025"
  },
  // Additional properties to match the 40 total count
  {
    id: "8",
    address: "2100 North Temple, Salt Lake City UT 84116",
    type: "lease",
    status: "listed",
    price: "$1,800/month",
    squareFeet: "950 sq ft",
    lotSize: "0.2 acres",
    notes: [],
    dateAdded: "7/8/2025"
  },
  {
    id: "9",
    address: "3500 South State, South Salt Lake UT 84115",
    type: "sale",
    status: "pending",
    price: "$425,000",
    squareFeet: "1,800 sq ft",
    lotSize: "0.25 acres",
    notes: [
      { id: "8", content: "Offer received", date: "7/12/2025", author: "Lisa Green" }
    ],
    dateAdded: "7/7/2025"
  },
  {
    id: "10",
    address: "1800 West 3500 South, West Valley UT 84119",
    type: "lease",
    status: "listed",
    price: "$2,200/month",
    squareFeet: "1,500 sq ft",
    lotSize: "0.3 acres",
    notes: [],
    dateAdded: "7/6/2025"
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
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider w-8">
                    
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Square Feet
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Lot Size
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Listed Date
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
