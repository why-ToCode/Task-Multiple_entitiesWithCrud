sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, MessageToast, ColumnListItem, Input, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.sap.project1.controller.Home", {
        onInit: function () {
            this._oTable = this.byId("table0");
            this._oItemTable = this.byId("table1");
            this._createReadOnlyTemplates();
            this.rebindTable(this.oReadOnlyTemplate, "Navigation");
            this.rebindItemTable(this.oItemReadOnlyTemplate, "Navigation");

            this.oEditableTemplate = new ColumnListItem({
                cells: [
                    new Input({ value: "{mainModel>soNumber}", change: [this.onInputChange, this] }),
                    new Input({ value: "{mainModel>customerName}", change: [this.onInputChange, this] }),
                    new Input({ value: "{mainModel>customerNumber}", change: [this.onInputChange, this] }),
                    new Input({ value: "{mainModel>PoNumber}", change: [this.onInputChange, this] }),
                    new Input({ value: "{mainModel>inquiryNumber}", change: [this.onInputChange, this] })
                ]
            });

            this.oItemEditableTemplate = new ColumnListItem({
                cells: [
                    new Input({ value: "{mainModel>productName}", change: [this.onItemInputChange, this] }),
                    new Input({ value: "{mainModel>quantity}", change: [this.onItemInputChange, this] }),
                    new Input({ value: "{mainModel>price}", change: [this.onItemInputChange, this] })
                ]
            });
        },

        onOpenAddDialog: function () {
            this.getView().byId("OpenDialog").open();
        },

        onCancelDialog: function () {
            this.getView().byId("OpenDialog").close();
        },

        onCreate: function () {
            var oSo = this.getView().byId("idSo").getValue();
            if (oSo !== "") {
                const oList = this._oTable;
                const oBinding = oList.getBinding("items");
                const oContext = oBinding.create({
                    "soNumber": this.byId("idSo").getValue(),
                    "customerName": this.byId("idCustName").getValue(),
                    "customerNumber": this.byId("idCustomer").getValue(),
                    "PoNumber": this.byId("idPo").getValue(),
                    "inquiryNumber": this.byId("idInqNumber").getValue()      
                });
                oContext.created().then(() => {
                    this.getView().byId("OpenDialog").close();
                });

            } else {
                MessageToast.show("Sales Order Number cannot be blank");
            }
        },

        onCreateItem: function () {
            var oProductName = this.getView().byId("idProductName").getValue();
            if (oProductName !== "") {
                const oList = this._oItemTable;
                const oBinding = oList.getBinding("items");
                const oContext = oBinding.create({
                    "productName": this.byId("idProductName").getValue(),
                    "quantity": this.byId("idQuantity").getValue(),
                    "price": this.byId("idPrice").getValue()
                });
                oContext.created().then(() => {
                    this.getView().byId("OpenItemDialog").close();
                });

            } else {
                MessageToast.show("Product Name cannot be blank");
            }
        },

        onSave: function() {
            this.byId("editModeButton").setVisible(true);
            this.byId("saveButton").setVisible(false);
            this._oTable.setMode(sap.m.ListMode.None);
            this.rebindTable(this.oReadOnlyTemplate, "Navigation");
            this.rebindItemTable(this.oItemReadOnlyTemplate, "Navigation");
        },

        onDelete: function() {
            var oSelected = this.byId("table0").getSelectedItem();
            if (oSelected) {
                var oSalesOrder = oSelected.getBindingContext("mainModel").getObject().soNumber;
                oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
                    MessageToast.show(oSalesOrder + " successfully deleted");
                }.bind(this), function (oError) {
                    MessageToast.show("Deletion error: ", oError);
                });
            } else {
                MessageToast.show("Please select a row to delete");
            }
        },

        onDeleteItem: function() {
            var oSelected = this.byId("table1").getSelectedItem();
            if (oSelected) {
                var oID = oSelected.getBindingContext("mainModel").getObject().ID;
                oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
                    MessageToast.show("Record with ID: " + oID + " successfully deleted");
                }.bind(this), function (oError) {
                    MessageToast.show("Deletion error: ", oError);
                });
            } else {
                MessageToast.show("Please select a row to delete");
            }
        },

        onEditMode: function() {
            this.byId("editModeButton").setVisible(false);
            this.byId("saveButton").setVisible(true);
            this.byId("deleteButton").setVisible(true);
            this.rebindTable(this.oEditableTemplate, "Edit");
            this.rebindItemTable(this.oItemEditableTemplate, "Edit");
        },

        onInputChange: function() {
            this.refreshModel("mainModel");
        },

        onItemInputChange: function() {
            this.refreshModel("mainModel");
        },
        
        refreshModel: function (sModelName, sGroup){
            return new Promise((resolve, reject) => {
                this.makeChangesAndSubmit.call(this, resolve, reject, sModelName, sGroup);
            });
        },

        makeChangesAndSubmit: function (resolve, reject, sModelName, sGroup) {
            const that = this;
            sModelName = "mainModel";
            sGroup = "$auto";
            if (that.getView().getModel(sModelName).hasPendingChanges(sGroup)) {
                that.getView().getModel(sModelName).submitBatch(sGroup).then(oSuccess => {
                    that.makeChangesAndSubmit(resolve, reject, sModelName, sGroup);
                    MessageToast.show("Record updated successfully");
                }, reject)
                .catch(function errorHandler(err) {
                    MessageToast.show("Something went wrong: ", err.message);
                });
            } else {
                that.getView().getModel(sModelName).refresh(sGroup);
                resolve();
            }
        },

        rebindTable: function(oTemplate, sKeyboardMode) {
            this._oTable.bindItems({
                path: "mainModel>/SalesOrders",
                template: oTemplate,
                templateShareable: true
            }).setKeyboardMode(sKeyboardMode);
        },

        rebindItemTable: function(oTemplate, sKeyboardMode) {
            this._oItemTable.bindItems({
                path: "mainModel>/SalesOrderItems",
                template: oTemplate,
                templateShareable: true
            }).setKeyboardMode(sKeyboardMode);
        },

        _createReadOnlyTemplates: function () {
            this.oReadOnlyTemplate = new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Text({ text: "{mainModel>soNumber}" }),
                    new sap.m.Text({ text: "{mainModel>customerName}" }),
                    new sap.m.Text({ text: "{mainModel>customerNumber}" }),
                    new sap.m.Text({ text: "{mainModel>PoNumber}" }),
                    new sap.m.Text({ text: "{mainModel>inquiryNumber}" })
                ]
            });

            this.oItemReadOnlyTemplate = new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Text({ text: "{mainModel>productName}" }),
                    new sap.m.Text({ text: "{mainModel>quantity}" }),
                    new sap.m.Text({ text: "{mainModel>price}" })
                ]
            });
        }
    });
});