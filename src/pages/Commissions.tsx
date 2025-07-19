import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, DollarSign, TrendingUp, Calendar, Users, Search, Filter, Edit, Trash2, ChevronRight } from "lucide-react";
import { AddCommissionModal } from "@/components/AddCommissionModal";
import crestLogo from "@/assets/crest-realty-logo.svg";

interface Commission {
  id: string;
  property: string;
  rate3: number;
  rate6: number;
  likely: number;
  estimatedClosing: Date;
  listingStatus: "listed" | "pending" | "sold" | "withdrawn";
  commissionStatus: "not-paid" | "paid";
  client: string;
  listingPrice: number;
}

const mockCommissions: Commission[] = [
  {
    id: "1",
    property: "Tefco Building",
    rate3: 11597.85,
    rate6: 11597.85,
    likely: 11597.85,
    estimatedClosing: new Date(2025, 5, 15), // June 15, 2025
    listingStatus: "listed",
    commissionStatus: "not-paid",
    client: "Tefco Corp",
    listingPrice: 386595.00
  },
  {
    id: "2",
    property: "Tefco Business",
    rate3: 2970.00,
    rate6: 2970.00,
    likely: 2970.00,
    estimatedClosing: new Date(2025, 5, 30), // June 30, 2025
    listingStatus: "listed",
    commissionStatus: "not-paid",
    client: "Tefco Corp",
    listingPrice: 99000.00
  },
  {
    id: "3",
    property: "Frito Lay 5 Acres",
    rate3: 12128.74,
    rate6: 12128.74,
    likely: 12128.74,
    estimatedClosing: new Date(2025, 8, 10), // September 10, 2025
    listingStatus: "pending",
    commissionStatus: "not-paid",
    client: "Frito Lay Inc",
    listingPrice: 404291.33
  },
  {
    id: "4",
    property: "Key Bank",
    rate3: 13921.88,
    rate6: 27843.75,
    likely: 13921.88,
    estimatedClosing: new Date(2025, 7, 25), // August 25, 2025
    listingStatus: "pending",
    commissionStatus: "not-paid",
    client: "Key Bank Corp",
    listingPrice: 464062.50
  },
  {
    id: "5",
    property: "Cornerstone",
    rate3: 9281.25,
    rate6: 12375.00,
    likely: 12375.00,
    estimatedClosing: new Date(2025, 6, 20), // July 20, 2025
    listingStatus: "listed",
    commissionStatus: "not-paid",
    client: "Cornerstone Dev",
    listingPrice: 309375.00
  },
  {
    id: "6",
    property: "Gray Cliff",
    rate3: 5197.50,
    rate6: 10395.00,
    likely: 3712.50,
    estimatedClosing: new Date(2025, 11, 5), // December 5, 2025
    listingStatus: "pending",
    commissionStatus: "not-paid",
    client: "Gray Cliff LLC",
    listingPrice: 173250.00
  },
  {
    id: "7",
    property: "Collision Craft",
    rate3: 4455.00,
    rate6: 8910.00,
    likely: 4455.00,
    estimatedClosing: new Date(2025, 10, 15), // November 15, 2025
    listingStatus: "pending",
    commissionStatus: "not-paid",
    client: "Collision Craft",
    listingPrice: 148500.00
  },
  {
    id: "8",
    property: "Hearth and Home",
    rate3: 13921.88,
    rate6: 27843.75,
    likely: 13921.88,
    estimatedClosing: new Date(2026, 2, 10), // March 10, 2026
    listingStatus: "pending",
    commissionStatus: "not-paid",
    client: "Hearth & Home",
    listingPrice: 464062.50
  },
  {
    id: "9",
    property: "2873 Quincy",
    rate3: 6682.50,
    rate6: 13365.00,
    likely: 6682.50,
    estimatedClosing: new Date(2026, 1, 28), // February 28, 2026
    listingStatus: "pending",
    commissionStatus: "not-paid",
    client: "Quincy Investments",
    listingPrice: 222750.00
  }
];

export default function Commissions() {
  const navigate = useNavigate();
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "not-paid" | "paid">("all");

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = commission.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         commission.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || commission.commissionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = {
    rate3: filteredCommissions.reduce((sum, commission) => sum + commission.rate3, 0),
    rate6: filteredCommissions.reduce((sum, commission) => sum + commission.rate6, 0),
    likely: filteredCommissions.reduce((sum, commission) => sum + commission.likely, 0)
  };

  const statusCounts = {
    all: commissions.length,
    "not-paid": commissions.filter(c => c.commissionStatus === "not-paid").length,
    paid: commissions.filter(c => c.commissionStatus === "paid").length
  };

  const handleAddCommission = (newCommission: Omit<Commission, 'id'>) => {
    const commission: Commission = {
      ...newCommission,
      id: Date.now().toString(),
      estimatedClosing: typeof newCommission.estimatedClosing === 'string' 
        ? new Date() 
        : newCommission.estimatedClosing
    };
    setCommissions(prev => [...prev, commission]);
  };

  const handleEditCommission = (id: string) => {
    console.log("Edit commission:", id);
    // TODO: Implement edit functionality
  };

  const handleDeleteCommission = (id: string) => {
    setCommissions(prev => prev.filter(c => c.id !== id));
  };

  const getCommissionStatusBadge = (commissionStatus: string) => {
    switch (commissionStatus) {
      case "paid":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 text-xs px-2 py-0.5">Paid</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-300 text-xs px-2 py-0.5">Not Paid</Badge>;
    }
  };

  const getListingStatusBadge = (listingStatus: string) => {
    switch (listingStatus) {
      case "listed":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 text-xs px-2 py-0.5">Listed</Badge>;
      case "pending":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 text-xs px-2 py-0.5">Under Contract</Badge>;
      case "sold":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0 text-xs px-2 py-0.5">Sold</Badge>;
      case "withdrawn":
        return <Badge variant="outline" className="text-gray-600 border-gray-300 text-xs px-2 py-0.5">Withdrawn</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600 border-gray-300 text-xs px-2 py-0.5">Unknown</Badge>;
    }
  };

  const getCommissionTypeBadge = (property: string) => {
    // Determine type based on property characteristics
    if (property.toLowerCase().includes('business') || property.toLowerCase().includes('craft')) {
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-1 font-medium">Business</Badge>;
    } else if (property.toLowerCase().includes('lease') || property.toLowerCase().includes('rent')) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-1 font-medium">Lease</Badge>;
    } else {
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs px-2 py-1 font-medium">Sale</Badge>;
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background">
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
                  Listings
                  <Badge variant="outline" className="ml-1 h-4 px-1.5 text-xs border-muted-foreground/30 text-muted-foreground">
                    0
                  </Badge>
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/clients")}
                  className="h-8 px-4 text-xs font-semibold border-2 border-muted-foreground/20 hover:border-crest-red hover:text-crest-red hover:bg-crest-red/5 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Users className="w-3 h-3 mr-1" />
                  Clients
                  <Badge variant="outline" className="ml-1 h-4 px-1.5 text-xs border-muted-foreground/30 text-muted-foreground">
                    0
                  </Badge>
                </Button>

                <Button 
                  variant="crest-primary"
                  size="sm"
                  className="h-8 px-4 text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 border-0"
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  Commissions
                  <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs bg-white/90 text-crest-red border-0 shadow-sm">
                    {statusCounts.all}
                  </Badge>
                </Button>

                <Button 
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/deal-intelligence")}
                  className="h-8 px-4 text-xs font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Offer Intelligence
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:block">Last Updated 7/19/2025 at 2:45 PM</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 sm:px-6 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex flex-wrap items-center gap-1">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                  className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
                >
                  All ({statusCounts.all})
                </Button>
                <Button
                  variant={statusFilter === "not-paid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("not-paid")}
                  className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
                >
                  Not Paid ({statusCounts["not-paid"]})
                </Button>
                <Button
                  variant={statusFilter === "paid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("paid")}
                  className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
                >
                  Paid ({statusCounts.paid})
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-3 sm:h-3" />
                <Input
                  placeholder="Search deals"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-7 h-10 sm:h-7 w-full sm:w-60 text-sm sm:text-xs"
                />
              </div>
              <AddCommissionModal onAddCommission={handleAddCommission} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                3% Commission Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                ${totals.rate3.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                6% Commission Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${totals.rate6.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Likely Commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${totals.likely.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Table */}
        <Card className="shadow-sm border-border/40">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">Commission Pipeline</CardTitle>
            <p className="text-sm text-muted-foreground">Track and manage your commission earnings</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-gray-50 border-b">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-1">TYPE</div>
                <div className="col-span-3">PROPERTY</div>
                <div className="col-span-1 text-right">3% RATE</div>
                <div className="col-span-1 text-right">6% RATE</div>
                <div className="col-span-1 text-right">LIKELY</div>
                <div className="col-span-2">EST. CLOSING</div>
                <div className="col-span-1">STATUS</div>
                <div className="col-span-1">COMMISSION</div>
                <div className="col-span-1 text-center">ACTIONS</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {filteredCommissions.map((commission, index) => (
                <div 
                  key={commission.id} 
                  className={cn(
                    "grid grid-cols-12 gap-4 py-4 px-6 hover:bg-gray-50/50 transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  )}
                >
                  {/* Type Badge */}
                  <div className="col-span-1 flex items-center">
                    <ChevronRight className="w-3 h-3 text-gray-300 mr-2" />
                    {getCommissionTypeBadge(commission.property)}
                  </div>
                  
                  {/* Property Info */}
                  <div className="col-span-3">
                    <div className="font-medium text-sm text-gray-900 mb-1">
                      {commission.property}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="text-gray-400">Add nickname...</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Listing Price: <span className="font-medium text-gray-700">${commission.listingPrice.toLocaleString()}</span>
                    </div>
                  </div>
                   
                  {/* Commission Rates */}
                  <div className="col-span-1 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${commission.rate3.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  
                  <div className="col-span-1 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${commission.rate6.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  
                  <div className="col-span-1 text-right">
                    <div className="text-sm font-semibold text-emerald-600">
                      ${commission.likely.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  
                  {/* Est. Closing */}
                  <div className="col-span-2">
                    <div className="text-sm text-gray-900">
                      {commission.estimatedClosing.toLocaleDateString('en-US', { 
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex items-center gap-1">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        commission.listingStatus === "listed" ? "bg-emerald-500" :
                        commission.listingStatus === "pending" ? "bg-orange-500" :
                        commission.listingStatus === "sold" ? "bg-blue-500" : "bg-gray-400"
                      )} />
                      <span className="text-sm text-gray-700">
                        {commission.listingStatus === "pending" ? "Under Contract" : 
                         commission.listingStatus.charAt(0).toUpperCase() + commission.listingStatus.slice(1)}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-400 ml-1" />
                    </div>
                  </div>
                  
                  {/* Commission Status */}
                  <div className="col-span-1">
                    {getCommissionStatusBadge(commission.commissionStatus)}
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-1">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCommission(commission.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        title="Edit commission"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCommission(commission.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete commission"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals Footer */}
            <div className="border-t-2 border-gray-200 bg-gray-50">
              <div className="grid grid-cols-12 gap-4 py-4 px-6">
                <div className="col-span-4">
                  <span className="text-base font-semibold text-gray-900">Totals</span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-sm font-bold text-gray-900">
                    ${totals.rate3.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-sm font-bold text-gray-900">
                    ${totals.rate6.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-base font-bold text-emerald-600">
                    ${totals.likely.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="col-span-5"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}