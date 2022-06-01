sap.ui.define([
  "sap/sf/workflow/returntoworkplace_employee/controller/BaseController",
  "sap/ui/core/HTML"
], function (BaseController, HTML) {
  "use strict";

  const creativeInsertionPointId = "Insertion---app--employeePreReturnSurveyLink";

  return BaseController.extend("workzone2.workzonehr.sap.sf.workflow.returntoworkplace_employee.completePreReturnSurvey.CompletePreReturnSurvey",
    {
      onInit: function () {
        console.log("[CARD LOG]: initiating Step 1 Page ");
        let params = this.getParameters();
        this._qualtricsURL = params.qualtricsURL.value;
        //this._qualtricsSurveyId = params.qualtricsSurveyId.value;

        let html = new HTML();
        html.setContent(`<div id="${creativeInsertionPointId}" />`);
        this.byId("insertionPosition").addItem(html);
      },
      
      onAfterRendering: function () {
        this.byId("meetingCheckItem").setSelected(this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}/meetingCheckItem`));
        //this.getSurveyDueDateViaAPI();
        this.renderQualtrics();
      },

      onExit: function () {
        window.QSI = undefined;
      },

      /**
       * Method to render Qualtrics survey in workzone
       * 
       * Note: 
       * "Insertion---app--employeePreReturnSurveyLink" is hard-coded 'Creative Insertion Point' defined in Qualtrics Website feedback project
       *   
       * */
      renderQualtrics: function () {
        let qualtricsWebsiteFeedbackURL = this._qualtricsURL;

        if (qualtricsWebsiteFeedbackURL) {
          this.embedWebsiteFeedbackStarter(qualtricsWebsiteFeedbackURL, creativeInsertionPointId);
          let observer = new MutationObserver((mutationsList, observer) => {
            document.getElementById(creativeInsertionPointId).firstChild.style.position = "";
            observer.disconnect();
          });
          observer.observe(document.getElementById(creativeInsertionPointId), { childList: true });
        } else {
          console.log("[CARD LOG]: Survey not rendered");
          return;
        }
      },

      /**
       * Method to call Qualtrics API to get survey due date for given pre return survey id
       *
       * */
      /*
      getSurveyDueDateViaAPI: function () {
        this.byId("displayDueDate").setVisible(false);
        let qualtricsSurveyId = this._qualtricsSurveyId.trim();
        if (qualtricsSurveyId === "") {
          console.log("[CARD LOG]: qualtrics survey id is not provided.");
          return;
        }
        let card = this.getOwnerComponent().card;
        const i18n = this.getI18nResource();
        const dueDateText = i18n.getText('COMPLETE_RETURN_SURVEY_STEP_SURVEY_DUE_DATE');

        card.request({
          url: "{{destinations.qualtricsDestination}}/API/v3/survey-definitions/" + qualtricsSurveyId + "/metadata",
          parameters: {
            $format: "json",
          },
          withCredentials: true
        }).then((r) => {
          const dueDate = r.result.SurveyExpirationDate;
          if (dueDate !== null) {
            const oDateFormat = sap.ui.core.format.DateFormat.getInstance();
            const formatedDate = oDateFormat.format(new Date(dueDate));
            console.log("[CARD LOG]: qualtrics survey expiration date is " + formatedDate);
            this.byId("displayDueDate").setText(dueDateText + " " + formatedDate);
            this.byId("displayDueDate").setVisible(true);
          } else {
            console.log("[CARD LOG]: qualtrics survey expiration date is not defined.");
          }
        }).catch((e) => {
          console.log("[CARD LOG]: error in getting due date " + e.status + " " + JSON.stringify(e));
        });
      }
      */

      selectMeetingCheckItem: function (event) {
        let cache = {
          meetingCheckItem: event.getParameter('selected')
        };
        this.getGlobalModel().setProperty(`/cache/${this.getView().cacheId}`, cache);
      }
    }

  );
});
