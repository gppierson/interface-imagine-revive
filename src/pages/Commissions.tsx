import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, DollarSign, TrendingUp, Calendar, Users, Search, Filter } from "lucide-react";
import { AddCommissionModal } from "@/components/AddCommissionModal";
import crestLogo from "@/assets/crest-realty-logo.svg";

interface Commission {
  id: string;
  property: string;
  rate3: number;
  rate6: number;
  likely: number;
  estimatedClosing: string;
  status: "pending" | "confirmed" | "paid";
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
    estimatedClosing: "Q2 2025",
    status: "confirmed",
    client: "Tefco Corp",
    listingPrice: 386595.00
  },
  {
    id: "2",
    property: "Tefco Business",
    rate3: 2970.00,
    rate6: 2970.00,
    likely: 2970.00,
    estimatedClosing: "Q2 2025",
    status: "confirmed",
    client: "Tefco Corp",
    listingPrice: 99000.00
  },
  {
    id: "3",
    property: "Frito Lay 5 Acres",
    rate3: 12128.74,
    rate6: 12128.74,
    likely: 12128.74,
    estimatedClosing: "Q3 2025",
    status: "pending",
    client: "Frito Lay Inc",
    listingPrice: 404291.33
  },
  {
    id: "4",
    property: "Key Bank",
    rate3: 13921.88,
    rate6: 27843.75,
    likely: 13921.88,
    estimatedClosing: "Q3 2025",
    status: "pending",
    client: "Key Bank Corp",
    listingPrice: 464062.50
  },
  {
    id: "5",
    property: "Cornerstone",
    rate3: 9281.25,
    rate6: 12375.00,
    likely: 12375.00,
    estimatedClosing: "July 2025",
    status: "confirmed",
    client: "Cornerstone Dev",
    listingPrice: 309375.00
  },
  {
    id: "6",
    property: "Gray Cliff",
    rate3: 5197.50,
    rate6: 10395.00,
    likely: 3712.50,
    estimatedClosing: "Q4 2025",
    status: "pending",
    client: "Gray Cliff LLC",
    listingPrice: 173250.00
  },
  {
    id: "7",
    property: "Collision Craft",
    rate3: 4455.00,
    rate6: 8910.00,
    likely: 4455.00,
    estimatedClosing: "Q4 2025",
    status: "pending",
    client: "Collision Craft",
    listingPrice: 148500.00
  },
  {
    id: "8",
    property: "Hearth and Home",
    rate3: 13921.88,
    rate6: 27843.75,
    likely: 13921.88,
    estimatedClosing: "Q1 2026",
    status: "pending",
    client: "Hearth & Home",
    listingPrice: 464062.50
  },
  {
    id: "9",
    property: "2873 Quincy",
    rate3: 6682.50,
    rate6: 13365.00,
    likely: 6682.50,
    estimatedClosing: "Q1 2026",
    status: "pending",
    client: "Quincy Investments",
    listingPrice: 222750.00
  }
];

export default function Commissions() {
  const navigate = useNavigate();
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "paid">("all");

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = commission.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         commission.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || commission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = {
    rate3: filteredCommissions.reduce((sum, commission) => sum + commission.rate3, 0),
    rate6: filteredCommissions.reduce((sum, commission) => sum + commission.rate6, 0),
    likely: filteredCommissions.reduce((sum, commission) => sum + commission.likely, 0)
  };

  const statusCounts = {
    all: commissions.length,
    pending: commissions.filter(c => c.status === "pending").length,
    confirmed: commissions.filter(c => c.status === "confirmed").length,
    paid: commissions.filter(c => c.status === "paid").length
  };

  const handleAddCommission = (newCommission: Omit<Commission, 'id'>) => {
    const commission: Commission = {
      ...newCommission,
      id: Date.now().toString()
    };
    setCommissions(prev => [...prev, commission]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">Confirmed</Badge>;
      case "paid":
        return <Badge variant="default" className="bg-blue-100 text-blue-700 border-blue-200">Paid</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
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
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                  className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
                >
                  Pending ({statusCounts.pending})
                </Button>
                <Button
                  variant={statusFilter === "confirmed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("confirmed")}
                  className="h-9 sm:h-7 px-3 sm:px-2 text-sm sm:text-xs"
                >
                  Confirmed ({statusCounts.confirmed})
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
                  placeholder="Search properties or clients..."
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Commission Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Property</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Client</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">3% Rate</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">6% Rate</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Likely</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Est. Closing</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommissions.map((commission) => (
                    <tr key={commission.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-2">
                        <div className="font-medium text-sm">{commission.property}</div>
                        <div className="text-xs text-muted-foreground">
                          ${commission.listingPrice.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">{commission.client}</td>
                      <td className="py-3 px-2 text-right text-sm font-medium">
                        ${commission.rate3.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-2 text-right text-sm font-medium">
                        ${commission.rate6.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-2 text-right text-sm font-bold text-emerald-600">
                        ${commission.likely.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">{commission.estimatedClosing}</td>
                      <td className="py-3 px-2">{getStatusBadge(commission.status)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border bg-muted/10">
                    <td className="py-3 px-2 font-semibold text-sm">Totals</td>
                    <td className="py-3 px-2"></td>
                    <td className="py-3 px-2 text-right font-bold text-sm">
                      ${totals.rate3.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-sm">
                      ${totals.rate6.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-sm text-emerald-600">
                      ${totals.likely.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2"></td>
                    <td className="py-3 px-2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}