DROP INDEX "cart_items_table_userId_productId_unique";--> statement-breakpoint
DROP INDEX "users_table_username_unique";--> statement-breakpoint
DROP INDEX "users_table_email_unique";--> statement-breakpoint
ALTER TABLE `users_table` ALTER COLUMN "role" TO "role" text NOT NULL DEFAULT 'user';--> statement-breakpoint
CREATE UNIQUE INDEX `cart_items_table_userId_productId_unique` ON `cart_items_table` (`user_id`,`product_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);