import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { items, shippingDetails, total } = body;

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        userId: session?.user?.id || null,
        total,
        status: "pending",
        shippingName: shippingDetails.name,
        shippingEmail: shippingDetails.email,
        shippingAddress: shippingDetails.address,
        shippingCity: shippingDetails.city,
        shippingPostalCode: shippingDetails.postalCode,
        shippingCountry: shippingDetails.country,
      })
      .returning();

    // Create order items
    await db.insert(orderItems).values(
      items.map((item: any) => ({
        orderId: order.id,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }))
    );

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
