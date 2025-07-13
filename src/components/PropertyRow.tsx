import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

interface PropertyRowProps {
  property: Property;
  onUpdate: (id: string, updates: Partial<Property>) => void;
}

export function PropertyRow({ property, onUpdate }: PropertyRowProps) {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameValue, setNicknameValue] = useState(property.nickname || "");

  const handleNicknameUpdate = () => {
    onUpdate(property.id, { nickname: nicknameValue });
    setIsEditingNickname(false);
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

  return (
    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
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
              onClick={() => setIsEditingNickname(true)}
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
            <SelectTrigger className="h-8 w-28 text-xs border-0 bg-transparent hover:bg-muted/50">
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

      {/* Notes */}
      <td className="py-3 px-4 min-w-0">
        <div className="space-y-1 max-w-xs">
          {property.notes.length > 0 ? (
            property.notes.map((note, index) => (
              <div key={note.id} className="text-xs">
                <div className="text-foreground">{note.content}</div>
                <div className="text-muted-foreground">{note.date}</div>
                {index < property.notes.length - 1 && <div className="border-b border-border/30 my-1"></div>}
              </div>
            ))
          ) : (
            <span className="text-muted-foreground text-xs">No notes</span>
          )}
        </div>
      </td>
    </tr>
  );
}