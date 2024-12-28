import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import CryptoJS from "crypto-js";

const errorToString = (e: unknown): string => {
  let err: string = "";
  if (typeof e === "string") {
    err = e.toUpperCase();
  } else if (e instanceof Error) {
    err = e.message;
  }
  return err;
};

export { errorToString };

const isContainSpace = (value: string): boolean => {
  return !value.includes(" ");
};

export { isContainSpace };

const capitalcase = (value: string): string => {
  const words = value.split(" ");

  const capitalWords = words.map((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  return capitalWords.join(" ");
};

export { capitalcase };

const onlyNumbersRegex = /^[0-9]*$/;

/**
 * Handles the change event for a number input field in a React component.
 * If the input value does not match the regex pattern for numbers, it clears the input field.
 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event object
 * @returns None
 */
const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;

  if (!onlyNumbersRegex.test(value)) {
    console.log(value);
    event.target.value = event.target.value.slice(0, -1);
  }
};

export { handleNumberChange };

const onlyDecimalRegex = /^[0-9.]*$/;

/**
 * Handles the change event for an input element to allow only decimal values.
 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event object.
 * @returns None
 */
const handleDecimalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  if (!onlyDecimalRegex.test(value)) {
    event.target.value = event.target.value.slice(0, -1);
  }
};

export { handleDecimalChange };

/**
 * Truncates a given text to a specified length and appends "..." if the text exceeds the length.
 * @param {string} text - The text to truncate.
 * @param {number} long - The maximum length of the truncated text.
 * @returns The truncated text with "..." appended if it exceeds the specified length.
 */
const longtext = (text: string, long: number): string => {
  if (text.length <= long) {
    return text;
  } else {
    return text.substring(0, long) + " ...";
  }
};
export { longtext };

const formateDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (month < 10 && day < 10) {
    return `0${day}-0${month}-${year}`;
  } else if (month < 10) {
    return `${day}-0${month}-${year}`;
  } else if (day < 10) {
    return `0${day}-${month}-${year}`;
  } else {
    return `${day}-${month}-${year}`;
  }
};
export { formateDate };

const secretKey = "knf92fg#G$%2Ij309pwkn4gf#WTF#WCc2@#$WTfwe4gFVD";

// Helper functions for URL-safe Base64 encoding and decoding
const toBase64Url = (str: string): string =>
  str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const fromBase64Url = (str: string): string =>
  str.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(str.length % 4 || 4);

export const encryptURLData = (data: string): string => {
  const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
  return toBase64Url(encryptedData);
};

export const decryptURLData = (
  cipherText: string,
  router: AppRouterInstance
): string => {
  try {
    const decodedCipherText = fromBase64Url(cipherText); // Convert back from URL-safe Base64
    const bytes = CryptoJS.AES.decrypt(decodedCipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    router.back();
    return "";
  }
};
