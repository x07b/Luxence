import { FileText, Mail } from "lucide-react";
import { toast } from "sonner";

interface ProductTitleStickyProps {
  name: string;
  category: string;
  pdfFile?: string;
  pdfFilename?: string;
  onDownloadPDF?: () => void;
  onRequestQuote?: () => void;
}

export function ProductTitleSticky({
  name,
  category,
  pdfFile,
  pdfFilename,
  onDownloadPDF,
  onRequestQuote,
}: ProductTitleStickyProps) {
  const handleDownloadPDF = () => {
    if (onDownloadPDF) {
      onDownloadPDF();
      return;
    }

    if (!pdfFile) {
      toast.error("Aucun fichier PDF disponible pour ce produit");
      return;
    }

    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = pdfFilename || "fiche-technique.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRequestQuote = () => {
    if (onRequestQuote) {
      onRequestQuote();
      return;
    }

    toast.success(`Demande de devis pour ${name} envoyée!`);
  };

  return (
    <aside className="fixed right-0 top-20 w-80 h-auto z-30 hidden lg:block pr-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-border p-6 space-y-4 sticky top-20">
        {/* Category */}
        <div>
          <p className="text-accent font-roboto text-xs uppercase tracking-widest font-bold">
            {category}
          </p>
        </div>

        {/* Title */}
        <h2 className="font-futura text-2xl font-bold text-foreground leading-snug line-clamp-4">
          {name}
        </h2>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-accent/50 to-transparent" />

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Request Quote Button - Primary */}
          <button
            onClick={handleRequestQuote}
            className="w-full bg-accent hover:bg-accent/90 text-white font-roboto font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            <Mail className="w-5 h-5" />
            Demande de devis
          </button>

          {/* Download PDF - Secondary */}
          {pdfFile && (
            <button
              onClick={handleDownloadPDF}
              className="w-full border-2 border-foreground text-foreground hover:bg-foreground hover:text-white font-roboto font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <FileText className="w-5 h-5" />
              Télécharger fiche technique
            </button>
          )}
        </div>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Demandez un devis gratuit et sans engagement
        </p>
      </div>
    </aside>
  );
}
