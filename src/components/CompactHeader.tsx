import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SortAsc, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  return (
    <div className="border-b border-border bg-background">
      {/* Top Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
            <div className="flex items-center gap-2">
              <img src={crestLogo} alt="Crest Realty Logo" className="w-20 h-12 sm:w-28 sm:h-16 object-contain" />
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="crest-primary"
                size="sm"
                className="h-8 px-4 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 border-0"
              >
                <Building2 className="w-3 h-3 mr-1" />
                Listings
                <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs bg-white/90 text-crest-red border-0 shadow-sm">
                  {counts.total}
                </Badge>
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate("/clients")}
                className="h-8 px-4 text-xs font-semibold border-2 border-muted-foreground/20 hover:border-crest-red hover:text-crest-red hover:bg-crest-red/5 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="text-muted-foreground group-hover:text-crest-red">Clients</span>
                <Badge variant="outline" className="ml-1 h-4 px-1.5 text-xs border-muted-foreground/30 text-muted-foreground">
                  0
                </Badge>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">Last Updated 7/12/2025 at 10:26 PM</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Property Type Filter */}
            <div className="flex flex-wrap items-center gap-1">
              <Button
                variant={propertyType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyTypeChange("all")}
                className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
              >
                All ({counts.total})
              </Button>
              <Button
                variant={propertyType === "sale" ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyTypeChange("sale")}
                className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
              >
                Sale ({counts.sale})
              </Button>
              <Button
                variant={propertyType === "lease" ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyTypeChange("lease")}
                className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
              >
                Lease ({counts.lease})
              </Button>
              <Button
                variant={propertyType === "business" ? "default" : "outline"}
                size="sm"
                onClick={() => onPropertyTypeChange("business")}
                className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
              >
                Business ({counts.business})
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-3 sm:h-3" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 sm:pl-7 h-10 sm:h-7 w-full sm:w-48 text-sm sm:text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-28 sm:w-24 h-10 sm:h-7 text-sm sm:text-xs">
                  <Filter className="w-4 h-4 sm:w-3 sm:h-3" />
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
                <SelectTrigger className="w-28 sm:w-24 h-10 sm:h-7 text-sm sm:text-xs">
                  <SortAsc className="w-4 h-4 sm:w-3 sm:h-3" />
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
    </div>
  );
}