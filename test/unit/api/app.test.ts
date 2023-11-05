import { app } from "../../../src/api/app";
import * as api from '../../../src/api/requestHandlers';

describe('app', () => {
  const routes = (app._router.stack as any[]).filter((route) => route.name === 'bound dispatch');

  const getRequestHandlers = (routeStack: any[]) => {
    // filter out built-in handlers
    return routeStack.filter((handler) => handler.name !== 'middleware').map((handler) => handler.handle);
  };

  it('contains the correct configuration', () => {
    const jsonParserHandler = (app._router.stack as any[]).find((route) => route.name === 'jsonParser');

    expect(jsonParserHandler).toBeDefined();
    expect(app.settings['x-powered-by']).toEqual(false);
  });

  it('contains the correct routes', () => {
    expect(routes).toHaveLength(7);
  });

  it('contains a route to log in', () => {
    const route = routes.find(({ route }) => route.path === '/session' && route.methods.post);
    expect(route).toBeDefined();
    expect(route.route.methods).toEqual({ post: true });

    const requestHandlers = getRequestHandlers(route.route.stack);
    expect(requestHandlers).toStrictEqual([api.validateRequest, api.logIn, api.createSession]);
  });

  it('contains a route to log out', () => {
    const route = routes.find(({ route }) => route.path === '/session' && route.methods.delete);
    expect(route).toBeDefined();
    expect(route.route.methods).toEqual({ delete: true });

    const requestHandlers = getRequestHandlers(route.route.stack);
    expect(requestHandlers).toStrictEqual([api.validateRequest, api.authenticateRefresh, api.logOut]);
  });

  it('contains a route to refresh the session', () => {
    const route = routes.find(({ route }) => route.path === '/session' && route.methods.put);
    expect(route).toBeDefined();
    expect(route.route.methods).toEqual({ put: true });

    const requestHandlers = getRequestHandlers(route.route.stack);
    expect(requestHandlers).toStrictEqual([api.validateRequest, api.authenticateRefresh, api.refreshSession, api.createSession]);
  });

  it('contains a route to register', () => {
    const route = routes.find(({ route }) => route.path === '/user' && route.methods.post);
    expect(route).toBeDefined();
    expect(route.route.methods).toEqual({ post: true });

    const requestHandlers = getRequestHandlers(route.route.stack);
    expect(requestHandlers).toStrictEqual([api.validateRequest, api.register, api.logIn, api.createSession]);
  });

  it('contains a route to get user details', () => {
    const route = routes.find(({ route }) => route.path === '/user' && route.methods.get);
    expect(route).toBeDefined();
    expect(route.route.methods).toEqual({ get: true });

    const requestHandlers = getRequestHandlers(route.route.stack);
    expect(requestHandlers).toStrictEqual([api.authenticateAccess, api.getUserDetails]);
  });

  it('contains a route to update user details', () => {
    const route = routes.find(({ route }) => route.path === '/user' && route.methods.put);
    expect(route).toBeDefined();
    expect(route.route.methods).toEqual({ put: true });

    const requestHandlers = getRequestHandlers(route.route.stack);
    expect(requestHandlers).toStrictEqual([api.validateRequest, api.authenticateAccess, api.updateUserDetails]);
  });

  it('contains a route to update password', () => {
    const route = routes.find(({ route }) => route.path === '/user/password' && route.methods.put);
    expect(route).toBeDefined();
    expect(route.route.methods).toEqual({ put: true });

    const requestHandlers = getRequestHandlers(route.route.stack);
    expect(requestHandlers).toStrictEqual([api.validateRequest, api.authenticateAccess, api.updatePassword, api.createSession]);
  });
});
