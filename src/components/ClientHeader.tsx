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
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={crestLogo} alt="Crest Realty Logo" className="w-24 h-16 sm:w-32 sm:h-20 object-contain" />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/")}
                className="h-10 sm:h-8 px-4 sm:px-3 text-sm sm:text-xs"
              >
                <Building2 className="w-4 h-4 sm:w-3 sm:h-3" />
                Listings
                <Badge variant="outline" className="ml-1 h-5 sm:h-4 px-2 sm:px-1 text-sm sm:text-xs">
                  0
                </Badge>
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-red-600 text-white border-red-600 hover:bg-red-700 h-10 sm:h-8 px-4 sm:px-3 text-sm sm:text-xs"
              >
                <Users className="w-4 h-4 sm:w-3 sm:h-3" />
                Clients
                <Badge variant="outline" className="bg-white/20 text-white border-white/30 ml-1 h-5 sm:h-4 px-2 sm:px-1 text-sm sm:text-xs">
                  {counts.all}
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