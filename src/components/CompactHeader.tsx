import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SortAsc, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import crestLogo from "@/assets/crest-realty-logo.svg";

type PropertyType = "all" | "sale" | "lease" | "business";
type SortOption = "address" | "date" | "status";
type StatusFilter = "all" | "listed" | "pending" | "sold" | "withdrawn";

interface CompactHeaderProps {
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

export function CompactHeader({
  propertyType,
  onPropertyTypeChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  counts
}: CompactHeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={crestLogo} alt="Crest Realty Logo" className="w-32 h-20 object-contain" />
            </div>
            
            <div className="flex items-center gap-2 ml-6">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-red-600 text-white border-red-600 hover:bg-red-700 h-8 px-3 text-xs"
              >
                <Building2 className="w-3 h-3" />
                Listings
                <Badge variant="outline" className="bg-white/20 text-white border-white/30 ml-1 h-4 px-1 text-xs">
                  {counts.total}
                </Badge>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-3 text-xs"
              >
                Clients
                <Badge variant="outline" className="ml-1 h-4 px-1 text-xs">
                  0
                </Badge>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Last Updated 7/12/2025 at 10:26 PM</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Property Type Filter */}
            <div className="flex items-center gap-1">
              <Button
                variant={propertyType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyTypeChange("all")}
                className="h-7 px-2 text-xs"
              >
                All ({counts.total})
              </Button>
              <Button
                variant={propertyType === "sale" ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyTypeChange("sale")}
                className="h-7 px-2 text-xs"
              >
                Sale ({counts.sale})
              </Button>
              <Button
                variant={propertyType === "lease" ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyTypeChange("lease")}
                className="h-7 px-2 text-xs"
              >
                Lease ({counts.lease})
              </Button>
              <Button
                variant={propertyType === "business" ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyTypeChange("business")}
                className="h-7 px-2 text-xs"
              >
                Business ({counts.business})
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-7 h-7 w-48 text-xs"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-24 h-7 text-xs">
                <Filter className="w-3 h-3" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="listed">Listed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-24 h-7 text-xs">
                <SortAsc className="w-3 h-3" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="address">Address</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}