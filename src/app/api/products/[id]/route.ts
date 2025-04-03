import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = await context.params;

    const updatedProduct = await db
      .update(products)
      .set({
        name: data.name,
        description: data.description,
        price: data.price,
        inventory: data.inventory,
        imageUrl: data.imageUrl,
        isHighlighted: data.isHighlighted,
        updatedAt: new Date(),
      })
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (!updatedProduct.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (!deletedProduct.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(params.id)))
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
