import { supabase } from "../lib/supabase.js";

export async function trackVisitor(req: any, res: any) {
  try {
    // Get client IP safely - handle different header formats
    let clientIp = "unknown";
    const xff = req.headers["x-forwarded-for"];
    if (xff) {
      // x-forwarded-for can be a string or array
      const ips = Array.isArray(xff) ? xff : (xff as string).split(",");
      clientIp = (ips[0] || "").trim();
    }
    if (!clientIp || clientIp === "unknown") {
      clientIp = req.socket.remoteAddress || "unknown";
    }

    const timestamp = new Date().toISOString();
    const userAgent = req.headers["user-agent"] || "unknown";

    // Insert visitor record
    const { error } = await supabase.from("visitors").insert({
      ip_address: clientIp,
      user_agent: userAgent,
      visited_at: timestamp,
    });

    if (error) {
      // If table doesn't exist, just return success anyway
      if (error.code === "PGRST116") {
        return res.json({ success: true, tracked: false });
      }
      throw error;
    }

    res.json({ success: true, tracked: true });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    // Don't fail the request if tracking fails
    res.json({ success: true, tracked: false });
  }
}

export async function getVisitorStats(req: any, res: any) {
  try {
    // Get unique visitors from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: visitorData, error: visitorError } = await supabase
      .from("visitors")
      .select("ip_address", { count: "exact" })
      .gte("visited_at", thirtyDaysAgo.toISOString());

    if (visitorError) {
      // If table doesn't exist, return default stats
      if (visitorError.code === "42P01" || visitorError.code === "PGRST116") {
        return res.json({
          totalVisitors: 0,
          uniqueVisitors: 0,
          todayVisitors: 0,
          last7Days: 0,
          last30Days: 0,
        });
      }
      throw visitorError;
    }

    // Count unique IP addresses
    const uniqueIPs = new Set(visitorData?.map((v: any) => v.ip_address) || []);

    // Get today's visitors
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todayData } = await supabase
      .from("visitors")
      .select("ip_address", { count: "exact" })
      .gte("visited_at", today.toISOString());

    const todayUnique = new Set(todayData?.map((v: any) => v.ip_address) || []);

    // Get last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { data: sevenData } = await supabase
      .from("visitors")
      .select("ip_address", { count: "exact" })
      .gte("visited_at", sevenDaysAgo.toISOString());

    const sevenUnique = new Set(sevenData?.map((v: any) => v.ip_address) || []);

    res.json({
      totalVisitors: visitorData?.length || 0,
      uniqueVisitors: uniqueIPs.size,
      todayVisitors: todayUnique.size,
      last7Days: sevenUnique.size,
      last30Days: uniqueIPs.size,
    });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    res.status(500).json({ error: "Failed to fetch visitor statistics" });
  }
}
