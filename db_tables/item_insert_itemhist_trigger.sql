CREATE DEFINER=`admin`@`192.168.1.%` TRIGGER `item_insert_itemhist` AFTER INSERT ON `item` FOR EACH ROW BEGIN

INSERT INTO item_hist (itemhist_itemid,itemhist_boxid,itemhist_qtyafter,itemhist_nameafter,itemhist_tstamp) VALUES (NEW.item_id,NEW.item_boxid,NEW.item_qty,NEW.item_name, CURRENT_TIMESTAMP);

END