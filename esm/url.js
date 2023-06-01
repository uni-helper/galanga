export const url = {
    getPath: () => {
        const uniRouter = getCurrentPages();
        const currentRoute = uniRouter[uniRouter.length - 1];
        return '/' + currentRoute.route;
    },
    getQuery: (value) => {
        const uniRouter = getCurrentPages();
        const currentRoute = uniRouter[uniRouter.length - 1];
        return currentRoute.$page.options[value];
    },
    getHash: () => {
        return undefined;
    },
    setHash: (value) => {
        return false;
    },
    setPath: (value) => {
        const uniRouter = getCurrentPages();
        const currentRoute = uniRouter[uniRouter.length - 1];
        currentRoute.$page.route = value;
    },
    setQuery: (key, value) => {
        const uniRouter = getCurrentPages();
        const currentRoute = uniRouter[uniRouter.length - 1];
        currentRoute.$page.options[key] = value;
    }
};
