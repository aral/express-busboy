
import connectBusboy = require("connect-busboy");
import polka = require("polka");

export interface KittenBusboyOptions extends connectBusboy.ConnectBusboyOptions {
    upload?: boolean;
    path?: string;
    allowedPath?: string | RegExp | ((url: string) => boolean);
    restrictMultiple?: boolean;
    mimeTypeLimit?: string | string[];
    strip?: (value: string, type?: string) => string;
}

export function extend(app: polka.Polka<any>, options?: KittenBusboyOptions): polka.Polka<any>;
