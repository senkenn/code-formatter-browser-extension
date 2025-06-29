import { describe, expect, it } from "vitest";
import { formatCode } from "../../lib/formatter";

describe("formatCode", () => {
  it("should format TypeScript code correctly", async () => {
    const input = `const x={a:1,b:2};function test(){return x.a+x.b;}`;
    const expected = `const x = { a: 1, b: 2 };\nfunction test() {\n  return x.a + x.b;\n}\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should apply single quotes", async () => {
    const input = `const str = "hello world";`;
    const expected = `const str = 'hello world';\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should add semicolons", async () => {
    const input = `const x = 5\nconst y = 10`;
    const expected = `const x = 5;\nconst y = 10;\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format with trailing commas", async () => {
    const input = `const obj = {a: 1, b: 2}`;
    const expected = `const obj = { a: 1, b: 2 };\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should handle function formatting", async () => {
    const input = `function longFunctionName(parameterOne,parameterTwo,parameterThree){return parameterOne+parameterTwo+parameterThree;}`;
    const expected = `function longFunctionName(parameterOne, parameterTwo, parameterThree) {\n  return parameterOne + parameterTwo + parameterThree;\n}\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should throw error for invalid syntax", async () => {
    const input = `const x = {`;

    await expect(formatCode(input)).rejects.toThrow();
  });

  it("should format empty input", async () => {
    const input = "";
    const expected = "";

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  // TypeScript specific tests
  it("should format interface declarations", async () => {
    const input = `interface User{name:string;age:number;email?:string;}`;
    const expected = `interface User {\n  name: string;\n  age: number;\n  email?: string;\n}\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format type annotations", async () => {
    const input = `const user:User={name:"John",age:30};function greet(name:string):string{return "Hello "+name;}`;
    const expected = `const user: User = { name: 'John', age: 30 };\nfunction greet(name: string): string {\n  return 'Hello ' + name;\n}\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format generic types", async () => {
    const input = `function identity<T>(arg:T):T{return arg;}const result:Array<string>=["a","b","c"];`;
    const expected = `function identity<T>(arg: T): T {\n  return arg;\n}\nconst result: Array<string> = ['a', 'b', 'c'];\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format union and intersection types", async () => {
    const input = `type StringOrNumber=string|number;type UserWithId=User&{id:number};`;
    const expected = `type StringOrNumber = string | number;\ntype UserWithId = User & { id: number };\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format class with TypeScript features", async () => {
    const input = `class Person{private _name:string;constructor(name:string){this._name=name;}public getName():string{return this._name;}}`;
    const expected = `class Person {\n  private _name: string;\n  constructor(name: string) {\n    this._name = name;\n  }\n  public getName(): string {\n    return this._name;\n  }\n}\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format arrow functions with type annotations", async () => {
    const input = `const add:(a:number,b:number)=>number=(a,b)=>a+b;const users:User[]=data.map((item:any):User=>({name:item.n,age:item.a}));`;
    const expected = `const add: (a: number, b: number) => number = (a, b) => a + b;\nconst users: User[] = data.map(\n  (item: any): User => ({ name: item.n, age: item.a })\n);\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format enum declarations", async () => {
    const input = `enum Color{Red="red",Green="green",Blue="blue"}const myColor:Color=Color.Red;`;
    const expected = `enum Color {\n  Red = 'red',\n  Green = 'green',\n  Blue = 'blue',\n}\nconst myColor: Color = Color.Red;\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });
});
