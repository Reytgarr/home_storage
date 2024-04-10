CREATE TABLE `user` (
	`user_id` INT(11) NOT NULL AUTO_INCREMENT,
	`user_name` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`user_password` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	PRIMARY KEY (`user_id`) USING BTREE,
	UNIQUE INDEX `user_name` (`user_name`) USING BTREE
)
ENGINE=InnoDB
;
