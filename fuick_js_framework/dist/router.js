"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
exports.register = register;
exports.match = match;
const routes = {};
function register(path, componentFactory) {
    routes[path] = componentFactory;
}
function match(path) {
    return routes[path];
}
exports.Router = {
    register,
    match,
};
