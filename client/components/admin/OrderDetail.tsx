import { ArrowLeft, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrderDetailProps {
  order: {
    id: string;
    panierCode: string;
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
    };
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    total: number;
    status: "en attente" | "en cours" | "livré" | "annulé";
    createdAt: string;
    updatedAt: string;
  };
  onBack: () => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

export default function OrderDetail({
  order,
  onBack,
  onStatusChange,
}: OrderDetailProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(order.panierCode);
    setCopied(true);
    toast.success("Code copié!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (
    status: "en attente" | "en cours" | "livré" | "annulé",
  ) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-500";
      case "en cours":
        return "bg-blue-500";
      case "livré":
        return "bg-green-500";
      case "annulé":
        return "bg-red-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-accent hover:text-accent/80 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux commandes
      </button>

      {/* Main Detail Card */}
      <div className="bg-white rounded-lg border border-border p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-2">
                CODE PANIER
              </p>
              <p className="text-3xl font-futura font-bold text-accent break-all">
                {order.panierCode}
              </p>
            </div>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier
                </>
              )}
            </button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-2">
                STATUT ACTUEL
              </p>
              <div
                className={`px-6 py-2 rounded-lg font-semibold text-white text-sm ${getStatusColor(
                  order.status,
                )}`}
              >
                {order.status}
              </div>
            </div>

            {/* Status Change */}
            {order.status !== "livré" && order.status !== "annulé" && (
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-2">
                  CHANGER LE STATUT
                </p>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="en attente">En attente</option>
                  <option value="en cours">En cours</option>
                  <option value="livré">Livré</option>
                  <option value="annulé">Annulé</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3 className="text-2xl font-futura font-bold text-primary mb-6">
            Informations Client
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  NOM
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {order.customer.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  EMAIL
                </p>
                <p className="text-foreground break-all">
                  {order.customer.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  TÉLÉPHONE
                </p>
                <p className="text-foreground">{order.customer.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  ADRESSE
                </p>
                <p className="text-foreground">{order.customer.address}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  VILLE
                </p>
                <p className="text-foreground">{order.customer.city}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  CODE POSTAL
                </p>
                <p className="text-foreground">{order.customer.postalCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-2xl font-futura font-bold text-primary mb-6">
            Articles Commandés
          </h3>

          <div className="space-y-3 border border-border rounded-lg p-6 bg-secondary/50">
            {order.items.map((item, index) => (
              <div
                key={item.id}
                className="pb-3 border-b border-border last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                  </div>
                  <p className="text-sm bg-accent/10 text-accent font-semibold px-3 py-1 rounded-lg">
                    Quantité: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Metadata */}
        <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold">ID de commande:</span> {order.id}
          </p>
          <p>
            <span className="font-semibold">Date de création:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Dernière mise à jour:</span>{" "}
            {new Date(order.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
