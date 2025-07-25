import { DateTime } from "luxon";

/**
 * Converte uma data UTC para horário local de São Paulo
 * @param date Date (UTC)
 * @returns Date formatada no fuso de São Paulo
 */
export function toSaoPauloTime(date: Date): Date {
  return DateTime.fromJSDate(date, { zone: "utc" })
    .setZone("America/Sao_Paulo")
    .toJSDate();
}
