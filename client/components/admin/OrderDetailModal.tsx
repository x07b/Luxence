import { X } from "lucide-react";

interface OrderDetailModalProps {
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
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: OrderDetailModalProps) {
  const getStatusColor = (
    status: "en attente" | "en cours" | "livré" | "annulé",
  ) => {
    switch (status) {
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "livré":
        return "bg-green-100 text-green-800";
      case "annulé":
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusDotColor = (
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

  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-accent/80 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/80 font-semibold uppercase tracking-wide mb-1">
              Commande
            </p>
            <p className="text-xl font-futura font-bold truncate">
              {order.panierCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Status Section */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Statut
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status,
                  )}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${getStatusDotColor(order.status)}`}
                  />
                  {order.status}
                </span>

                {order.status !== "livré" && order.status !== "annulé" && (
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                  >
                    <option value="en attente">En attente</option>
                    <option value="en cours">En cours</option>
                    <option value="livré">Livré</option>
                    <option value="annulé">Annulé</option>
                  </select>
                )}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div>
                <p className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 pb-3 border-b border-border">
                  Informations Client
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Nom</p>
                    <p className="font-medium text-foreground">
                      {order.customer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Email</p>
                    <p className="font-medium text-foreground break-words">
                      {order.customer.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Téléphone</p>
                    <p className="font-medium text-foreground">
                      {order.customer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Ville</p>
                    <p className="font-medium text-foreground">
                      {order.customer.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <p className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 pb-3 border-b border-border">
                  Adresse
                </p>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-foreground">
                    {order.customer.address}
                  </p>
                  <p className="font-medium text-foreground">
                    {order.customer.postalCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <p className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 pb-3 border-b border-border">
                Articles ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3 bg-secondary/60 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm flex-shrink-0">
                      <span className="text-muted-foreground">Qty:</span>
                      <span className="font-semibold text-foreground w-8 text-center">
                        {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Quantity */}
            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground uppercase">
                  Qty Total
                </p>
                <p className="text-2xl font-futura font-bold text-accent">
                  {totalQty}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="text-xs space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Créée:</span>
                <span className="font-medium text-foreground">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mise à jour:</span>
                <span className="font-medium text-foreground">
                  {new Date(order.updatedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
