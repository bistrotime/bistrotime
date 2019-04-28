import helmet from 'helmet';

export default (app) => {
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
    },
    upgradeInsecureRequests: true,
    browserSniff: false,
  }));

  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());
};
