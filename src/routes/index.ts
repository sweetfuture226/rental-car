import { ApplicationMiddleware } from './../app/crm/modules/application/index';
import { Application } from 'express';
import crm from '../app/crm/routes/v1';
import shopit from '../app/shopit/routes/v1';
import idemandbeauti from '../app/idemandbeauti/routes/v1';
import tipinapp from '../app/tipinapp/routes/v1';
import quikbarber from '../app/quikbarber/routes/v1';
import quiksession from '../app/quiksession/routes/v1';

export default (app: Application) => {
  app.use('/api/v1', crm);
  app.use('/api/v1/shopit', ApplicationMiddleware.getApplicationDetails('shopit'), shopit);
  app.use('/api/v1/idemandbeauti', ApplicationMiddleware.getApplicationDetails('idemandbeauti'), idemandbeauti);
  app.use('/api/v1/tipinapp', ApplicationMiddleware.getApplicationDetails('tipinapp'), tipinapp);
  app.use('/api/v1/quikbarber', ApplicationMiddleware.getApplicationDetails('quikbarber'), quikbarber);
  app.use('/api/v1/quiksession', ApplicationMiddleware.getApplicationDetails('quiksession'), quiksession);
};
