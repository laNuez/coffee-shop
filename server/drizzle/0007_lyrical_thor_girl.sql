CREATE TABLE `stripe_events_table` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`processed_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stripe_events_table_id_unique` ON `stripe_events_table` (`id`);