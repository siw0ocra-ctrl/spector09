CREATE TABLE `operations_v3` (
	`player_id` text NOT NULL,
	`id` text NOT NULL,
	`fingerprint` text NOT NULL,
	`result` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `operation_identity` ON `operations_v3` (`player_id`,`id`);--> statement-breakpoint
CREATE TABLE `players_v3` (
	`id` text PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`last_op` text,
	`recovery_hash` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `player_recovery` ON `players_v3` (`recovery_hash`);--> statement-breakpoint
CREATE TABLE `rankings_v3` (
	`run_id` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`difficulty` integer NOT NULL,
	`stage` integer NOT NULL,
	`weapon` text NOT NULL,
	`nickname` text NOT NULL,
	`rank` integer NOT NULL,
	`weapons` text NOT NULL,
	`elapsed_ms` integer NOT NULL,
	`kills` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ranking_best` ON `rankings_v3` (`player_id`,`difficulty`,`stage`,`weapon`);--> statement-breakpoint
CREATE INDEX `ranking_lookup` ON `rankings_v3` (`difficulty`,`stage`,`elapsed_ms`,`kills`);--> statement-breakpoint
CREATE TABLE `recovery_limits_v3` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions_v3` (
	`hash` text PRIMARY KEY NOT NULL,
	`player_id` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
DROP TABLE `scores`;