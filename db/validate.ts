export function matchString(str: string, regex: RegExp): boolean{
    const test = str.match(regex);
    return test != null && test[0] == str;
}