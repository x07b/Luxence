import { pool } from "../lib/db.js";

export async function trackVisitor(req: any, res: any) {
  try {
    let clientIp = "unknown";
    const xff = req.headers["x-forwarded-for"];
    if (xff) {
      const ips = Array.isArray(xff) ? xff : (xff as string).split(",");
      clientIp = (ips[0] || "").trim();
    }
    if (!clientIp || clientIp === "unknown") {
      clientIp = req.socket.remoteAddress || "unknown";
    }

    const userAgent = req.headers["user-agent"] || "unknown";

    await pool.query(
      `INSERT INTO visitors (ip_address, user_agent, visited_at) VALUES ($1, $2, NOW())`,
      [clientIp, userAgent],
    );

    res.json({ success: true, tracked: true });
  } catch (error: any) {
    if (error.code === "42P01") {
      return res.json({ success: true, tracked: false });
    }
    console.error("Error tracking visitor:", error);
    res.json({ success: true, tracked: false });
  }
}

export async function getVisitorStats(_req: any, res: any) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [last30, last7, todayResult] = await Promise.all([
      pool.query(
        `SELECT COUNT(DISTINCT ip_address) as count FROM visitors WHERE visited_at >= $1`,
        [thirtyDaysAgo],
      ),
      pool.query(
        `SELECT COUNT(DISTINCT ip_address) as count FROM visitors WHERE visited_at >= $1`,
        [sevenDaysAgo],
      ),
      pool.query(
        `SELECT COUNT(DISTINCT ip_address) as count FROM visitors WHERE visited_at >= $1`,
        [today],
      ),
    ]);

    res.json({
      uniqueVisitors: parseInt(last30.rows[0].count),
      todayVisitors: parseInt(todayResult.rows[0].count),
      last7Days: parseInt(last7.rows[0].count),
      last30Days: parseInt(last30.rows[0].count),
    });
  } catch (error: any) {
    if (error.code === "42P01") {
      return res.json({
        uniqueVisitors: 0,
        todayVisitors: 0,
        last7Days: 0,
        last30Days: 0,
      });
    }
    console.error("Error fetching visitor stats:", error);
    res.status(500).json({ error: "Failed to fetch visitor statistics" });
  }
}
