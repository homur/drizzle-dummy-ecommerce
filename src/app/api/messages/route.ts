import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messages, users } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// Get messages
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const [totalCount, messagesList] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(messages)
        .where(
          and(
            eq(messages.receiverId, session.user.id),
            eq(messages.type, "system")
          )
        ),
      db
        .select({
          id: messages.id,
          content: messages.content,
          isRead: messages.isRead,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(
          and(
            eq(messages.receiverId, session.user.id),
            eq(messages.type, "system")
          )
        )
        .orderBy(desc(messages.createdAt))
        .limit(limit)
        .offset(offset),
    ]);

    return NextResponse.json({
      messages: messagesList,
      total: Number(totalCount[0].count),
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// Send a message
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, content } = await request.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Receiver ID and content are required" },
        { status: 400 }
      );
    }

    // Check if receiver exists
    const receiver = await db
      .select()
      .from(users)
      .where(eq(users.id, receiverId))
      .limit(1);

    if (!receiver || receiver.length === 0) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    const [message] = await db
      .insert(messages)
      .values({
        senderId: session.user.id,
        receiverId,
        content,
      })
      .returning();

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// Mark message as read
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await request.json();

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    // Check if message exists and belongs to the user
    const message = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.id, messageId),
          eq(messages.receiverId, session.user.id),
          eq(messages.type, "system")
        )
      )
      .limit(1);

    if (!message || message.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const [updatedMessage] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId))
      .returning();

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error marking message as read:", error);
    return NextResponse.json(
      { error: "Failed to mark message as read" },
      { status: 500 }
    );
  }
}
