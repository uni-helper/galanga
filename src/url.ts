declare const getCurrentPages: () => any[];

export const url = {
  getPath: () => {
    const uniRouter = getCurrentPages();
    const currentRoute = uniRouter[uniRouter.length - 1];
    return '/' + currentRoute.route;
  },
  getQuery: (value: string) => {
    const uniRouter = getCurrentPages();
    const currentRoute = uniRouter[uniRouter.length - 1];
    return currentRoute.$page.options[value];
  },
  getHash: () => {
    return undefined;
  }
}