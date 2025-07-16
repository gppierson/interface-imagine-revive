import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Phone, Mail, Building2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Client, ClientStatus, ClientNote } from "@/pages/Clients";

interface ClientRowProps {
  client: Client;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
  onAddNote: (clientId: string, noteText: string) => void;
}

const statusConfig: Record<ClientStatus, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
  "New Lead": { variant: "default", className: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  "Looking": { variant: "default", className: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  "Negotiating": { variant: "default", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
  "On Hold": { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-200" },
  "Done": { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-200" },
  "Lost": { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-200" }
};

const statusOptions: ClientStatus[] = ["New Lead", "Looking", "Negotiating", "On Hold", "Done", "Lost"];

export const ClientRow = ({ client, onUpdateClient, onAddNote }: ClientRowProps) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);

  const handleStatusChange = (newStatus: ClientStatus) => {
    onUpdateClient(client.id, { status: newStatus });
    setIsEditingStatus(false);
  };

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      onAddNote(client.id, newNoteText.trim());
      setNewNoteText("");
      setShowAddNote(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <tr className="border-b border-border hover:bg-muted/25 transition-all duration-200 table-row-hover">
      {/* Client Info */}
      <td className="py-3 px-4 min-w-0">
        <div className="space-y-1">
          <div className="font-medium text-sm text-foreground">{client.name}</div>
          {client.company && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="w-3 h-3" />
              {client.company}
            </div>
          )}
        </div>
      </td>

      {/* Contact Info */}
      <td className="py-3 px-4 min-w-0">
        <div className="space-y-1">
          {client.phone && (
            <a 
              href={`tel:${client.phone}`}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Phone className="w-3 h-3" />
              {client.phone}
            </a>
          )}
          {client.email && (
            <a 
              href={`mailto:${client.email}`}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Mail className="w-3 h-3" />
              {client.email}
            </a>
          )}
        </div>
      </td>

      {/* Looking For */}
      <td className="py-3 px-4 min-w-0">
        <div className="text-sm text-foreground max-w-xs">
          {client.looking_for}
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        {isEditingStatus ? (
          <select
            value={client.status}
            onChange={(e) => handleStatusChange(e.target.value as ClientStatus)}
            onBlur={() => setIsEditingStatus(false)}
            className="text-xs px-2 py-1 border border-border rounded-md bg-background"
            autoFocus
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ) : (
          <Badge
            variant={statusConfig[client.status].variant}
            className={cn("cursor-pointer text-xs shadow-sm hover:shadow-md transition-all duration-200", statusConfig[client.status].className)}
            onClick={() => setIsEditingStatus(true)}
          >
            {client.status}
          </Badge>
        )}
      </td>

      {/* Notes */}
      <td className="py-3 px-4 min-w-0">
        <div className="space-y-2 max-w-sm">
          {client.notes.length > 0 ? (
            client.notes.slice(0, 2).map((note) => (
              <div key={note.id} className="bg-background p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-sm text-foreground mb-2 leading-relaxed">{note.note_text}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="status-dot">{formatDate(note.created_at)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground text-center py-8 animate-fade-in">📝 No notes yet.</div>
          )}
          
          {client.notes.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{client.notes.length - 2} more notes
            </div>
          )}

          {showAddNote ? (
            <div className="space-y-2">
              <Textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a note..."
                className="resize-none text-sm"
                rows={3}
                autoFocus
              />
              <Button 
                size="sm" 
                onClick={handleAddNote}
                disabled={!newNoteText.trim()}
                className="text-xs shadow-sm hover:shadow-md transition-all duration-200"
              >
                Add Note
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddNote(true)}
              className="h-8 w-8 p-0 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </td>

      {/* Updated Date */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDate(client.updated_at)}
        </div>
      </td>
    </tr>
  );
};