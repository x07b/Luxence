import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Image,
  Mail,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ProductsManager from "../components/admin/ProductsManager";
import CollectionsManager from "../components/admin/CollectionsManager";
import OrdersManager from "../components/admin/OrdersManager";
import AdminDashboard from "../components/admin/AdminDashboard";
import HeroSlidesManager from "../components/admin/HeroSlidesManager";
import MessagesManager from "../components/admin/MessagesManager";
import SubscribersManager from "../components/admin/SubscribersManager";

const VALID_TABS = ["dashboard", "orders", "products", "collections", "hero-slides", "messages", "subscribers"] as const;
type Tab = (typeof VALID_TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  dashboard: "Tableau de bord",
  orders: "Commandes",
  products: "Produits",
  collections: "Collections",
  "hero-slides": "Diapositives Hero",
  messages: "Messages",
  subscribers: "Newsletter",
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const badgeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (localStorage.getItem("admin-auth")) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.substring(1) as Tab;
      if (VALID_TABS.includes(hash)) setActiveTab(hash);
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBadgeCounts();
    badgeIntervalRef.current = setInterval(fetchBadgeCounts, 30000);
    return () => { if (badgeIntervalRef.current) clearInterval(badgeIntervalRef.current); };
  }, [isAuthenticated]);

  const fetchBadgeCounts = async () => {
    try {
      const [ordersRes, msgsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/contact/messages"),
      ]);
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        const pending = (data.orders || []).filter((o: any) => o.status === "en attente").length;
        if (pendingCount > 0 && pending > pendingCount) {
          toast.success(`🎉 ${pending - pendingCount} nouvelle(s) commande(s)!`, { duration: 5000 });
        }
        setPendingCount(pending);
      }
      if (msgsRes.ok) {
        const msgs = await msgsRes.json();
        setUnreadCount(msgs.filter((m: any) => m.status === "new").length);
      }
    } catch {/* silent */}
  };

  const handleLogin = () => {
    if (inputPassword === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin-auth", "true");
      setLoginError("");
      setInputPassword("");
    } else {
      setLoginError("Mot de passe invalide");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin-auth");
  };

  const navigate = (tab: Tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/assets/white-logo.svg" alt="Luxence" className="h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-futura font-bold text-white">Espace Administrateur</h1>
            <p className="text-slate-400 text-sm mt-2 font-roboto">Accès réservé au personnel autorisé</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 font-roboto">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={inputPassword}
                onChange={(e) => { setInputPassword(e.target.value); setLoginError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-roboto"
              />
              {loginError && <p className="text-red-400 text-sm mt-2 font-roboto">{loginError}</p>}
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-futura font-bold rounded-lg transition-colors"
            >
              Se connecter
            </button>
            <Link to="/" className="block text-center text-sm text-slate-400 hover:text-white transition-colors font-roboto">
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems: { tab: Tab; icon: React.ReactNode; badge?: number }[] = [
    { tab: "dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { tab: "orders", icon: <ShoppingCart className="w-5 h-5" />, badge: pendingCount },
    { tab: "products", icon: <Package className="w-5 h-5" /> },
    { tab: "collections", icon: <FolderOpen className="w-5 h-5" /> },
    { tab: "hero-slides", icon: <Image className="w-5 h-5" /> },
    { tab: "messages", icon: <Mail className="w-5 h-5" />, badge: unreadCount },
    { tab: "subscribers", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-[72px]"}`}>
        {/* Logo */}
        <div className={`border-b border-slate-700/60 flex items-center ${isSidebarOpen ? "px-5 py-5" : "justify-center py-5"}`}>
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src="/assets/white-logo.svg" alt="Luxence" className="h-8 object-contain" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ tab, icon, badge }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => navigate(tab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? "bg-accent text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
                title={!isSidebarOpen ? TAB_LABELS[tab] : undefined}
              >
                <span className="flex-shrink-0">{icon}</span>
                {isSidebarOpen && (
                  <>
                    <span className="text-sm font-roboto font-medium flex-1 text-left truncate">
                      {TAB_LABELS[tab]}
                    </span>
                    {badge != null && badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                        {badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />}
                  </>
                )}
                {/* Collapsed badge */}
                {!isSidebarOpen && badge != null && badge > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 py-4 border-t border-slate-700/60">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            title={isSidebarOpen ? "Réduire" : "Agrandir"}
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="px-6 py-3.5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-futura font-bold text-foreground">
                {TAB_LABELS[activeTab]}
              </h1>
              <p className="text-xs text-muted-foreground font-roboto mt-0.5">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {pendingCount > 0 && (
                <button
                  onClick={() => navigate("orders")}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  {pendingCount} commande{pendingCount > 1 ? "s" : ""} en attente
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-roboto"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-screen-2xl">
            <Tabs value={activeTab} onValueChange={(v) => navigate(v as Tab)} className="w-full">
              <TabsContent value="dashboard"><AdminDashboard /></TabsContent>
              <TabsContent value="orders"><OrdersManager /></TabsContent>
              <TabsContent value="products"><ProductsManager /></TabsContent>
              <TabsContent value="collections"><CollectionsManager /></TabsContent>
              <TabsContent value="hero-slides"><HeroSlidesManager /></TabsContent>
              <TabsContent value="messages"><MessagesManager /></TabsContent>
              <TabsContent value="subscribers"><SubscribersManager /></TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
