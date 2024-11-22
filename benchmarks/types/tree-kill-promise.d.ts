declare module 'tree-kill-promise' {
  declare function kill(
    pid: number,
    signal?: number | NodeJS.Signals
  ): Promise<void>;

  export = kill;
}
