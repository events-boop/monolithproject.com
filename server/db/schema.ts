import { mysqlTable, serial, varchar, text, json, timestamp, boolean, int } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const events = mysqlTable("events", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    date: timestamp("date").notNull(),
    venue: varchar("venue", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, published, archived
    ticketTypes: json("ticket_types").notNull(), // Array of { name, price, quantity, etc. }
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const tickets = mysqlTable("tickets", {
    id: serial("id").primaryKey(),
    eventId: int("event_id").notNull(),
    userId: varchar("user_id", { length: 255 }), // Can be email or Clerk ID
    tier: varchar("tier", { length: 100 }).notNull(),
    qrCodeUrl: varchar("qr_code_url", { length: 512 }),
    status: varchar("status", { length: 50 }).notNull().default("valid"), // valid, checked_in, cancelled
    orderId: int("order_id"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const orders = mysqlTable("orders", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }), // Can be email or Clerk ID
    stripeCheckoutId: varchar("stripe_checkout_id", { length: 255 }).notNull(),
    amount: int("amount").notNull(), // In cents
    status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, completed, failed
    customerEmail: varchar("customer_email", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
});

export const eventsRelations = relations(events, ({ many }) => ({
    tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
    event: one(events, {
        fields: [tickets.eventId],
        references: [events.id],
    }),
    order: one(orders, {
        fields: [tickets.orderId],
        references: [orders.id],
    }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
    tickets: many(tickets),
}));
