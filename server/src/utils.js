const sleep = time => new Promise((resolve) => {
  setTimeout(() => resolve(), time);
});

const isDev = () => process.env.NODE_ENV !== 'production';


export { sleep, isDev };
