CREATE TABLE `author` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text(255) NOT NULL,
	`biography` text DEFAULT '' NOT NULL,
	`publisher_id` integer NOT NULL,
	CONSTRAINT `fk_author_publisher_id_publisher_id_fk` FOREIGN KEY (`publisher_id`) REFERENCES `publisher`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `authors_to_books` (
	`author_id` integer NOT NULL,
	`book_id` integer NOT NULL,
	CONSTRAINT `authors_to_books_pk` PRIMARY KEY(`author_id`, `book_id`),
	CONSTRAINT `fk_authors_to_books_author_id_author_id_fk` FOREIGN KEY (`author_id`) REFERENCES `author`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_authors_to_books_book_id_book_id_fk` FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `book` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text(255) NOT NULL,
	`slug` text NOT NULL,
	`isbn` text NOT NULL,
	`summary` text NOT NULL,
	`page_count` integer NOT NULL,
	`readed_page` integer NOT NULL,
	`reading` integer DEFAULT false NOT NULL,
	`finished` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`publisher_id` integer NOT NULL,
	CONSTRAINT `fk_book_publisher_id_publisher_id_fk` FOREIGN KEY (`publisher_id`) REFERENCES `publisher`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `publisher` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text(255) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `author_name_idx` ON `author` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `book_isbn_idx` ON `book` (`isbn`);--> statement-breakpoint
CREATE UNIQUE INDEX `book_slug_idx` ON `book` (`slug`);--> statement-breakpoint
CREATE INDEX `publisher_name_idx` ON `publisher` (`name`);