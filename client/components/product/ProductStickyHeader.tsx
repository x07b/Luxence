import { FileText, Mail } from "lucide-react";
import { toast } from "sonner";

interface ProductStickyHeaderProps {
  category: string;
  name: string;
  description: string;
  pdfFile?: string;
  pdfFilename?: string;
}

export function ProductStickyHeader({
  category,
  name,
  description,
  pdfFile,
  pdfFilename,
}: ProductStickyHeaderProps) {
  const handleRequestQuote = () => {
    toast.success(`Demande de devis pour ${name} envoyée!`);
  };

  const handleDownloadPDF = () => {
    if (!pdfFile) {
      toast.error("Fiche technique non disponible");
      return;
    }

    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = pdfFilename || "fiche-technique.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left: Title and Description */}
          <div className="flex-1 min-w-0">
            <p className="font-roboto text-sm uppercase tracking-widest text-accent font-bold mb-2">
              {category}
            </p>
            <h1 className="font-futura text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
              {name}
            </h1>
            <p className="font-roboto text-base text-muted-foreground line-clamp-2 max-w-md">
              {description}
            </p>
          </div>

          {/* Right: Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleRequestQuote}
              className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-roboto font-bold py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 whitespace-nowrap"
            >
              <Mail className="w-5 h-5" />
              <span className="hidden sm:inline">Demande de devis</span>
              <span className="sm:hidden">Devis</span>
            </button>
            {pdfFile && (
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-2 border-2 border-foreground text-foreground hover:bg-foreground hover:text-white font-roboto font-bold py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 whitespace-nowrap"
              >
                <FileText className="w-5 h-5" />
                <span className="hidden sm:inline">Fiche technique</span>
                <span className="sm:hidden">Fiche</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
