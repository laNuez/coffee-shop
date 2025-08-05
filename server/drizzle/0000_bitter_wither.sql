CREATE TABLE `products_table` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);