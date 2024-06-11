namespace cap_tutorial;

entity SalesOrders {
    @title: 'Sales Order Number'
    key soNumber: String;
    @title: 'Order Date'
    orderDate: Date;
    @title: 'Customer Name'
    customerName: String;
    @title: 'Customer Number'
    customerNumber: String;
    @title: 'PO Number'
    PoNumber: String;
    @title: 'Inquiry Number'
    inquiryNumber: String;
    @title: 'Total Sales Order'
    totalOrderItems: Integer;
    items: Composition of many SalesOrderItems on items.salesOrder = $self;
};

entity SalesOrderItems {
    key ID: UUID;
    productName: String;
    quantity: Integer;
    price: Decimal(10,2);
    salesOrder: Association to SalesOrders;
}
