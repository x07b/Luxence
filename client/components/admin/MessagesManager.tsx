import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MailOpen, Reply, Inbox } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read";
  timestamp: string;
}

type Filter = "all" | "new" | "read";

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact/messages");
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    await fetch(`/api/contact/messages/${id}/read`, { method: "PUT" });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "read" } : m)),
    );
    setSelected((s) => (s?.id === id ? { ...s, status: "read" } : s));
  };

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (msg.status === "new") await markAsRead(msg.id);
  };

  const filtered = messages.filter(
    (m) => filter === "all" || m.status === filter,
  );
  const unreadCount = messages.filter((m) => m.status === "new").length;

  const filterLabels: Record<Filter, string> = {
    all: "Tous",
    new: "Non lus",
    read: "Lus",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b-2 border-secondary">
        <div>
          <h2 className="text-3xl font-futura font-bold text-foreground">
            Messages
          </h2>
          <p className="text-muted-foreground font-roboto mt-1">
            {messages.length} message{messages.length > 1 ? "s" : ""} ·{" "}
            <span className={unreadCount > 0 ? "text-accent font-semibold" : ""}>
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "new", "read"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-accent text-white shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/70"
            }`}
          >
            {filterLabels[f]}
            {f === "new" && unreadCount > 0 && (
              <span className="ml-2 bg-white/30 text-xs rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Message List */}
        <div className="lg:col-span-2 space-y-2">
          {loading && (
            <p className="text-center py-12 text-muted-foreground">
              Chargement...
            </p>
          )}

          {!loading && filtered.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <Inbox className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground font-roboto">
                  Aucun message
                </p>
              </CardContent>
            </Card>
          )}

          {filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => openMessage(msg)}
              className={`cursor-pointer rounded-lg border bg-white p-4 transition-all hover:shadow-md ${
                selected?.id === msg.id
                  ? "ring-2 ring-accent border-accent/30"
                  : "border-border"
              } ${msg.status === "new" ? "border-l-4 border-l-accent" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {msg.status === "new" ? (
                      <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <p
                      className={`font-semibold truncate text-sm ${
                        msg.status === "new"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {msg.name}
                    </p>
                  </div>
                  <p className="text-sm font-medium truncate">{msg.subject}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {msg.message}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                  {new Date(msg.timestamp).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <Card className="sticky top-4 border-0 shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl font-futura truncate">
                      {selected.subject}
                    </CardTitle>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        {selected.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selected.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selected.timestamp).toLocaleString("fr-FR", {
                          dateStyle: "long",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors flex-shrink-0"
                  >
                    <Reply className="w-4 h-4" />
                    Répondre
                  </a>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-secondary/30 rounded-lg p-5">
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-roboto">
                    {selected.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl text-muted-foreground gap-3">
              <Mail className="w-10 h-10 opacity-20" />
              <p className="text-sm font-roboto">
                Sélectionnez un message pour le lire
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
