export interface PatchedConsole extends Console {
  fatal: typeof console.error;
}
