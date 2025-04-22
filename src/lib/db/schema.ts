// src/lib/db/schema.ts
import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  decimal,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationToken: text("verification_token").unique(),
  verificationTokenExpires: timestamp("verification_token_expires"),
  resetPasswordToken: text("reset_password_token").unique(),
  resetPasswordTokenExpires: timestamp("reset_password_token_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  inventory: integer("inventory").notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  imageKey: varchar("image_key", { length: 255 }), // Store the storage key
  imageWidth: decimal("image_width", { precision: 10, scale: 0 }),
  imageHeight: decimal("image_height", { precision: 10, scale: 0 }),
  imageFormat: varchar("image_format", { length: 10 }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isHighlighted: boolean("is_highlighted").default(false).notNull(),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  shippingName: text("shipping_name").notNull(),
  shippingEmail: text("shipping_email").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingPostalCode: text("shipping_postal_code").notNull(),
  shippingCountry: text("shipping_country").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cart table
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .notNull()
    .references(() => carts.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
});

// CMS Users table
export const cmsUsers = pgTable("cms_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("editor"), // admin, editor, etc.
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // Random session ID
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id")
    .notNull()
    .references(() => users.id),
  receiverId: integer("receiver_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  type: text("type").notNull().default("system"), // system, user
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
