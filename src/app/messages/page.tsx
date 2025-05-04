"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { Message } from "@/types/message";

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login?redirect=/messages");
          return;
        }
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      const response = await fetch("/api/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark message as read");
      }

      // Update the message in the state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Messages</h2>
            </div>
            <div className="p-6">
              {messages.length === 0 ? (
                <p className="text-gray-500">No messages</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border ${
                        message.isRead
                          ? "bg-white"
                          : "bg-blue-50 border-blue-200"
                      }`}
                      onClick={() => !message.isRead && markAsRead(message.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-500 text-sm">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!message.isRead && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-gray-700">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
