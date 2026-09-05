/** Undo the existing Image Captions text hook's bracket escaping inside our fence.
 * It currently scans code blocks too. No dependency on that plugin is required.
 */
export declare function restoreProtectedCaptions(source: string): string;
