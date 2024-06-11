using { cap_tutorial as db } from '../db/data-model';

service CatalogService @(path:'/CatalogService') {
    entity SalesOrders as projection on db.SalesOrders;
    entity SalesOrderItems as projection on db.SalesOrderItems;
}
