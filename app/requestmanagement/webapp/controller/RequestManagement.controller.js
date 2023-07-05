sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("com.requestmanagement.requestmanagement.controller.RequestManagement", {
            onInit: function () {

            },

            createRequest : function(oEvent){
                this.mode = 'CREATE'
                this.onOpenDialog();
            
                this.getView().setModel(new JSONModel({
                    "title": "",
                    "descr": "",
                    "impact":1,
                    "priority":"1"
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
                    MessageToast.show("Information Updated");
                }.bind(this);
    
                var fnError = function (oError) {
                    MessageBox.error(oError.message);
                }.bind(this);

                if(this.mode == 'CREATE'){
                    const data = this.getView().getModel("RequestModel").getData();
                    data.impact = parseInt(data.impact);
                    this.getView().byId('request_Table').getBinding("items").create(data);
                    
                }else{
                    const editedData = this.getView().getModel("RequestModel").getData();
                    
                    this.editingObject.setProperty('title',editedData.title)
                    this.editingObject.setProperty('descr',editedData.descr)
                    this.editingObject.setProperty('impact',parseInt(editedData.impact))
                    this.editingObject.setProperty('priority',editedData.priority)

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
                    "priority":data.priority
                }), "RequestModel");
                this.editingObject = oEvent.getSource().getBindingContext();
            },

            onDelete: function(oEvent){
                const oContext = oEvent.getSource().getBindingContext();
		        const title = oContext.getProperty("title");
		        oContext.delete().then(function () {
		            MessageToast.show(`Entry ${title} deleted`);
		        }.bind(this), function (oError) {
		            MessageToast.error(oError.message + ": " + title);
		        }.bind(this));
            }

            
        });
    });
