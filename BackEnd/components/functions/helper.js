import { nanoid } from "nanoid";

export function randomID(num =20){
    const ID = nanoid(num);
    return ID;
}