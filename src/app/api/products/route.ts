// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { generateSlug } from "@/lib/utils/slug";
import { Product } from "@/types/product";

const ITEMS_PER_PAGE = 12;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    const [totalCount, items] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(products),
      db
        .select()
        .from(products)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(products.createdAt)),
    ]);

    return NextResponse.json({
      items,
      total: Number(totalCount[0].count),
      page,
      totalPages: Math.ceil(Number(totalCount[0].count) / limit),
      limit,
    });
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

    // Add slugs to products
    const productsWithSlugs = productsToInsert.map(
      (product: Partial<Product>) => ({
        ...product,
        slug: generateSlug(product.name || ""),
      })
    );

    const newProducts = await db
      .insert(products)
      .values(productsWithSlugs)
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
