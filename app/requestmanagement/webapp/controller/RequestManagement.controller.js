sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.requestmanagement.requestmanagement.controller.RequestManagement", {
            onInit: function () {

            },

            createRequest : function(oEvent){
                this.mode = 'CREATE'
                this.onOpenDialog();
            
                this.getView().setModel(new JSONModel({
                    "title": "1231",
                    "descr": "",
                    "impact":1,
                    "prio":"1"
                }), "RequestModel")

            },

            onOpenDialog : function () {

                // create dialog lazily
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "com.requestmanagement.requestmanagement.view.fragments.CreateRequest"
                    });
                } 
                this.pDialog.then(function(oDialog) {
                    oDialog.open();
                });
            },

            saveRequest : function(){

                var fnSuccess = function () {
                    this._setBusy(false);
                    MessageToast.show(this._getText("changesSentMessage"));
                    this._setUIChanges(false);
                }.bind(this);
    
                var fnError = function (oError) {
                    this._setBusy(false);
                    this._setUIChanges(false);
                    MessageBox.error(oError.message);
                }.bind(this);

                if(this.mode == 'CREATE'){
                    
                    this.getView().byId('request_Table').getBinding("items").create(this.getView().getModel("RequestModel").getData());
                    
                }else{
                    const editedData = this.getView().getModel("RequestModel").getData();
                    // const f = this.getView().byId('request_Table').getBinding("items");
                    // this.editingObject = editedData.title;
                    this.editingObject.setProperty('title',editedData.title)
                    
                }
                this.getView().getModel().submitBatch("request_Update").then(fnSuccess, fnError);
                this.cancelDialog();
            },

            cancelDialog : function(){
                this.pDialog.then(function(oDialog) {
                    oDialog.close();
                });
            },

            onEdit: function(oEvent){
                const data = oEvent.getSource().getBindingContext().getObject() ;
                this.onOpenDialog();
                this.mode = 'EDIT';
                this.getView().setModel(new JSONModel({
                    "title": data.title,
                    "descr": data.descr,
                    "impact":data.impact,
                    "prio":data.prio
                }), "RequestModel");
                this.editingObject = oEvent.getSource().getBindingContext();
            },

            onDelete: function(oEvent){
                const oContext = oEvent.getSource().getBindingContext();
		        const title = oContext.getProperty("title");
		        oContext.delete().then(function () {
		            sap.m.MessageToast.show(`Entry ${title} deleted`);
		        }.bind(this), function (oError) {
		            this._setUIChanges();
		            if (oError.canceled) {
		                sap.m.MessageToast.show(this._getText("deletionRestoredMessage", sUserName));
		                return;
		            }
		            MessageBox.error(oError.message + ": " + sUserName);
		        }.bind(this));
            }

            
        });
    });
