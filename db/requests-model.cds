namespace sap.servicerequest.db;

using {managed} from '@sap/cds/common';

entity Request : managed{
key ID      : UUID  @(Core.Computed : true);
    title       : String(100);
    prio        : String(5);
    descr       : String;
    category  : Association to Category;
    impact      : Integer;
    criticality : Integer;
}

entity Category : managed {
    key ID       : UUID  @(Core.Computed : true);
    description  : String;
    owner        : String;
    timeline     : String;
    request      : Association to many Request on request.category = $self;
  }

