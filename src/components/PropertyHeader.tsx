import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Calendar, Settings } from "lucide-react";

interface PropertyHeaderProps {
  listingsCount: number;
  clientsCount: number;
  lastUpdated: string;
}

export function PropertyHeader({ listingsCount, clientsCount, lastUpdated }: PropertyHeaderProps) {
  return (
    <div className="bg-gradient-header shadow-header border-b">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CREST REALTY</h1>
                <p className="text-white/80 text-sm">Commercial Property Management System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
            <Button variant="secondary" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Settings className="w-4 h-4" />
              Manual Scrape
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Button 
            variant="secondary" 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 h-12 px-6"
          >
            <Building2 className="w-5 h-5" />
            <span className="font-medium">Listings</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 ml-2">
              {listingsCount}
            </Badge>
          </Button>
          
          <Button 
            variant="ghost" 
            className="text-white/70 hover:text-white hover:bg-white/10 h-12 px-6"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Clients</span>
            <Badge variant="outline" className="bg-transparent text-white/70 border-white/30 ml-2">
              {clientsCount}
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
}