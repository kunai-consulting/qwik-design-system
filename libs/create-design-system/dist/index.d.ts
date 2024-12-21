/// <reference types="node" />
export declare function isHome(dir: string): boolean;
export declare function resolveAbsoluteDir(dir: string): string;
export declare function resolveRelativeDir(dir: string): string;
export declare function $(cmd: string, args: string[], cwd: string): {
    abort: () => Promise<void>;
    install: Promise<boolean>;
};
export declare function isUnicodeSupported(): boolean;
export declare const note: (message?: string, title?: string) => void;
export declare function panic(msg: string): void;
export declare const clearDir: (dir: string) => Promise<void[]>;
export declare function fileGetContents(file: string): string;
export declare function filePutContents(file: string, contents: string): void;
export declare function fileReplaceContents(file: string, search: string | RegExp, replace: string): void;
export declare function getPackageManager(): string;
export declare const isPackageManagerInstalled: (packageManager: string) => Promise<unknown>;
export declare function pmRunCommand(): string;
export declare function replacePackageJsonRunCommand(dir: string): void;
export declare function panicCanceled(): void;
export declare const $pm: (args: string | string[], cwd?: string, env?: NodeJS.ProcessEnv) => Promise<unknown>;
export declare const installDependencies: (cwd: string) => Promise<void>;
export type ProjectConfig = {
    project: string;
    adapter?: "deno" | "node";
    force?: boolean;
    install?: boolean;
    biome?: boolean;
    git?: boolean;
    ci?: boolean;
    yes: boolean;
    no: boolean;
    it: boolean;
    dryRun: boolean;
};
export declare function parseArgs(args: string[]): ProjectConfig;
export declare function createProject(config: ProjectConfig, defaultProject: string): Promise<void>;
/** @param args Pass here process.argv.slice(2) */
export declare function runCreate(...args: string[]): Promise<void>;
export default function (): Promise<void>;
