export const log = (msg: string, ...args: any[]) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${msg}`, ...args);
};
