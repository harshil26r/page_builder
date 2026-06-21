import cookieParser from "cookie-parser";
import signature from "cookie-signature";

const COOKIE_SECRET = process.env.SecretKey || "fsdf";

export function signCookie(val) {
  if (typeof val !== "string") {
    throw new TypeError("Cookie value must be a string");
  }
  return "s:" + signature.sign(val, COOKIE_SECRET);
}

export function unsignCookie(val) {
  if (typeof val !== "string" || !val.startsWith("s:")) {
    return false;
  }
  const result = cookieParser.signedCookie(val, COOKIE_SECRET);
  return result === val ? false : result;
}
