PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_order_items_table` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`price` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_order_items_table`("id", "order_id", "product_id", "quantity", "price") SELECT "id", "order_id", "product_id", "quantity", "price" FROM `order_items_table`;--> statement-breakpoint
DROP TABLE `order_items_table`;--> statement-breakpoint
ALTER TABLE `__new_order_items_table` RENAME TO `order_items_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_orders_table` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`total_amount` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_orders_table`("id", "user_id", "total_amount", "status", "created_at") SELECT "id", "user_id", "total_amount", "status", "created_at" FROM `orders_table`;--> statement-breakpoint
DROP TABLE `orders_table`;--> statement-breakpoint
ALTER TABLE `__new_orders_table` RENAME TO `orders_table`;--> statement-breakpoint
ALTER TABLE `products_table` ADD `image` text NOT NULL;