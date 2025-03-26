// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const highlighted = searchParams.get("highlighted");

    let query = db.select().from(products);

    if (highlighted === "true") {
      query = query.where(eq(products.isHighlighted, true));
    }

    const allProducts = await query;
    console.log("API Response:", "allProducts");
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Handle both single product and array of products
    const productsToInsert = Array.isArray(data.products)
      ? data.products
      : [data];

    const newProducts = await db
      .insert(products)
      .values(productsToInsert)
      .returning();

    return NextResponse.json(newProducts, { status: 201 });
  } catch (error) {
    console.error("Error creating products:", error);
    return NextResponse.json(
      { error: "Failed to create products" },
      { status: 500 }
    );
  }
}
