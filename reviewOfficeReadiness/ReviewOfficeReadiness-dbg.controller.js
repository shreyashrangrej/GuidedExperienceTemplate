sap.ui.define([
  "sap/sf/workflow/returntoworkplace_employee/controller/BaseController",
  "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
  "use strict";

  return BaseController.extend("workzone2.workzonehr.sap.sf.workflow.returntoworkplace_employee.reviewOfficeReadiness.ReviewOfficeReadiness", {
    onAfterRendering: function () {
      let model = new JSONModel();
      model.loadData(sap.ui.require.toUrl('sap/sf/workflow/returntoworkplace_employee/reviewOfficeReadiness/ReadinessCheckItems.json'), null, false);
      this.prepareItems(model, "/reviewOfficeGuidelines");
      this.prepareItems(model, "/signMandatoryForms");
      model.setProperty("/reviewOfficeGuidelinesTitle", this.getParameters()['reviewOfficeGuidelinesTitle'].value);
      model.setProperty("/signMandatoryFormsTitle", this.getParameters()['signMandatoryFormsTitle'].value);
      this.getView().setModel(model, "items");
    },

    prepareItems: function (model, path) {
      let items = model.getProperty(path);
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      const i18n = this.getI18nResource();
      const params = this.getParameters();
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.checkBoxI18n = i18n.getText(item.checkBoxText);
        let linkText = params[item.id + 'Label'].value;
        item.linkText = linkText;
        item.link = params[item.id + 'URL'].value;
        item.linkVisible = !this.isStringEmpty(item.link);
        if (this.isStringEmpty(item.checkBoxText) && this.isStringEmpty(linkText)) {
          items.splice(i, 1);
        }
        if (cache) {
          item.selected = cache[`${path}/${i}`];
        }
      }
    },

    selectReadinessCheckItem: function (event) {
      if (!this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`)) {
        this.getGlobalModel().setProperty(`/cache/${this.getView().cacheId}`, {});
      }
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      cache[event.getSource().getBindingContext('items').getPath()] = event.getParameter('selected');
    }
  });
});
