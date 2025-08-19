PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cart_items_table` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_cart_items_table`("id", "user_id", "product_id", "quantity") SELECT "id", "user_id", "product_id", "quantity" FROM `cart_items_table`;--> statement-breakpoint
DROP TABLE `cart_items_table`;--> statement-breakpoint
ALTER TABLE `__new_cart_items_table` RENAME TO `cart_items_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `cart_items_table_userId_productId_unique` ON `cart_items_table` (`user_id`,`product_id`);