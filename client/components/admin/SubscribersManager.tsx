import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/subscribers");
      const data = await res.json();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Supprimer l'abonné ${email} ?`)) return;
    try {
      await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
      setSubscribers((s) => s.filter((sub) => sub.id !== id));
      toast.success("Abonné supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const exportCSV = () => {
    const rows = [
      ["Email", "Date d'inscription"],
      ...subscribers.map((s) => [
        s.email,
        new Date(s.created_at).toLocaleDateString("fr-FR"),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "abonnes_newsletter.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b-2 border-secondary">
        <div>
          <h2 className="text-3xl font-futura font-bold text-foreground">
            Newsletter
          </h2>
          <p className="text-muted-foreground font-roboto mt-1">
            {subscribers.length} abonné{subscribers.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={exportCSV}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total abonnés",
            value: subscribers.length,
            color: "text-accent",
          },
          {
            label: "Ce mois",
            value: subscribers.filter((s) => {
              const d = new Date(s.created_at);
              const now = new Date();
              return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
              );
            }).length,
            color: "text-blue-600",
          },
          {
            label: "Cette semaine",
            value: subscribers.filter((s) => {
              const d = new Date(s.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return d >= weekAgo;
            }).length,
            color: "text-green-600",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="pt-5 pb-5 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-roboto">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Rechercher par email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2 border-2 border-border rounded-lg text-sm font-roboto focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      />

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-0 pb-0">
          {loading ? (
            <p className="text-center py-12 text-muted-foreground">
              Chargement...
            </p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-muted-foreground font-roboto">
                {search ? "Aucun résultat" : "Aucun abonné pour l'instant"}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-secondary">
                  <th className="text-left py-4 px-4 font-semibold text-foreground font-roboto">
                    #
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground font-roboto">
                    Email
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground font-roboto">
                    Date d'inscription
                  </th>
                  <th className="py-4 px-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, i) => (
                  <tr
                    key={sub.id}
                    className="border-b border-secondary/50 last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-muted-foreground font-roboto">
                      {i + 1}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {sub.email}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-roboto">
                      {new Date(sub.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id, sub.email)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
