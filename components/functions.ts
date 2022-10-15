import { decode as entityDecode } from "he";
export const HTMLEntityStringToUTF8 = (entityString: string) => {
  // fixes this bullshit the api returns; "stopName": "Berlin Hbf &#x0028;tief&#x0029;"
  // -> "Berlin HBf (tief)"
  return entityDecode(entityString);
};
export const daysInMonth = (month: number, year: number) => {
  // last day of prior month + 1 month
  return new Date(year, month + 1, 0).getDate();
};
export const weekdayOfFirst = (month: number, year: number) => {
  return new Date(year, month, 1).getDay();
};
export const weekdayOfLast = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDay();
};
