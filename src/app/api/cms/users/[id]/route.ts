import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { cmsUsers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email, role } = body;

    // Check if user exists
    const existingUser = await db
      .select()
      .from(cmsUsers)
      .where(eq(cmsUsers.id, parseInt(params.id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is already taken by another user
    const emailTaken = await db
      .select()
      .from(cmsUsers)
      .where(
        and(eq(cmsUsers.email, email), eq(cmsUsers.id, parseInt(params.id)))
      )
      .limit(1);

    if (emailTaken.length === 0) {
      return NextResponse.json(
        { error: "Email is already taken" },
        { status: 400 }
      );
    }

    // Update user
    const [updatedUser] = await db
      .update(cmsUsers)
      .set({
        name,
        email,
        role,
        updatedAt: new Date(),
      })
      .where(eq(cmsUsers.id, parseInt(params.id)))
      .returning();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(cmsUsers)
      .where(eq(cmsUsers.id, parseInt(params.id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user
    await db.delete(cmsUsers).where(eq(cmsUsers.id, parseInt(params.id)));

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
