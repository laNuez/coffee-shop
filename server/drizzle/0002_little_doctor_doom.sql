CREATE TABLE `cart_items_table` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` integer,
	`productId` integer,
	`quantity` integer DEFAULT 1,
	FOREIGN KEY (`userId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `products_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_items_table` (
	`id` text PRIMARY KEY NOT NULL,
	`orderId` integer,
	`productId` integer,
	`quantity` integer DEFAULT 1,
	`price` integer NOT NULL,
	FOREIGN KEY (`orderId`) REFERENCES `orders_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `products_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders_table` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` integer,
	`totalAmount` integer NOT NULL,
	`status` text DEFAULT 'pending',
	`createdAt` text DEFAULT (current_timestamp),
	FOREIGN KEY (`userId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_products_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_products_table`("id", "name", "price", "category", "description") SELECT "id", "name", "price", "category", "description" FROM `products_table`;--> statement-breakpoint
DROP TABLE `products_table`;--> statement-breakpoint
ALTER TABLE `__new_products_table` RENAME TO `products_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users_table` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users_table`("id", "username", "email", "password") SELECT "id", "username", "email", "password" FROM `users_table`;--> statement-breakpoint
DROP TABLE `users_table`;--> statement-breakpoint
ALTER TABLE `__new_users_table` RENAME TO `users_table`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);