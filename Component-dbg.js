sap.ui.define(['sap/ui/core/UIComponent', 'sap/ui/model/json/JSONModel'],
  function (UIComponent, JSONModel) {
    "use strict";

    var Component = UIComponent.extend("workzone2.workzonehr.sap.sf.workflow.returntoworkplace_employee.Component", {

      metadata: {
        manifest: "json"
      },

      init: function () {
        UIComponent.prototype.init.apply(this, arguments);

        let model = new JSONModel();
        model.loadData(sap.ui.require.toUrl('sap/sf/workflow/returntoworkplace_employee/stepmetadata.json'), null, false);
        this.setModel(model, 'global');
      },

      onCardReady: function (card) {
        let cardWrapper = {
          __proto__: card.__proto__,
          request: (config) => {
            if (!config.headers) {
              config.headers = {};
            }
            config.headers["successfactors-employment-id"] = card.getCombinedParameters().loginUser;
            return card.request(config);
          }
        };
        Object.assign(cardWrapper, card);
        this.card = cardWrapper;
      }
    });

    return Component;

  });
