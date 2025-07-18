import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CompactHeader } from "@/components/CompactHeader";
import { 
  Upload, 
  FileText, 
  Send, 
  Mic, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  Lightbulb,
  Download,
  Share,
  Save,
  Bot,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function DealIntelligence() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryCollapsed, setSummaryCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const suggestedQuestions = [
    "What are the key deadlines I need to track?",
    "Explain the seller rent-back terms",
    "What happens if the buyer's financing falls through?",
    "Is the earnest money amount typical?",
    "What are the contingencies in this offer?"
  ];

  const mockSummary = {
    property: "123 Main St, Salt Lake City, UT 84101",
    purchasePrice: "$475,000",
    earnestMoney: "$5,000 (1.05%)",
    closingDate: "March 15, 2025",
    financing: "Conventional loan, 20% down",
    inspectionPeriod: "10 days",
    appraisalContingency: "Yes, $475,000",
    sellerRentBack: "30 days at $150/day"
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowSummary(true);
    }, 3000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0] && files[0].type === 'application/pdf') {
      handleFileUpload(files[0]);
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: "The $5,000 earnest money represents 1.05% of the purchase price. In Utah, typical earnest money ranges from 1-2%, so this is on the lower end but still within normal range. For a competitive market, you might consider a higher amount to strengthen your offer...",
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage, aiResponse]);
    setCurrentMessage("");
  };

  const handleSuggestedQuestion = (question: string) => {
    setCurrentMessage(question);
  };

  return (
    <div className="min-h-screen bg-background">
      <CompactHeader 
        propertyType="all"
        onPropertyTypeChange={() => {}}
        statusFilter="all"
        onStatusFilterChange={() => {}}
        sortBy="address"
        onSortChange={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        counts={{ sale: 0, lease: 0, business: 0, total: 0 }}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-foreground">Deal Intelligence</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            AI-Powered Real Estate Contract Analysis & Chat Assistant
          </p>
        </div>

        {!uploadedFile && (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                  isDragOver ? "border-teal-500 bg-teal-50" : "border-muted-foreground/25"
                )}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Upload Real Estate Contract</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your PDF contract here, or click to browse
                </p>
                <Button 
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {isAnalyzing && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="animate-spin w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full" />
                <span className="text-lg font-medium">Analyzing contract...</span>
              </div>
              <p className="text-muted-foreground">
                AI is reviewing your contract and extracting key terms
              </p>
            </CardContent>
          </Card>
        )}

        {showSummary && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  OFFER INTELLIGENCE - {mockSummary.property}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Collapsible open={!summaryCollapsed} onOpenChange={(open) => setSummaryCollapsed(!open)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {summaryCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </div>
              </div>
            </CardHeader>
            
            <Collapsible open={!summaryCollapsed} onOpenChange={(open) => setSummaryCollapsed(!open)}>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-sm text-muted-foreground">Purchase Price</span>
                        <p className="text-lg font-bold text-green-600">{mockSummary.purchasePrice}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-muted-foreground">Earnest Money</span>
                        <p className="font-medium">{mockSummary.earnestMoney}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-muted-foreground">Closing Date</span>
                        <p className="font-medium">{mockSummary.closingDate}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-muted-foreground">Financing</span>
                        <p className="font-medium">{mockSummary.financing}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-sm text-muted-foreground">Inspection Period</span>
                        <p className="font-medium">{mockSummary.inspectionPeriod}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-muted-foreground">Appraisal Contingency</span>
                        <p className="font-medium">{mockSummary.appraisalContingency}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-muted-foreground">Seller Rent-Back</span>
                        <p className="font-medium">{mockSummary.sellerRentBack}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>

            <CardContent className="pt-0">
              <Separator className="mb-6" />
              
              {/* Suggested Questions */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-semibold text-sm">SUGGESTED QUESTIONS</h3>
                </div>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      <span className="text-xs">• {question}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Chat Interface */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">CONVERSATION</h3>
                <div className="border rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto bg-muted/20">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="w-8 h-8 mx-auto mb-2 text-teal-600" />
                      <p>Start a conversation about your contract analysis</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className={cn("flex gap-3", message.type === 'user' ? "justify-end" : "justify-start")}>
                          <div className={cn("flex gap-2 max-w-[80%]", message.type === 'user' ? "flex-row-reverse" : "flex-row")}>
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-sm", 
                              message.type === 'user' ? "bg-crest-red" : "bg-teal-600")}>
                              {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={cn("p-3 rounded-lg", 
                              message.type === 'user' ? "bg-crest-red text-white" : "bg-white border")}>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* AI Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <strong>AI Assistant Notice:</strong> This guidance is based on AI analysis and should not replace professional advice. Always consult with your broker or attorney for critical decisions.
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your question..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={!currentMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}