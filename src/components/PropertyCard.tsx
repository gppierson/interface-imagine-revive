import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MapPin, Edit3, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  content: string;
  date: string;
}

interface PropertyCardProps {
  property: {
    id: string;
    address: string;
    type: "sale" | "lease" | "business";
    status: "listed" | "pending" | "sold" | "withdrawn";
    nickname?: string;
    notes: Note[];
  };
  onUpdateProperty: (id: string, updates: Partial<PropertyCardProps['property']>) => void;
}

export function PropertyCard({ property, onUpdateProperty }: PropertyCardProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameValue, setNicknameValue] = useState(property.nickname || "");

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        date: new Date().toLocaleDateString()
      };
      onUpdateProperty(property.id, {
        notes: [...property.notes, note]
      });
      setNewNote("");
      setIsAddingNote(false);
    }
  };

  const handleNicknameUpdate = () => {
    onUpdateProperty(property.id, { nickname: nicknameValue });
    setIsEditingNickname(false);
  };

  const statusColors = {
    listed: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20", 
    sold: "bg-muted text-muted-foreground border-border",
    withdrawn: "bg-destructive/10 text-destructive border-destructive/20"
  };

  const typeLabels = {
    sale: "For Sale",
    lease: "For Lease", 
    business: "Business"
  };

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 animate-fade-in bg-gradient-card border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <Badge 
            variant="secondary" 
            className={cn("text-xs font-medium", 
              property.type === 'sale' && "bg-primary/10 text-primary border-primary/20",
              property.type === 'lease' && "bg-accent/10 text-accent-foreground border-accent/20",
              property.type === 'business' && "bg-estate-red/10 text-estate-red border-estate-red/20"
            )}
          >
            {typeLabels[property.type]}
          </Badge>
          
          <Badge 
            variant="outline" 
            className={cn("text-xs font-medium", statusColors[property.status])}
          >
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-foreground">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <h3 className="font-semibold text-base leading-tight">{property.address}</h3>
        </div>

        <div className="flex items-center gap-2">
          {isEditingNickname ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={nicknameValue}
                onChange={(e) => setNicknameValue(e.target.value)}
                placeholder="Add nickname..."
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNicknameUpdate();
                  if (e.key === 'Escape') {
                    setIsEditingNickname(false);
                    setNicknameValue(property.nickname || "");
                  }
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleNicknameUpdate} className="h-8 px-3">
                Save
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingNickname(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group/nickname"
            >
              <Edit3 className="w-3 h-3" />
              <span>{property.nickname || "Add nickname..."}</span>
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <Select
            value={property.status}
            onValueChange={(value) => onUpdateProperty(property.id, { status: value as any })}
          >
            <SelectTrigger className="h-9">
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddingNote(true)}
              className="h-8 px-3"
            >
              <Plus className="w-3 h-3" />
              Add Note
            </Button>
          </div>

          <div className="space-y-2 max-h-32 overflow-y-auto">
            {property.notes.map((note) => (
              <div key={note.id} className="p-3 bg-muted/30 rounded-md border">
                <p className="text-sm text-foreground mb-1">{note.content}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {note.date}
                </div>
              </div>
            ))}
          </div>

          {isAddingNote && (
            <div className="space-y-2 animate-slide-up">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="min-h-20 resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddNote}>
                  Add Note
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}