import { z } from "zod";
import { pool } from "../lib/db.js";
import {
  sendOrderConfirmationEmail,
  sendOrderAdminNotificationEmail,
} from "../lib/email.js";

// Schemas
const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(3),
});

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.coerce.number().positive().int(),
});

const createOrderSchema = z.object({
  customer: customerSchema,
  items: z.array(orderItemSchema).min(1),
  message: z.string().optional(),
});

export interface Order {
  id: string;
  panierCode: string;
  customer: z.infer<typeof customerSchema>;
  items: z.infer<typeof orderItemSchema>[];
  total: number | null;
  message: string | null;
  status: "en attente" | "en cours" | "livré" | "annulé";
  createdAt: Date;
  updatedAt: Date;
}

async function getOrderItems(orderId: string) {
  const result = await pool.query(
    `SELECT * FROM order_items
     WHERE order_id = $1
     ORDER BY created_at ASC`,
    [orderId],
  );

  return result.rows.map((item) => ({
    id: item.product_id,
    name: item.name,
    quantity: item.quantity,
  }));
}

async function dbOrderToApi(dbOrder: any): Promise<Order> {
  const items = await getOrderItems(dbOrder.id);

  return {
    id: dbOrder.id,
    panierCode: dbOrder.panier_code,
    customer: {
      name: dbOrder.customer_name,
      email: dbOrder.customer_email,
      phone: dbOrder.customer_phone,
      address: dbOrder.customer_address,
      city: dbOrder.customer_city,
      postalCode: dbOrder.customer_postal_code,
    },
    items,
    total:
      dbOrder.total !== null && dbOrder.total !== undefined
        ? parseFloat(dbOrder.total)
        : null,
    message: dbOrder.message ?? null,
    status: dbOrder.status,
    createdAt: new Date(dbOrder.created_at),
    updatedAt: new Date(dbOrder.updated_at),
  };
}

function generatePanierCode(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `PANIER-${timestamp.toString().slice(-8)}-${random}`;
}

// CREATE
export async function createOrder(req: any, res: any) {
  const client = await pool.connect();

  try {
    const data = createOrderSchema.parse(req.body);

    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 11)}`;
    const panierCode = generatePanierCode();

    await client.query("BEGIN");

    await client.query(
      `INSERT INTO orders
       (id, panier_code, customer_name, customer_email, customer_phone,
        customer_address, customer_city, customer_postal_code, status, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        orderId,
        panierCode,
        data.customer.name,
        data.customer.email,
        data.customer.phone,
        data.customer.address,
        data.customer.city,
        data.customer.postalCode,
        "en attente",
        data.message,
      ],
    );

    for (const item of data.items) {
      await client.query(
        `INSERT INTO order_items
         (order_id, product_id, name, quantity)
         VALUES ($1,$2,$3,$4)`,
        [orderId, item.id, item.name, item.quantity],
      );
    }

    await client.query("COMMIT");

    const emailItems = data.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
    }));

    Promise.all([
      sendOrderConfirmationEmail(
        data.customer.email,
        data.customer.name,
        panierCode,
        emailItems,
        null,
      ).catch(console.error),
      sendOrderAdminNotificationEmail(
        data.customer.name,
        data.customer.email,
        panierCode,
        emailItems,
        null,
      ).catch(console.error),
    ]);

    res.status(201).json({
      success: true,
      panierCode,
      orderId,
    });
  } catch (err: any) {
    await client.query("ROLLBACK");

    if (err instanceof z.ZodError) {
      console.log("VALIDATION ERROR:", err.errors);

      return res.status(400).json({
        success: false,
        message: "Validation échouée",
        errors: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
          received: e,
        })),
      });
    }

    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
}

// GET ALL
export async function getOrders(_req: any, res: any) {
  try {
    const result = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC`,
    );

    const orders = await Promise.all(result.rows.map((o) => dbOrderToApi(o)));

    res.json({ success: true, orders, count: orders.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}

// GET by panier
export async function getOrderByPanierCode(req: any, res: any) {
  const result = await pool.query(
    `SELECT * FROM orders WHERE panier_code = $1`,
    [req.params.panierCode.toUpperCase()],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false });
  }

  res.json({
    success: true,
    order: await dbOrderToApi(result.rows[0]),
  });
}

// GET by id
export async function getOrderById(req: any, res: any) {
  const result = await pool.query(`SELECT * FROM orders WHERE id = $1`, [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false });
  }

  res.json({
    success: true,
    order: await dbOrderToApi(result.rows[0]),
  });
}

// SEARCH
export async function searchOrders(req: any, res: any) {
  const q = `%${req.query.query}%`;

  const result = await pool.query(
    `SELECT * FROM orders
     WHERE panier_code ILIKE $1
        OR customer_name ILIKE $1
        OR customer_email ILIKE $1
        OR customer_phone ILIKE $1`,
    [q],
  );

  const orders = await Promise.all(result.rows.map((o) => dbOrderToApi(o)));

  res.json({ success: true, results: orders, count: orders.length });
}

// UPDATE STATUS
export async function updateOrderStatus(req: any, res: any) {
  const { id } = req.params;
  const { status } = req.body;

  const result = await pool.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false });
  }

  res.json({
    success: true,
    order: await dbOrderToApi(result.rows[0]),
  });
}

// DELETE
export async function deleteOrder(req: any, res: any) {
  const result = await pool.query(
    `DELETE FROM orders WHERE id = $1 RETURNING id`,
    [req.params.id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false });
  }

  res.json({ success: true });
}

// GET by status
export async function getOrdersByStatus(req: any, res: any) {
  try {
    const { status } = req.params;

    const validStatuses = ["en attente", "en cours", "livré", "annulé"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const result = await pool.query(
      `SELECT * FROM orders
       WHERE status = $1
       ORDER BY created_at DESC`,
      [status],
    );

    const orders = await Promise.all(
      result.rows.map((order) => dbOrderToApi(order)),
    );

    return res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
}

// FULL update
export async function updateOrder(req: any, res: any) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { customer, items, status } = req.body;

    const existing = await client.query(`SELECT * FROM orders WHERE id = $1`, [
      id,
    ]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    const updateData: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (customer) {
      const validatedCustomer = customerSchema.parse(customer);

      updateData.push(`customer_name = $${i++}`);
      values.push(validatedCustomer.name);

      updateData.push(`customer_email = $${i++}`);
      values.push(validatedCustomer.email);

      updateData.push(`customer_phone = $${i++}`);
      values.push(validatedCustomer.phone);

      updateData.push(`customer_address = $${i++}`);
      values.push(validatedCustomer.address);

      updateData.push(`customer_city = $${i++}`);
      values.push(validatedCustomer.city);

      updateData.push(`customer_postal_code = $${i++}`);
      values.push(validatedCustomer.postalCode);
    }

    if (status !== undefined) {
      const validStatuses = ["en attente", "en cours", "livré", "annulé"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      updateData.push(`status = $${i++}`);
      values.push(status);
    }

    await client.query("BEGIN");

    let updatedOrder = existing.rows[0];

    if (updateData.length > 0) {
      values.push(id);

      const result = await client.query(
        `UPDATE orders
         SET ${updateData.join(", ")}
         WHERE id = $${i}
         RETURNING *`,
        values,
      );

      updatedOrder = result.rows[0];
    }

    if (items && Array.isArray(items)) {
      await client.query(`DELETE FROM order_items WHERE order_id = $1`, [id]);

      for (const item of items) {
        await client.query(
          `INSERT INTO order_items
           (order_id, product_id, name, quantity)
           VALUES ($1,$2,$3,$4)`,
          [id, item.id, item.name, item.quantity],
        );
      }
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Commande mise à jour",
      order: await dbOrderToApi(updatedOrder),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  } finally {
    client.release();
  }
}
