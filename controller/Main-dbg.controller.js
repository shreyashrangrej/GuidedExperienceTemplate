sap.ui.define([
  "sap/sf/workflow/returntoworkplace_employee/controller/BaseController",
  "sap/m/WizardStep",
  "sap/ui/core/mvc/XMLView",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/HTML"
], function (BaseController, WizardStep, XMLView, JSONModel, HTML) {
  "use strict";
  const qualtricsElementId = 'Insertion---app--employeeLastPageSurveyLink';

  return BaseController.extend("workzone2.workzonehr.sap.sf.workflow.returntoworkplace_employee.controller.Main", {
    onInit: async function () {
      this.card = this.getOwnerComponent().card;

      let vaccineStepEnable = this.getParameters().vaccineStepEnable.value;

      let wizard = this.byId('rtwMainFlowWizard');
      this.getGlobalModel().setProperty('/stepId', {});
      this.getGlobalModel().getProperty('/steps').forEach(step => {
        if (!vaccineStepEnable && step.id === "completeVaccineCheck") {
          return true;
        }
        let wizardStep = new WizardStep(this.createId(step.id), step.settings);
        this.getGlobalModel().setProperty(`/stepId/${step.id}`, this.createId(step.id));
        wizardStep.attachComplete(this.completeWizardStep, this);
        wizardStep.cacheId = step.id;
        wizard.addStep(wizardStep);
        XMLView.create({ 'viewName': step.view }).then(view => {
          view.cacheId = step.id;
          view.step = wizardStep;
          wizardStep.stepView = view;
          step.contentView = view;
          // view.wizardstep = wizardStep;
          view.placeAt(wizardStep);
        });
      });

      this.updateFlowStateByCache();
      let html = new HTML();
      html.setContent(`<div id="${qualtricsElementId}" />`);
      this.byId("insertionPosition").addItem(html);
    },

    uuid: -1,
    wfInstanceId: null,

    updateFlowStateByCache: async function () {
      let model = new JSONModel();
      model.setProperty('/canReturn', false);
      let startButton = this.byId('wizardStartButton');
      startButton.setModel(model, 'btnModel');
      startButton.setBusy(true);
      let loginUser = this.card.getCombinedParameters().loginUser;

      await this.card.request({
        url: `{{destinations.wfDestination}}/rest/v1/workflow-instances?definitionId=returnToWorkplaceEmployeeFlow&businessKey=${loginUser}&$orderby=startedAt&$top=1&status=RUNNING,COMPLETED`,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }).then(r => {
        if (Array.isArray(r) && r.length > 0) {
          if (r[0].status === 'RUNNING') {
            this.wfInstanceId = r[0].id;
          } else if (r[0].status === 'COMPLETED') {
            this.byId('wizardNavContainer').to(this.byId('completedPage'));
          }
        }
      }).catch(e => {
        this.loadError();
      });

      if (this.wfInstanceId) {
        this.card.request({
          url: `{{destinations.wfDestination}}/rest/v1/workflow-instances/${this.wfInstanceId}/context`,
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }).then(r => {
          this.uuid = r.uuid;
          if (!r.cache) {
            r.cache = {};
          }
          // if (r.cache.currentStep) {
          //   wizard.setCurrentStep(this.byId(r.cache.currentStep));
          // }
          this.getGlobalModel().setProperty('/cache', r.cache);
          model.setProperty('/canReturn', true);
          startButton.setBusy(false);
        }).catch(e => {
          this.loadError();
        });
      } else {
        startButton.setBusy(false);
      }
    },
    
    loadError: function () {
      let loadError = this.byId("loadError");
      let startBox = this.byId("startBox");
      loadError.setVisible(true);
      startBox.setVisible(false);
    },

    navigateToWizardContentPage: function () {
      this.byId('wizardNavContainer').to(this.byId('wizardContentPage'));
    },

    completeWizardStep: function (event) {
      let view = event.getSource().stepView;
      view.getController().beforeStepComplete();
      this.getGlobalModel().setProperty('/cache/currentStep', event.getSource().cacheId);
      let msgPayload = {
        workflowInstanceId: this.wfInstanceId,
        definitionId: 'msgPayload',
        context: {
          uuid: this.uuid,
          tmpCache: this.getGlobalModel().getProperty('/cache')
        }
      };
      this.card.request({
        url: `{{destinations.wfDestination}}/rest/v1/messages`,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        parameters: msgPayload,
        withCredentials: true
      });
    },

    completeWizard: function () {
      // Get all view and controller. Then execute the function
      this.getGlobalModel().getProperty('/steps').forEach(step => {
        let view = step.contentView;
        if (view) {
          view.getController().beforeWizardComplete();
        }
      });
      let msgPayload = {
        workflowInstanceId: this.wfInstanceId,
        definitionId: 'msgPayload',
        context: {
          uuid: this.uuid,
          "shutdown": true
        }
      };
      this.card.request({
        url: `{{destinations.wfDestination}}/rest/v1/messages`,
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        parameters: msgPayload,
        withCredentials: true
      });
      this.byId('wizardNavContainer').to(this.byId('completedPage'));
    },

    navToCompletePage: function (event) {
      if (event.getParameters().to === this.byId('completedPage')) {
        let params = this.getParameters();
        let qualtricsWebsiteFeedbackURL = params.lastPageQualtricsURL.value;
        if (qualtricsWebsiteFeedbackURL) {
          window.QSI = undefined;
          this.renderQualtrics(qualtricsWebsiteFeedbackURL);
        } else {
          this.byId('DynamicSideContent').setShowSideContent(false);
        }
      }
    },

    renderQualtrics: function (qualtricsWebsiteFeedbackURL) {
      setTimeout(() => {
        this.embedWebsiteFeedbackStarter(qualtricsWebsiteFeedbackURL, qualtricsElementId);
      }, 200);
    }
  });
});
