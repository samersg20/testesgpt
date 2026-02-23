import { Item } from "@prisma/client";
import { StorageMethod } from "@/lib/constants";

export function getShelfLifeHours(item: Item, method: StorageMethod) {
  switch (method) {
    case "RESFRIADO":
      return item.chilledHours;
    case "CONGELADO":
      return item.frozenHours;
    case "AMBIENTE":
      return item.ambientHours;
    case "QUENTE":
      return item.hotHours;
    case "DESCONGELANDO":
      return item.thawingHours;
    default:
      return null;
  }
}
