PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cart_items_table` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`productId` text,
	`quantity` integer DEFAULT 1,
	FOREIGN KEY (`userId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `products_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_cart_items_table`("id", "userId", "productId", "quantity") SELECT "id", "userId", "productId", "quantity" FROM `cart_items_table`;--> statement-breakpoint
DROP TABLE `cart_items_table`;--> statement-breakpoint
ALTER TABLE `__new_cart_items_table` RENAME TO `cart_items_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_order_items_table` (
	`id` text PRIMARY KEY NOT NULL,
	`orderId` text,
	`productId` text,
	`quantity` integer DEFAULT 1,
	`price` integer NOT NULL,
	FOREIGN KEY (`orderId`) REFERENCES `orders_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `products_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_order_items_table`("id", "orderId", "productId", "quantity", "price") SELECT "id", "orderId", "productId", "quantity", "price" FROM `order_items_table`;--> statement-breakpoint
DROP TABLE `order_items_table`;--> statement-breakpoint
ALTER TABLE `__new_order_items_table` RENAME TO `order_items_table`;--> statement-breakpoint
CREATE TABLE `__new_orders_table` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`totalAmount` integer NOT NULL,
	`status` text DEFAULT 'pending',
	`createdAt` text DEFAULT (current_timestamp),
	FOREIGN KEY (`userId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_orders_table`("id", "userId", "totalAmount", "status", "createdAt") SELECT "id", "userId", "totalAmount", "status", "createdAt" FROM `orders_table`;--> statement-breakpoint
DROP TABLE `orders_table`;--> statement-breakpoint
ALTER TABLE `__new_orders_table` RENAME TO `orders_table`;