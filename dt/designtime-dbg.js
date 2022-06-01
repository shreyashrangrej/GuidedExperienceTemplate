sap.ui.define(["sap/ui/integration/Designtime"
], function (Designtime) {
  "use strict";

  var DT = Designtime.extend("workzone2.workzonehr.sap.sf.workflow.returntoworkplace_employee.AdvancedDesigntime");

  /*
  General office guidelines
  Cafeteria guidelines
  Conference room guidelines
  Desk etiquette guidelines
  Parking space guidelines
  Sign mandatory forms
  */

  DT.prototype.create = function () {
    return {
      form: {
        items: {
          "cardTitle": {
            "manifestpath": "/sap.card/header/title",
            "label": "{i18n>CARD_TITLE_LABEL}",
            "type": "string",
            "translatable": true
          },
          "cardSubTitle": {
            "manifestpath": "/sap.card/header/subTitle",
            "label": "{i18n>CARD_SUBTITLE_LABEL}",
            "type": "string",
            "translatable": true
          },
          "completeReturnSurveyParamsGroup": {
            "label": "{i18n>STEP_PREFIX} {i18n>COMPLETE_RETURN_SURVEY_STEP_TITLE}",
            "type": "group"
          },
          "qualtricsURL": {
            "manifestpath": "/sap.card/configuration/parameters/qualtricsURL/value",
            "defaultValue": "",
            "label": "{i18n>COMPLETE_RETURN_SURVEY_PARAM_LABEL_QUALTRICS_URL}",
            "type": "string",
            "translatable": false,
            "visible": true,
            "required": false
          },
          "reviewOfficeReadinessParamsGroup": {
            "label": "{i18n>STEP_PREFIX} {i18n>REVIEW_OFFICE_GUIDELINES_STEP_TITLE}",
            "type": "group"
          },
          "reviewOfficeGuidelinesTitle": {
            "manifestpath": "/sap.card/configuration/parameters/reviewOfficeGuidelinesTitle/value",
            "label": "{i18n>REVIEW_OFFICE_GUIDELINES_CHECKLIST_TITLE_LABEL}",
            "type": "string",
            "translatable": true
          },
          "generalOfficeGuidelinesLabel": {
            "manifestpath": "/sap.card/configuration/parameters/generalOfficeGuidelinesLabel/value",
            "label": "{i18n>CHECKLIST_ITEM_PREFIX} 1",
            "type": "string",
            "cols": 1,
            "translatable": true
          },
          "generalOfficeGuidelinesURL": {
            "manifestpath": "/sap.card/configuration/parameters/generalOfficeGuidelinesURL/value",
            "label": "URL",
            "type": "string",
            "cols": 1
          },
          "cafeteriaGuidelinesLabel": {
            "manifestpath": "/sap.card/configuration/parameters/cafeteriaGuidelinesLabel/value",
            "label": "{i18n>CHECKLIST_ITEM_PREFIX} 2",
            "type": "string",
            "cols": 1,
            "translatable": true
          },
          "cafeteriaGuidelinesURL": {
            "manifestpath": "/sap.card/configuration/parameters/cafeteriaGuidelinesURL/value",
            "label": "URL",
            "type": "string",
            "cols": 1
          },
          "conferenceRoomGuidelinesLabel": {
            "manifestpath": "/sap.card/configuration/parameters/conferenceRoomGuidelinesLabel/value",
            "label": "{i18n>CHECKLIST_ITEM_PREFIX} 3",
            "type": "string",
            "cols": 1,
            "translatable": true
          },
          "conferenceRoomGuidelinesURL": {
            "manifestpath": "/sap.card/configuration/parameters/conferenceRoomGuidelinesURL/value",
            "label": "URL",
            "type": "string",
            "cols": 1
          },
          "deskEtiquetteGuidelinesLabel": {
            "manifestpath": "/sap.card/configuration/parameters/deskEtiquetteGuidelinesLabel/value",
            "label": "{i18n>CHECKLIST_ITEM_PREFIX} 4",
            "type": "string",
            "cols": 1,
            "translatable": true
          },
          "deskEtiquetteGuidelinesURL": {
            "manifestpath": "/sap.card/configuration/parameters/deskEtiquetteGuidelinesURL/value",
            "label": "URL",
            "type": "string",
            "cols": 1
          },
          "parkingSpaceGuidelinesLabel": {
            "manifestpath": "/sap.card/configuration/parameters/parkingSpaceGuidelinesLabel/value",
            "label": "{i18n>CHECKLIST_ITEM_PREFIX} 5",
            "type": "string",
            "cols": 1,
            "translatable": true
          },
          "parkingSpaceGuidelinesURL": {
            "manifestpath": "/sap.card/configuration/parameters/parkingSpaceGuidelinesURL/value",
            "label": "URL",
            "type": "string",
            "cols": 1
          },
          "signMandatoryFormsTitle": {
            "manifestpath": "/sap.card/configuration/parameters/signMandatoryFormsTitle/value",
            "label": "{i18n>SIGN_MANDATORY_FORMS_TITLE_LABEL}",
            "type": "string",
            "translatable": true
          },
          "returnToWorkArrangementsFormLabel": {
            "manifestpath": "/sap.card/configuration/parameters/returnToWorkArrangementsFormLabel/value",
            "label": "{i18n>CHECKLIST_ITEM_PREFIX} 1",
            "type": "string",
            "cols": 1,
            "translatable": true
          },
          "returnToWorkArrangementsFormURL": {
            "manifestpath": "/sap.card/configuration/parameters/returnToWorkArrangementsFormURL/value",
            "label": "URL",
            "type": "string",
            "cols": 1
          },
          "employeeHealthScreeningFormLabel": {
            "manifestpath": "/sap.card/configuration/parameters/employeeHealthScreeningFormLabel/value",
            "label": "{i18n>CHECKLIST_ITEM_PREFIX} 2",
            "type": "string",
            "cols": 1,
            "translatable": true
          },
          "employeeHealthScreeningFormURL": {
            "manifestpath": "/sap.card/configuration/parameters/employeeHealthScreeningFormURL/value",
            "label": "URL",
            "type": "string",
            "cols": 1
          },
          "completeVaccineCheckGroup": {
            "label": "{i18n>STEP_PREFIX} {i18n>COMPLETE_VACCINE_CHECK_TITLE}",
            "type": "group"
          },
          "vaccineStepEnable": {
            "manifestpath": "/sap.card/configuration/parameters/vaccineStepEnable/value",
            "defaultValue": false,
            "type": "boolean",
            "label": "{i18n>ENABLE_VACCINE_STEP_IN_DT}",
            "visualization": {
              "type": "sap/m/Switch",
              "settings": {
                "state": "{currentSettings>value}",
                "customTextOn": "Yes",
                "customTextOff": "No"
              }
            }
          },
          "reviewVaccineGuidanceTitle": {
            "manifestpath": "/sap.card/configuration/parameters/reviewVaccineGuidanceTitle/value",
            "label": "{i18n>REVIEW_VACCINE_GUIDANCE_TITLE}",
            "type": "string",
            "translatable": true,
            "visible": "{items>vaccineStepEnable/value}"
          },
          "companyVaccineGuidanceLabel": {
            "manifestpath": "/sap.card/configuration/parameters/companyVaccineGuidanceLabel/value",
            "label": "{i18n>REVIEW_VACCINE_GUIDANCE_CHECKBOX1}",
            "type": "string",
            "cols": 1,
            "translatable": true,
            "visible": "{items>vaccineStepEnable/value}"
          },
          "companyVaccineGuidanceUrl": {
            "manifestpath": "/sap.card/configuration/parameters/companyVaccineGuidanceURL/value",
            "label": "URL",
            "type": "string",
            "cols": 1,
            "visible": "{items>vaccineStepEnable/value}"
          },
          "updateVaccineStatusTitle": {
            "manifestpath": "/sap.card/configuration/parameters/updateVaccineStatusTitle/value",
            "label": "{i18n>UPDATE_VACCINE_STATUS_TITLE}",
            "type": "string",
            "translatable": true,
            "visible": "{items>vaccineStepEnable/value}"
          },
          "completeLearningCoursesGroup": {
            "label": "{i18n>STEP_PREFIX} {i18n>COMPLETE_LEARNING_COURSES_STEP_TITLE}",
            "type": "group"
          },
          "mandatoryCourses": {
            "manifestpath": "/sap.card/configuration/parameters/mandatoryCourses/value",
            "description": "{i18n>COMPLETE_LEARNING_COURSE_STEP_CONFIG_TOOLTIP}", 
            "label": "{i18n>COMPLETE_LEARNING_COURSE_STEP_MANDATORY_COURSES}",
            "type": "string[]",
            "values": {
              "data": {
                "request": {
                  "url": "{{destinations.lmsDestination}}/learning/odatav4/public/admin/searchItem/v1/Items?$select=itemID,itemTypeID,revisionDate,itemTitle,sourceID&$filter=contains(criteria/itemTitle,'{currentSettings>suggestValue}') and criteria/active eq true&$format=json",
                  "withCredentials": true,
                  "headers": {"successfactors-employment-id": "{context>sap.successfactors/currentUser/id/value}"},
                  "retryAfter": 1
                },
                "path": "/value"
              },
              "item": {
                "text": "{itemTitle}",
                "key": "{itemID}|{itemTypeID}|{revisionDate}",
                "additionalText": "{= ${itemID} !== undefined ? ${itemID} + ', ' +  ${itemTypeID} : ''}" 
              },
              "keySeparator": "|"
            },
            "cols": 2, 
            "validations": [{
              "type": "warning",
              "validate": this.fnValidate
              }] 
          },
          "optionalCourses": {
            "manifestpath": "/sap.card/configuration/parameters/optionalCourses/value",
            "description": "{i18n>COMPLETE_LEARNING_COURSE_STEP_CONFIG_TOOLTIP}", 
            "label": "{i18n>COMPLETE_LEARNING_COURSE_STEP_OPTIONAL_COURSES}",
            "type": "string[]",
            "values": {
              "data": {
                "request": {
                  "url": "{{destinations.lmsDestination}}/learning/odatav4/public/admin/searchItem/v1/Items?$select=itemID,itemTypeID,revisionDate,itemTitle,sourceID&$filter=contains(criteria/itemTitle,'{currentSettings>suggestValue}') and criteria/active eq true&$format=json",
                  "headers": {"successfactors-employment-id": "{context>sap.successfactors/currentUser/id/value}"},
                  "withCredentials": true,
                  "retryAfter": 2
                },
                "path": "/value"
              },
              "item": {
                "text": "{itemTitle}",
                "key": "{itemID}|{itemTypeID}|{revisionDate}",
                "additionalText": "{= ${itemID} !== undefined ? ${itemID} + ', ' +  ${itemTypeID} : ''}" 
              },
              "keySeparator": "|"
            },
            "cols": 2,
            "validations": [{
              "type": "warning",
              "validate": this.fnValidate
              }] 
          },
          "lastPageGroup": {
            "label": "{i18n>LAST_PAGE}",
            "type": "group"
          },
          "lastPageQualtricsURL": {
            "manifestpath": "/sap.card/configuration/parameters/lastPageQualtricsURL/value",
            "defaultValue": "",
            "label": "{i18n>COMPLETE_RETURN_SURVEY_PARAM_LABEL_QUALTRICS_URL}",
            "type": "string",
            "translatable": false,
            "visible": true,
            "required": false
          }                  
        }
      },
      preview: {
        modes: "None"
      }
    };
  };

  DT.prototype.fnValidate = function (value, config, context) {
    //context object contains 2 properties:
    //- requestData
    //  function to request data online
    //- control
    //  current control of the parameter
    return context["requestData"]({
      "data": {
        "extension": {
          "method": "checkCanSeeCourses"
        },
        "path": "/canSeeCourses"
      }
    }).then(function (canSeeCourses){
        console.log("validateResult: " + canSeeCourses + " for " + config.manifestpath);
        if (!canSeeCourses) {
          context["control"].setEditable(false);
        }
        return true;
      });
  };

  return DT;
});
