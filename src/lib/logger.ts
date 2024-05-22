/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk, { ModifierName, ColorName, ChalkInstance } from "chalk";

type CallbackFn = (message: string, args: any[], errors: Error[]) => void;
type Modifiers = ModifierName | ColorName;
export class Logger {
  message: string;
  styles: Modifiers[];
  callback: CallbackFn;

  constructor(message: string = "", styles: Modifiers[] = [], callback: CallbackFn = () => {}) {
    this.message = message;
    this.styles = styles;
    this.callback = callback;
  }

  log(...args: any[]) {
    let colorFn: ChalkInstance = chalk;

    this.styles.forEach((filter: Modifiers) => {
      colorFn = colorFn[filter];
    });
    let msg = "";
    let counter = 1;
    const hasErrors: Error[] = [];
    args.forEach((arg: any) => {
      if (args.length > 1) {
        msg += counter !== 1 ? " " : "";
      }
      counter++;
      if (typeof arg === "string") {
        msg += arg;
      } else if (arg instanceof Error) {
        msg += "** Error " + (hasErrors.length + 1) + " **";
        hasErrors.push(arg);
      } else {
        msg += Logger.stringify(arg);
      }
    });

    console.log(colorFn(this.message) + " " + msg);

    let index = 0;
    if (hasErrors.length !== 0) {
      hasErrors.forEach((error: Error) => console.log("(*) " + colorFn("Error " + ++index + ":"), error));
    }
    return this.callback(this.message + " " + msg, args, hasErrors);
  }

  static create(message: string, styles: Modifiers[], callback: () => void) {
    return new Logger(message, styles, callback);
  }

  static get stringify() {
    return function (obj: any) {
      const printedObjects: any[] = [];
      const printedObjectKeys: string[] = [];

      function printOnceReplacer(key: string, value: any) {
        if (typeof value === "function") {
          return "Function:" + value + "";
        }
        if (printedObjects.length > 40000) {
          return "object too long";
        }
        let printedObjIndex: number = 0;
        printedObjects.forEach(function (obj, index) {
          if (obj === value) {
            printedObjIndex = index;
          }
        });
        if (key == "") {
          printedObjects.push(obj);
          printedObjectKeys.push("root");
          return value;
        } else if (printedObjIndex + "" != "false" && typeof value == "object") {
          if (printedObjectKeys[printedObjIndex] == "root") {
            return "(pointer to root)";
          } else {
            return (
              "(see " +
              (!!value && !!value.constructor ? value.constructor.name.toLowerCase() : typeof value) +
              " with key " +
              printedObjectKeys[printedObjIndex] +
              ")"
            );
          }
        } else {
          const qualifiedKey = key || "(empty key)";
          printedObjects.push(value);
          printedObjectKeys.push(qualifiedKey);
          return value;
        }
      }
      return JSON.stringify(obj, printOnceReplacer, 4);
    };
  }
}
