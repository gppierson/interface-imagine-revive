import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, SortAsc, Home, Building, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

type PropertyType = "all" | "sale" | "lease" | "business";
type SortOption = "address" | "date" | "status";
type StatusFilter = "all" | "listed" | "pending" | "sold" | "withdrawn";

interface PropertyFiltersProps {
  propertyType: PropertyType;
  onPropertyTypeChange: (type: PropertyType) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    sale: number;
    lease: number;
    business: number;
    total: number;
  };
}

export function PropertyFilters({
  propertyType,
  onPropertyTypeChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  counts
}: PropertyFiltersProps) {
  const typeButtons = [
    { 
      type: "sale" as PropertyType, 
      label: "For Sale", 
      icon: Home, 
      count: counts.sale,
      color: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
    },
    { 
      type: "lease" as PropertyType, 
      label: "For Lease", 
      icon: Building, 
      count: counts.lease,
      color: "bg-accent/10 text-accent-foreground border-accent/20 hover:bg-accent/20"
    },
    { 
      type: "business" as PropertyType, 
      label: "Business", 
      icon: Briefcase, 
      count: counts.business,
      color: "bg-estate-red/10 text-estate-red border-estate-red/20 hover:bg-estate-red/20"
    }
  ];

  return (
    <div className="bg-background border-b border-border/50 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Property Listings</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Property Type Filters */}
          <div className="flex items-center gap-3">
            <Button
              variant="property-filter"
              data-active={propertyType === "all"}
              onClick={() => onPropertyTypeChange("all")}
              className="h-10 px-4"
            >
              All Properties
              <Badge variant="secondary" className="ml-2">
                {counts.total}
              </Badge>
            </Button>
            
            {typeButtons.map(({ type, label, icon: Icon, count, color }) => (
              <Button
                key={type}
                variant="property-filter"
                data-active={propertyType === type}
                onClick={() => onPropertyTypeChange(type)}
                className={cn("h-10 px-4", propertyType === type && color)}
              >
                <Icon className="w-4 h-4" />
                {label}
                <Badge variant="secondary" className="ml-2">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="listed">Listed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="address">Sort by Address</SelectItem>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="status">Sort by Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}