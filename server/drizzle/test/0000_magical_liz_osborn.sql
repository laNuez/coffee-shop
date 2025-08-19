CREATE TABLE `cart_items_table` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cart_items_table_userId_productId_unique` ON `cart_items_table` (`user_id`,`product_id`);--> statement-breakpoint
CREATE TABLE `order_items_table` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text,
	`product_id` text,
	`quantity` integer DEFAULT 1,
	`price` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders_table` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`total_amount` integer NOT NULL,
	`status` text DEFAULT 'pending',
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);