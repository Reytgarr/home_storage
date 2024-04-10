CREATE TABLE `item_hist` (
	`itemhist_id` INT(11) NOT NULL AUTO_INCREMENT,
	`itemhist_itemid` INT(11) NOT NULL DEFAULT '0',
	`itemhist_boxid` INT(11) NULL DEFAULT NULL,
	`itemhist_tstamp` TIMESTAMP NOT NULL,
	`itemhist_qtybefore` INT(11) NOT NULL DEFAULT '0',
	`itemhist_qtyafter` INT(11) NOT NULL DEFAULT '0',
	`itemhist_namebefore` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`itemhist_nameafter` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	PRIMARY KEY (`itemhist_id`) USING BTREE,
	INDEX `itemhist_itemid` (`itemhist_itemid`) USING BTREE,
	INDEX `itemhist_boxid` (`itemhist_boxid`) USING BTREE
)
ENGINE=InnoDB
;
