export declare type ISettings = {
    [key: string]: any;
};
export declare type ISettingsFunction = (settings: ISettings) => ISettings;
/**
 * @deprecated Use ISettings.
 */
export declare type Settings = ISettings;
/**
 * @deprecated Use ISettingsFunction.
 */
export declare type SettingsFunction = ISettingsFunction;
export interface ICustomizations {
    settings: ISettings;
    scopedSettings: {
        [key: string]: ISettings;
    };
    inCustomizerContext?: boolean;
}
export declare class Customizations {
    static reset(): void;
    static applySettings(settings: ISettings): void;
    static applyScopedSettings(scopeName: string, settings: ISettings): void;
    static getSettings(properties: string[], scopeName?: string, localSettings?: ICustomizations): any;
    static observe(onChange: () => void): void;
    static unobserve(onChange: () => void): void;
    private static _raiseChange;
}
//# sourceMappingURL=Customizations.d.ts.map