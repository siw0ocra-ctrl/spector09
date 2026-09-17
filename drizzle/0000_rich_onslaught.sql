CREATE TABLE `scores` (
	`run_id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`stage` integer NOT NULL,
	`nickname` text NOT NULL,
	`elapsed_ms` integer NOT NULL,
	`kills` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scores_stage_player` ON `scores` (`stage`,`player_id`);--> statement-breakpoint
CREATE INDEX `scores_stage_time` ON `scores` (`stage`,`elapsed_ms`,`kills`,`created_at`);