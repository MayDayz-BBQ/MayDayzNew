export declare class FilterBuilder {
    filters: string[];
    constructor();
    private static verifyFieldIsString;
    private static verifyListOfSingularType;
    private static verifyValueIsAllowedType;
    private static adjustValue;
    private addValueFilter;
    equals(field: string, value: boolean | number | string | Date | string[] | number[] | boolean[] | Date[]): this;
    lessThan(field: string, value: number | Date): this;
    greaterThan(field: string, value: number | Date): this;
    lessOrEqual(field: string, value: number | Date): this;
    greaterOrEqual(field: string, value: number | Date): this;
    contains(field: string, value: string | string[]): this;
    containsAny(field: string, value: string | string[]): this;
    containsAll(field: string, value: string | string[]): this;
    endsWith(field: string, value: string): this;
    startsWith(field: string, value: string): this;
    any(field: string, value: string[] | number[] | boolean[] | Date[]): this;
    has(field: string): this;
    build(): string;
}
