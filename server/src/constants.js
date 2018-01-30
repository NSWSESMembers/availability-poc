export const distantFuture = 2147483647;

export const nowInUTC = () => {
  const d = new Date();
  return Math.round(d.getTime() / 1000);
};
