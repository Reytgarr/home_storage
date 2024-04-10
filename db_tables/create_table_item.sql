CREATE TABLE `item` (
	`item_id` INT(11) NOT NULL AUTO_INCREMENT,
	`item_boxid` INT(11) NOT NULL DEFAULT '0',
	`item_name` VARCHAR(200) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_uca1400_ai_ci',
	`item_qty` INT(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`item_id`) USING BTREE,
	INDEX `item_boxid` (`item_boxid`) USING BTREE
)
ENGINE=InnoDB
;
