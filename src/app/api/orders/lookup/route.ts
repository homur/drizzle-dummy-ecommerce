import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, email } = body;

    if (!orderId || !email) {
      return NextResponse.json(
        { error: "Order ID and email are required" },
        { status: 400 }
      );
    }

    // Find the order by ID and email
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(eq(orders.id, parseInt(orderId)), eq(orders.shippingEmail, email))
      );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get order items with product details
    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        product: {
          name: products.name,
          imageUrl: products.imageUrl,
        },
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));

    // Convert total to number and return the order with items
    return NextResponse.json({
      ...order,
      total: Number(order.total),
      items: items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    });
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
