using { sap.servicerequest.db as app } from '../db/requests-model';

service RequestService {
  entity Request as projection on app.Request;
  entity Category as projection on app.Category;
}