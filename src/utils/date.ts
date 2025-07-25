import { DateTime } from "luxon";

/**
 * Converte uma data UTC para horário local de São Paulo
 * @param date Date (UTC)
 * @returns Date formatada no fuso de São Paulo
 */

export function formatToSaoPauloString(date: Date): string {
  return DateTime.fromJSDate(date, { zone: "utc" })
    .setZone("America/Sao_Paulo")
    .toFormat("yyyy-MM-dd HH:mm");
}
