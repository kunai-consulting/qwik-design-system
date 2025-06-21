import { type ReactivityAdapter } from "./adapter";
export declare function useDummy(_: unknown, runtime: ReactivityAdapter): {
    firstNameSig: import("./adapter").Signal<string>;
    lastNameSig: import("./adapter").Signal<string>;
    ageSig: import("./adapter").Signal<number>;
    fullNameSig: import("./adapter").Computed<string>;
    isAdultSig: import("./adapter").Computed<boolean>;
};
