import { decode as entityDecode } from "he";
export const HTMLEntityStringToUTF8 = (entityString: string) => {
  // fixes this bullshit the api returns; "stopName": "Berlin Hbf &#x0028;tief&#x0029;"
  // -> "Berlin HBf (tief)"
  console.log(entityString);
  return entityDecode(entityString);
};
