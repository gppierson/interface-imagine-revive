import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface AddCommissionModalProps {
  onAddCommission: (commission: Omit<Commission, 'id'>) => void;
}

export function AddCommissionModal({ onAddCommission }: AddCommissionModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    property: "",
    client: "",
    listingPrice: "",
    commissionRate: "3",
    estimatedClosing: "",
    status: "pending" as const
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.property || !formData.client || !formData.listingPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const listingPrice = parseFloat(formData.listingPrice);
    const rate3 = listingPrice * 0.03;
    const rate6 = listingPrice * 0.06;
    
    // Calculate likely commission based on selected rate
    const likely = formData.commissionRate === "6" ? rate6 : rate3;

    const newCommission: Omit<Commission, 'id'> = {
      property: formData.property,
      client: formData.client,
      listingPrice,
      rate3,
      rate6,
      likely,
      estimatedClosing: formData.estimatedClosing || "TBD",
      status: formData.status
    };

    onAddCommission(newCommission);
    
    toast({
      title: "Success",
      description: "Commission added to pipeline",
    });

    // Reset form
    setFormData({
      property: "",
      client: "",
      listingPrice: "",
      commissionRate: "3",
      estimatedClosing: "",
      status: "pending"
    });
    
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
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
              <Label htmlFor="property">Property Name *</Label>
              <Input
                id="property"
                value={formData.property}
                onChange={(e) => handleInputChange("property", e.target.value)}
                placeholder="e.g., Downtown Office Building"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="client">Client Name *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleInputChange("client", e.target.value)}
                placeholder="e.g., ABC Corporation"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="listingPrice">Listing Price *</Label>
              <Input
                id="listingPrice"
                type="number"
                step="0.01"
                value={formData.listingPrice}
                onChange={(e) => handleInputChange("listingPrice", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            
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
              <Input
                id="estimatedClosing"
                value={formData.estimatedClosing}
                onChange={(e) => handleInputChange("estimatedClosing", e.target.value)}
                placeholder="e.g., Q2 2025, July 2025"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: "pending" | "confirmed" | "paid") => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
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