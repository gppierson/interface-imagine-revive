import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
}

interface Commission {
  id: string;
  property: string;
  rate3: number;
  rate6: number;
  likely: number;
  estimatedClosing: string;
  listingStatus: "listed" | "pending" | "sold" | "withdrawn";
  commissionStatus: "not-paid" | "paid";
  client: string;
  listingPrice: number;
}

// Mock listings data - in real app this would come from props or context
const mockListings: Property[] = [
  {
    id: "1",
    address: "1069 S 1600 W, Perry UT 84302",
    type: "sale",
    status: "listed",
    price: "$987,900",
    squareFeet: "2,450 sq ft",
    lotSize: "2.35 acres",
    notes: [],
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
    notes: [],
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
    notes: [],
    dateAdded: "7/12/2025"
  },
  {
    id: "5",
    address: "800 Tech Boulevard, Lehi UT 84043",
    type: "lease",
    status: "pending",
    price: "$3,200/month",
    squareFeet: "2,400 sq ft",
    lotSize: "0.5 acres",
    notes: [],
    dateAdded: "7/10/2025"
  }
];

interface AddCommissionModalProps {
  onAddCommission: (commission: Omit<Commission, 'id'>) => void;
}

export function AddCommissionModal({ onAddCommission }: AddCommissionModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    selectedListing: "",
    commissionRate: "3",
    estimatedClosing: undefined as Date | undefined,
    listingStatus: "listed" as const,
    commissionStatus: "not-paid" as const
  });
  const { toast } = useToast();

  const selectedProperty = mockListings.find(listing => listing.id === formData.selectedListing);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedListing) {
      toast({
        title: "Error",
        description: "Please select a listing",
        variant: "destructive"
      });
      return;
    }

    if (!selectedProperty) return;

    // Parse price from string format like "$987,900" or "$2,500/month"
    const priceStr = selectedProperty.price?.replace(/[$,]/g, '') || '0';
    const listingPrice = parseFloat(priceStr.split('/')[0]); // Remove /month if present
    
    const rate3 = listingPrice * 0.03;
    const rate6 = listingPrice * 0.06;
    
    // Calculate likely commission based on selected rate
    const likely = formData.commissionRate === "6" ? rate6 : rate3;

    const newCommission: Omit<Commission, 'id'> = {
      property: selectedProperty.address,
      client: `Client for ${selectedProperty.address}`, // Could be enhanced with actual client data
      listingPrice,
      rate3,
      rate6,
      likely,
      estimatedClosing: formData.estimatedClosing ? format(formData.estimatedClosing, "PPP") : "TBD",
      listingStatus: formData.listingStatus,
      commissionStatus: formData.commissionStatus
    };

    onAddCommission(newCommission);
    
    toast({
      title: "Success",
      description: "Commission added to pipeline",
    });

    // Reset form
    setFormData({
      selectedListing: "",
      commissionRate: "3",
      estimatedClosing: undefined,
      listingStatus: "listed",
      commissionStatus: "not-paid"
    });
    
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className="h-10 sm:h-7 px-3 text-sm sm:text-xs gap-1"
        >
          <Plus className="w-4 h-4 sm:w-3 sm:h-3" />
          Add Commission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Commission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="listing">Select Listing *</Label>
              <Select value={formData.selectedListing} onValueChange={(value) => handleInputChange("selectedListing", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a listing..." />
                </SelectTrigger>
                <SelectContent>
                  {mockListings.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id}>
                      <div className="flex flex-col">
                        <span>{listing.address}</span>
                        <span className="text-xs text-muted-foreground">
                          {listing.type} • {listing.price} • {listing.status}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProperty && (
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="text-sm font-medium">{selectedProperty.address}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {selectedProperty.type} • {selectedProperty.price} • {selectedProperty.squareFeet}
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="commissionRate">Expected Commission Rate</Label>
              <Select value={formData.commissionRate} onValueChange={(value) => handleInputChange("commissionRate", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3%</SelectItem>
                  <SelectItem value="6">6%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="estimatedClosing">Estimated Closing</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.estimatedClosing && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.estimatedClosing ? format(formData.estimatedClosing, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.estimatedClosing}
                    onSelect={(date) => handleInputChange("estimatedClosing", date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="listingStatus">Current Listing Status</Label>
              <Select value={formData.listingStatus} onValueChange={(value: "listed" | "pending" | "sold" | "withdrawn") => handleInputChange("listingStatus", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="listed">Listed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="commissionStatus">Commission Status</Label>
              <Select value={formData.commissionStatus} onValueChange={(value: "not-paid" | "paid") => handleInputChange("commissionStatus", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-paid">Not Paid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Commission
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}