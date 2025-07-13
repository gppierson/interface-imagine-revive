import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit2, CheckCircle2, Clock, XCircle, ChevronDown, ChevronRight, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Note {
  id: string;
  content: string;
  date: string;
}

interface Property {
  id: string;
  address: string;
  type: "sale" | "lease" | "business";
  status: "listed" | "pending" | "sold" | "withdrawn";
  nickname?: string;
  price?: string;
  squareFeet?: string;
  lotSize?: string;
  notes: Note[];
  dateAdded: string;
  leaseCommencement?: Date;
  sellerDisclosureDeadline?: Date;
  dueDiligenceDeadline?: Date;
  closingDate?: Date;
}

interface PropertyRowProps {
  property: Property;
  onUpdate: (id: string, updates: Partial<Property>) => void;
}

export function PropertyRow({ property, onUpdate }: PropertyRowProps) {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameValue, setNicknameValue] = useState(property.nickname || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState("");

  const handleNicknameUpdate = () => {
    onUpdate(property.id, { nickname: nicknameValue });
    setIsEditingNickname(false);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        date: new Date().toLocaleDateString()
      };
      onUpdate(property.id, { 
        notes: [...property.notes, note] 
      });
      setNewNote("");
    }
  };

  const statusConfig = {
    listed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    sold: { icon: CheckCircle2, color: "text-muted-foreground", bg: "bg-muted" },
    withdrawn: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" }
  };

  const typeConfig = {
    sale: { label: "Sale", color: "bg-primary/10 text-primary border-primary/20" },
    lease: { label: "Lease", color: "bg-info/10 text-info border-info/20" },
    business: { label: "Business", color: "bg-warning/10 text-warning border-warning/20" }
  };

  const StatusIcon = statusConfig[property.status].icon;

  const DatePicker = ({ date, onDateChange, placeholder }: { date?: Date; onDateChange: (date: Date | undefined) => void; placeholder: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal text-xs h-8",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      <tr 
        className="border-b border-border/50 hover:bg-muted/30 transition-colors group cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse Icon */}
        <td className="py-3 px-4 w-8">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </td>

        {/* Property Type */}
        <td className="py-3 px-4">
          <Badge variant="outline" className={cn("text-xs font-medium", typeConfig[property.type].color)}>
            {typeConfig[property.type].label}
          </Badge>
        </td>

      {/* Address & Nickname */}
      <td className="py-3 px-4 min-w-0">
        <div className="space-y-1">
          <div className="font-medium text-foreground text-sm">{property.address}</div>
          {isEditingNickname ? (
            <div className="flex items-center gap-2">
              <Input
                value={nicknameValue}
                onChange={(e) => setNicknameValue(e.target.value)}
                className="h-7 text-xs"
                placeholder="Add nickname..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNicknameUpdate();
                  if (e.key === 'Escape') setIsEditingNickname(false);
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleNicknameUpdate} className="h-7 px-2 text-xs">
                Save
              </Button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingNickname(true);
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              {property.nickname || "Add nickname..."}
            </button>
          )}
        </div>
      </td>

      {/* Price */}
      <td className="py-3 px-4">
        {property.price ? (
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {property.type === 'lease' ? 'Lease Price:' : 'Sale Price:'}
            </div>
            <div className="font-semibold text-foreground">{property.price}</div>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </td>

      {/* Square Feet */}
      <td className="py-3 px-4">
        <div className="text-sm text-foreground">
          {property.squareFeet || '-'}
        </div>
      </td>

      {/* Lot Size */}
      <td className="py-3 px-4">
        <div className="text-sm text-foreground">
          {property.lotSize || '-'}
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className={cn("p-1 rounded-full", statusConfig[property.status].bg)}>
            <StatusIcon className={cn("w-3 h-3", statusConfig[property.status].color)} />
          </div>
          <Select
            value={property.status}
            onValueChange={(value) => onUpdate(property.id, { status: value as any })}
          >
            <SelectTrigger 
              className="h-8 w-28 text-xs border-0 bg-transparent hover:bg-muted/50"
              onClick={(e) => e.stopPropagation()}
            >
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
      </td>

      {/* Listed Date */}
      <td className="py-3 px-4">
        <div className="text-sm text-foreground">
          {property.dateAdded}
        </div>
      </td>
    </tr>

    {/* Expanded Content */}
    {isExpanded && (
      <tr className="bg-muted/20">
        <td colSpan={8} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notes Section - Takes 2/3 of the space */}
            <div className="lg:col-span-2">
              <h4 className="font-medium text-sm mb-3">Notes</h4>
              
              {/* Add new note */}
              <div className="mb-4 space-y-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note..."
                  className="resize-none text-sm"
                  rows={3}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNote();
                  }}
                  disabled={!newNote.trim()}
                  className="text-xs"
                >
                  Add Note
                </Button>
              </div>

              {/* Existing notes */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {property.notes.length > 0 ? (
                  property.notes.map((note, index) => (
                    <div key={note.id} className="bg-background p-3 rounded-lg border">
                      <div className="text-sm text-foreground mb-1">{note.content}</div>
                      <div className="text-xs text-muted-foreground">{note.date}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No notes yet. Add one above!</div>
                )}
              </div>
            </div>

            {/* Property-specific Fields - Takes 1/3 of the space */}
            <div>
              {property.type === 'lease' && (
                <div>
                  <h4 className="font-medium text-sm mb-3">Lease Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Lease Commencement
                      </label>
                      <DatePicker
                        date={property.leaseCommencement}
                        onDateChange={(date) => onUpdate(property.id, { leaseCommencement: date })}
                        placeholder="Select date"
                      />
                    </div>
                  </div>
                </div>
              )}

              {property.type === 'sale' && (
                <div>
                  <h4 className="font-medium text-sm mb-3">Sale Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Seller Disclosure Deadline
                      </label>
                      <DatePicker
                        date={property.sellerDisclosureDeadline}
                        onDateChange={(date) => onUpdate(property.id, { sellerDisclosureDeadline: date })}
                        placeholder="Select deadline"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Due Diligence Deadline
                      </label>
                      <DatePicker
                        date={property.dueDiligenceDeadline}
                        onDateChange={(date) => onUpdate(property.id, { dueDiligenceDeadline: date })}
                        placeholder="Select deadline"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Closing Date
                      </label>
                      <DatePicker
                        date={property.closingDate}
                        onDateChange={(date) => onUpdate(property.id, { closingDate: date })}
                        placeholder="Select date"
                      />
                    </div>
                  </div>
                </div>
              )}

              {property.type === 'business' && (
                <div>
                  <h4 className="font-medium text-sm mb-3">Business Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Due Diligence Deadline
                      </label>
                      <DatePicker
                        date={property.dueDiligenceDeadline}
                        onDateChange={(date) => onUpdate(property.id, { dueDiligenceDeadline: date })}
                        placeholder="Select deadline"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Closing Date
                      </label>
                      <DatePicker
                        date={property.closingDate}
                        onDateChange={(date) => onUpdate(property.id, { closingDate: date })}
                        placeholder="Select date"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    )}
  </>
  );
}