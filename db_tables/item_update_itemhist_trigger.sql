CREATE DEFINER=`admin`@`192.168.1.%` TRIGGER `item_update_itemhist` AFTER UPDATE ON `item` FOR EACH ROW BEGIN


if (NEW.item_name <> OLD.item_name) OR (NEW.item_qty <> OLD.item_qty) OR (NEW.item_boxid <> OLD.item_boxid) then

INSERT INTO item_hist (itemhist_itemid,itemhist_boxid,itemhist_qtybefore,itemhist_qtyafter,itemhist_namebefore,itemhist_nameafter,itemhist_tstamp) VALUES (NEW.item_id,NEW.item_boxid,OLD.item_qty,NEW.item_qty,OLD.item_name,NEW.item_name, CURRENT_TIMESTAMP);

END if;
END