import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Package, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  totalOrders: number;
  uniqueCustomers: number;
  totalProducts: number;
  visitorStats: {
    uniqueVisitors: number;
    todayVisitors: number;
    last7Days: number;
    last30Days: number;
  };
  ordersbyStatus: {
    enAttente: number;
    enCours: number;
    livre: number;
    annule: number;
  };
  recentOrders: Array<{
    panierCode: string;
    customerName: string;
    status: string;
    date: string;
    itemCount: number;
  }>;
  orderTrend: Array<{ label: string; orders: number }>;
}

interface TrendPoint {
  date: string;
  label: string;
  visitors: number;
}

const STATUS_COLORS: Record<string, string> = {
  "en attente": "bg-yellow-100 text-yellow-800",
  "en cours": "bg-blue-100 text-blue-800",
  "livré": "bg-green-100 text-green-800",
  "annulé": "bg-red-100 text-red-800",
};

function TrendBadge({ value }: { value: number }) {
  if (value === 0) return <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Minus className="w-3 h-3" /> Stable</span>;
  if (value > 0) return <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium"><TrendingUp className="w-3 h-3" />+{value}%</span>;
  return <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium"><TrendingDown className="w-3 h-3" />{value}%</span>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    uniqueCustomers: 0,
    totalProducts: 0,
    visitorStats: { uniqueVisitors: 0, todayVisitors: 0, last7Days: 0, last30Days: 0 },
    ordersbyStatus: { enAttente: 0, enCours: 0, livre: 0, annule: 0 },
    recentOrders: [],
    orderTrend: [],
  });
  const [visitorTrend, setVisitorTrend] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const previousOrderCountRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const fetchAll = async () => {
    try {
      const [ordersRes, productsRes, visitorsRes, trendRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
        fetch("/api/analytics/visitors"),
        fetch("/api/analytics/trend"),
      ]);

      const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
      const productsData = productsRes.ok ? await productsRes.json() : [];
      const visitorsData = visitorsRes.ok ? await visitorsRes.json() : {};
      const trendData: TrendPoint[] = trendRes.ok ? await trendRes.json() : [];

      const orders = ordersData.orders || [];

      const ordersbyStatus = {
        enAttente: orders.filter((o: any) => o.status === "en attente").length,
        enCours: orders.filter((o: any) => o.status === "en cours").length,
        livre: orders.filter((o: any) => o.status === "livré").length,
        annule: orders.filter((o: any) => o.status === "annulé").length,
      };

      // Build order trend (last 14 days)
      const orderTrend = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        d.setHours(0, 0, 0, 0);
        const next = new Date(d);
        next.setDate(next.getDate() + 1);
        const count = orders.filter((o: any) => {
          const t = new Date(o.createdAt);
          return t >= d && t < next;
        }).length;
        return {
          label: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
          orders: count,
        };
      });

      setVisitorTrend(trendData);

      const currentPending = ordersbyStatus.enAttente;
      if (previousOrderCountRef.current > 0 && currentPending > previousOrderCountRef.current) {
        toast.success(`🎉 ${currentPending - previousOrderCountRef.current} nouvelle(s) commande(s) en attente!`, {
          description: `Total: ${currentPending} en attente`,
          duration: 5000,
        });
      }
      previousOrderCountRef.current = currentPending;

      setStats({
        totalOrders: orders.length,
        uniqueCustomers: new Set(orders.map((o: any) => o.customer.email)).size,
        totalProducts: (productsData || []).length,
        visitorStats: visitorsData,
        ordersbyStatus,
        recentOrders: [...orders].reverse().slice(0, 5).map((o: any) => ({
          panierCode: o.panierCode,
          customerName: o.customer.name,
          status: o.status,
          date: new Date(o.createdAt).toLocaleDateString("fr-FR"),
          itemCount: o.items?.length ?? 0,
        })),
        orderTrend,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-roboto text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: "En attente", value: stats.ordersbyStatus.enAttente, color: "#eab308" },
    { name: "En cours", value: stats.ordersbyStatus.enCours, color: "#3b82f6" },
    { name: "Livré", value: stats.ordersbyStatus.livre, color: "#22c55e" },
    { name: "Annulé", value: stats.ordersbyStatus.annule, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  // Visitor trend: compare last 7d vs previous 7d
  const last7 = visitorTrend.slice(-7).reduce((s, d) => s + d.visitors, 0);
  const prev7 = visitorTrend.slice(-14, -7).reduce((s, d) => s + d.visitors, 0);
  const visitorTrendPct = prev7 === 0 ? 0 : Math.round(((last7 - prev7) / prev7) * 100);

  const kpiCards = [
    {
      label: "Commandes",
      value: stats.totalOrders,
      sub: stats.ordersbyStatus.enAttente > 0
        ? `${stats.ordersbyStatus.enAttente} en attente`
        : "Toutes traitées",
      color: "from-orange-50 to-white",
      iconBg: "bg-accent/15",
      icon: <ShoppingCart className="h-5 w-5 text-accent" />,
      valueColor: "text-accent",
    },
    {
      label: "Clients uniques",
      value: stats.uniqueCustomers,
      sub: stats.totalOrders > 0
        ? `${((stats.uniqueCustomers / stats.totalOrders) * 100).toFixed(0)}% taux unique`
        : "Aucun client",
      color: "from-blue-50 to-white",
      iconBg: "bg-blue-500/15",
      icon: <Users className="h-5 w-5 text-blue-600" />,
      valueColor: "text-blue-600",
    },
    {
      label: "Catalogue",
      value: stats.totalProducts,
      sub: "Produits actifs",
      color: "from-purple-50 to-white",
      iconBg: "bg-purple-500/15",
      icon: <Package className="h-5 w-5 text-purple-600" />,
      valueColor: "text-purple-600",
    },
    {
      label: "Visiteurs uniques",
      value: stats.visitorStats?.uniqueVisitors ?? 0,
      sub: stats.visitorStats?.todayVisitors > 0
        ? `${stats.visitorStats.todayVisitors} aujourd'hui`
        : "Aucun aujourd'hui",
      color: "from-green-50 to-white",
      iconBg: "bg-green-500/15",
      icon: <Eye className="h-5 w-5 text-green-600" />,
      valueColor: "text-green-600",
      trend: visitorTrendPct,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b-2 border-secondary">
        <h2 className="text-3xl font-futura font-bold text-foreground">Tableau de Bord</h2>
        <p className="text-muted-foreground font-roboto mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <Card key={card.label} className={`border-0 bg-gradient-to-br ${card.color} shadow-sm hover:shadow-md transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.iconBg}`}>{card.icon}</div>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${card.valueColor} mb-1`}>{card.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-roboto">{card.sub}</p>
                {"trend" in card && <TrendBadge value={card.trend!} />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row 1: Visitor trend + Order trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 border-b border-secondary">
            <CardTitle className="text-base font-futura font-bold">Visiteurs — 30 derniers jours</CardTitle>
            <p className="text-xs text-muted-foreground">Visiteurs uniques par jour</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={4} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    formatter={(v: number) => [v, "Visiteurs"]}
                  />
                  <Area type="monotone" dataKey="visitors" stroke="#22c55e" strokeWidth={2} fill="url(#visitorGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 border-b border-secondary">
            <CardTitle className="text-base font-futura font-bold">Commandes — 14 derniers jours</CardTitle>
            <p className="text-xs text-muted-foreground">Nouvelles commandes par jour</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.orderTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={1} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    formatter={(v: number) => [v, "Commandes"]}
                  />
                  <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2: Pie + Status bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 border-b border-secondary">
            <CardTitle className="text-base font-futura font-bold">Répartition des statuts</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {pieData.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
                Aucune commande
              </div>
            ) : (
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                      dataKey="value" label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 border-b border-secondary">
            <CardTitle className="text-base font-futura font-bold">Détail par statut</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {[
              { name: "En attente", value: stats.ordersbyStatus.enAttente, color: "#eab308" },
              { name: "En cours", value: stats.ordersbyStatus.enCours, color: "#3b82f6" },
              { name: "Livré", value: stats.ordersbyStatus.livre, color: "#22c55e" },
              { name: "Annulé", value: stats.ordersbyStatus.annule, color: "#ef4444" },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-sm text-muted-foreground font-roboto w-24">{s.name}</span>
                <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${(s.value / Math.max(1, stats.totalOrders)) * 100}%`,
                      backgroundColor: s.color,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-foreground w-6 text-right">{s.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 border-b border-secondary">
          <CardTitle className="text-base font-futura font-bold">Commandes récentes</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">5 dernières commandes reçues</p>
        </CardHeader>
        <CardContent className="pt-0">
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground font-roboto">Aucune commande</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-secondary">
                    {["Client", "Code panier", "Articles", "Date", "Statut"].map((h) => (
                      <th key={h} className={`py-4 px-4 font-semibold text-foreground font-roboto ${h === "Statut" || h === "Articles" ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order, i) => (
                    <tr key={i} className="border-b border-secondary/50 last:border-0 hover:bg-accent/5 transition-colors">
                      <td className="py-3.5 px-4 font-medium font-roboto">{order.customerName}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-secondary/60 text-xs font-mono px-2 py-1 rounded">
                          {order.panierCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-muted-foreground">{order.itemCount}</td>
                      <td className="py-3.5 px-4 text-muted-foreground font-roboto">{order.date}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-800"}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
