interface LineInitParams {
    name: string;
    value: number;
    color: string;
    onChange: (value: number) => void;
}
export type SuccessResult<T> = {
    success: true;
    payload?: T;
};
export type ErrorResult = {
    success: false;
    error: string;
};
export type Result<T> = SuccessResult<T> | ErrorResult;
export default class PercentageSlider {
    constructor(node: HTMLElement | null);
    addLine({ value, onChange, name, color, }: LineInitParams): Result<void>;
    addLines(lines: LineInitParams[]): Result<void>;
    removeLine(name: string, onRemove?: () => void): void;
}
declare global {
    interface Window {
        PercentageSlider: ThisType<PercentageSlider>;
    }
}

//# sourceMappingURL=types.d.ts.map
