import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;
    const product = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (!product || product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Convert price to number before sending response
    const productWithNumberPrice = {
      ...product[0],
      price: Number(product[0].price),
    };

    return NextResponse.json(productWithNumberPrice);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
