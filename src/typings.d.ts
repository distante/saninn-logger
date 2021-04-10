declare interface PatchedConsole extends Console {
  fatal: typeof console.error;
}

declare var ____patchedConsoleForSaninnLogger___: PatchedConsole;
