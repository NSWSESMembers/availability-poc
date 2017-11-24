// Misc utils
export const capitalizeFirstLetter = string => (
  string[0].toUpperCase() + string.slice(1)
);

export const uuidv4 = () => (
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    /* eslint-disable no-bitwise */
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
    /* eslint-enable no-bitwise */
  })
);
