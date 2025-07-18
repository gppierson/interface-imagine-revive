import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import crestLogo from "@/assets/crest-realty-logo.svg";
import type { ClientStatus } from "@/pages/Clients";

interface ClientHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ClientStatus | "All";
  onStatusFilterChange: (status: ClientStatus | "All") => void;
  counts: {
    all: number;
    "New Lead": number;
    "Looking": number;
    "Negotiating": number;
    "On Hold": number;
    "Done": number;
    "Lost": number;
  };
}

export function ClientHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts
}: ClientHeaderProps) {
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
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="h-8 px-4 text-xs font-semibold border-2 border-muted-foreground/20 hover:border-crest-red hover:text-crest-red hover:bg-crest-red/5 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Building2 className="w-3 h-3 mr-1" />
                <span className="text-muted-foreground group-hover:text-crest-red">Listings</span>
                <Badge variant="outline" className="ml-1 h-4 px-1.5 text-xs border-muted-foreground/30 text-muted-foreground">
                  0
                </Badge>
              </Button>
              
              <Button 
                variant="crest-primary"
                size="sm"
                className="h-8 px-4 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 border-0"
              >
                <span className="text-white mr-1">Clients</span>
                <Badge variant="secondary" className="ml-0 h-4 px-1.5 text-xs bg-white/90 text-crest-red border-0 shadow-sm">
                  {counts.all}
                </Badge>
              </Button>

              <Button 
                variant="default"
                size="sm"
                className="h-8 px-4 text-xs font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <span className="mr-1">🤖</span>
                Deal Intelligence
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
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1">
              <Button
                variant={statusFilter === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusFilterChange("All")}
                className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
              >
                All ({counts.all})
              </Button>
              <Button
                variant={statusFilter === "New Lead" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusFilterChange("New Lead")}
                className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
              >
                New Lead ({counts["New Lead"]})
              </Button>
              <Button
                variant={statusFilter === "Looking" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusFilterChange("Looking")}
                className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
              >
                Looking ({counts["Looking"]})
              </Button>
              <Button
                variant={statusFilter === "Negotiating" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusFilterChange("Negotiating")}
                className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
              >
                Negotiating ({counts["Negotiating"]})
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-3 sm:h-3" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 sm:pl-7 h-10 sm:h-7 w-full sm:w-48 text-sm sm:text-xs"
              />
            </div>

            {/* Status Filter Dropdown */}
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-36 sm:w-32 h-10 sm:h-7 text-sm sm:text-xs">
                <Filter className="w-4 h-4 sm:w-3 sm:h-3" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="New Lead">New Lead</SelectItem>
                <SelectItem value="Looking">Looking</SelectItem>
                <SelectItem value="Negotiating">Negotiating</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}