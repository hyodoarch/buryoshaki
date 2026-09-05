import { type Grid } from "./parser";
export declare function showError(element: HTMLElement, error: unknown): void;
export declare function renderGrid(host: HTMLElement, grid: Grid, sources: string[]): HTMLElement;
/** Uses the owning window, including Obsidian pop-out windows. Returns teardown. */
export declare function mountGrid(row: HTMLElement): () => void;
