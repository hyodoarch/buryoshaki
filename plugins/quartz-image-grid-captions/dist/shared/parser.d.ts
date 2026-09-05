export interface GridImage {
    path: string;
    caption: string;
    alt: string;
}
export interface Grid {
    columns: 2 | 3 | 4;
    gap: number;
    images: GridImage[];
}
export declare const LANGUAGE = "image-grid-captions";
export declare const PREFIX = "Image Grid Captions Error:\n";
export declare function errorText(error: unknown): string;
/** One embed per line. Captions are plain text, never HTML or size directives. */
export declare function parseGrid(source: string): Grid;
