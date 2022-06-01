sap.ui.define([
  "sap/sf/workflow/returntoworkplace_employee/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/library",
  "sap/m/MessageToast"
], function (BaseController, JSONModel, coreLibrary, MessageToast) {
  "use strict";
  var ValueState = coreLibrary.ValueState;

  return BaseController.extend("workzone2.workzonehr.sap.sf.workflow.returntoworkplace_employee.reviewOfficeReadiness.ReviewOfficeReadiness", {
    onInit: function () {
      this.card = this.getOwnerComponent().card;
      let model = new JSONModel();
      let path = sap.ui.require.toUrl('sap/sf/workflow/returntoworkplace_employee/completeVaccineCheck/VaccineGuidanceCheckItems.json');
      this.getView().setModel(model, "items");
      model.loadData(path, null, false);
      this.items = this.getView().getModel("items").getProperty("/updateVaccineStatus");
      this.selectVaccineStatusItemTemp = this.items[1].picklistItem;
      this.noCacheAndInitAlreadyFlag = false;
      // Get MDF data.
      let loginUser = this.card.getCombinedParameters().loginUser;
      let mdfObject = this.getParameters().mdfObjectVaccine.value;
      model.setProperty("/mdfObjConfigCorrect", true);
      let selectField = this.items.map(e => e.mdfKey).join(',');

      this.card.request({
        url: '{{destinations.sfDestination}}/odata/v2/$batch',
        method: 'POST',
        withCredentials: true,
        batch: {
          vaccine: {
            method: "GET",
            url: `${mdfObject}?$filter=externalCode eq '${loginUser}'&$select=${selectField}`,
            headers: {
              Accept: "application/json"
            }
          }
        }
      }).then(result => result.vaccine)
        .then(r => {
        if (r.d.results.length > 0) {
          // If there is MDF object already, set model the result.
          model.setProperty("/mdfObjectData", r.d.results[0]);
        }
      }).catch((e) => {
        console.error(`MDF Object configuration error`, e);
        // Set the Vaccine Step Input Form invisible.
        model.setProperty("/mdfObjConfigCorrect", false);
        this.getGlobalModel().setProperty("/mdfObjConfigCorrect", false);
      });
    },

    onAfterRendering: function () {
      let model = this.getView().getModel("items");
      this.prepareItems(model, "/reviewVaccineGuidance");
      this.generateInputForm(model, "/updateVaccineStatus");
      model.setProperty("/reviewVaccineGuidanceTitle", this.getParameters()['reviewVaccineGuidanceTitle'].value);
      model.setProperty("/updateVaccineStatusTitle", this.getParameters()['updateVaccineStatusTitle'].value);
      this.checkValidated();
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

    /**
     * Generate the input form. The configuration is set in VaccineGuidanceCheckItems.json
     * If there is workflow cache, we use cache data.
     * If there is no cache but mdf data in Bizx, we use mdf data.
     * If there is no workflow cache and mdf data, we use default.
     * @param {JSONModel} model
     * @param {Property Path} path
     */
    generateInputForm: function(model, path) {
      let items = model.getProperty(path);
      const i18n = this.getI18nResource();
      for (let i = 0; i < items.length; i++) {
        let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
        let item = items[i];
        item.valueState = ValueState.None;
        // Generate Input
        switch (item.type) {
          case 'pickList':
            //Set picklist to model
            item.localizedLabel = i18n.getText(item.label);
            item.picklistItem.forEach(element => {
              element.key = element.externalCode;
              element.text = i18n.getText(element.label);
            });
            if (this.checkCacheExistAndInit()) {
              // If cache exist, set cache to model.
              item.selectedKey = cache[item.id];
            } else if (this.checkMdfObjExist()) {
              let mdfObj = model.getProperty("/mdfObjectData");
              item.selectedKey = mdfObj[item.mdfKey];
              this.initCache(item.id, item.selectedKey);
            } else {
              // Set defualt and set model in the same time.
              item.selectedKey = item.defaultSelectedKey;
              this.initCache(item.id, item.selectedKey);
            }
            break;
          case 'date':
            //Set date label to model
            item.localizedLabel = i18n.getText(item.label);
            if (this.checkCacheExistAndInit(item)) {
              if (cache[item.id]) {
                let dateObj = new Date(cache[item.id]);
                item.dateValue = dateObj;
              }
            } else if (this.checkFieldOfMdfObjExist(item)) {
              let mdfObj = model.getProperty("/mdfObjectData");
              if (mdfObj[item.mdfKey]) {
                let dateMil = mdfObj[item.mdfKey];
                let reg = /[1-9][0-9]*/g;
                let dateObj = new Date(parseInt(dateMil.match(reg)[0]));
                item.dateValue = dateObj;
                this.initCache(item.id, dateObj.valueOf());
              }
            }
            break;
          default:
            console.error("Error type of configuration.");
        }
      }
      this.applyRulesToInputItem();
    },

    /**
     * VaccinatedYet -> yes:
     *   VaccineStatus -> FV:
     *     FirstDoseDate -> enabled
     *     SecondDoseDate -> enabled
     * VaccinatedYet -> yes:
     *   VaccineStatus -> FDV:
     *     FirstDoseDate -> enabled
     *     SecondDoseDate -> disabled
     * VaccinatedYet -> yes:
     *   VaccineStatus -> others such as empty string:
     *     FirstDoseDate -> disabled
     *     SecondDoseDate -> disabled
     * VaccinatedYet -> no:
     *   VaccineStatus -> DC or PD:
     *     FirstDoseDate -> disabled
     *     SecondDoseDate -> disabled
     */
    applyRulesToInputItem: function () {
      let items = this.items;
      let selectVaccineStatusItemTemp = this.selectVaccineStatusItemTemp;
      this.items[1].picklistItem = selectVaccineStatusItemTemp;
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      if (cache['VaccinatedYet'] === 'yes') {
        // Vaccine Status can only be Only First Dose or Fully Vaccinated.
        items[1].picklistItem = items[1].picklistItem.filter(e => e.externalCode === 'FDV' || e.externalCode === 'FV');
        if (cache['VaccineStatus'] === 'FV') {
          // Enable all datepicker when choose FV
          items[2].enabled = true;
          items[3].enabled = true;
        } else if (cache['VaccineStatus'] === 'FDV') {
          // The second DatePicker should be disabled. Cache and model values should be cleared.
          items[2].enabled = true;
          this._clearDatePickerValueAndCache(['SecondDoseDate']);
        } else {
          // Date should be disabled if doesn't choose any vaccine date.
          this._clearDatePickerValueAndCache(['FirstDoseDate', 'SecondDoseDate']);
        }
      }
      if (cache['VaccinatedYet'] === 'no') {
        // Vaccine Status can only be Planned or Declined.
        items[1].picklistItem = items[1].picklistItem.filter(e => e.externalCode === 'PD' || e.externalCode === 'DC');
        // DatePicker should be disabled. Cache and model values should be cleared.
        this._clearDatePickerValueAndCache(['FirstDoseDate', 'SecondDoseDate']);
      }
    },

    /**
     * Disable the datepicker control by ids.
     * @param {Array} datePickerIds datePickerIds you wanted to disable.
     * @private
     */
    _clearDatePickerValueAndCache: function (datePickerIds) {
      let items = this.items;
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      datePickerIds.forEach((id) => {
        cache[id] = null;
        items.filter(e => e.id === id).forEach((item)=>{
          item.enabled = false;
          item.dateValue = null;
        });
      });
    },

    /**
     * Select the checkbox and update the cache.
     * @param {sap.ui.base.Event} event
     */
    selectVaccineCheckItem: function (event) {
      this.checkCacheExistAndInit();
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      cache[event.getSource().getBindingContext('items').getPath()] = event.getParameter('selected');
    },

    /**
     * Init the cache when render the input element.
     * @param {string} cacheKey
     * @param {string} cacheValue
     */
    initCache: function (cacheKey, cacheValue) {
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      cache[cacheKey] = cacheValue;
    },

    /**
     * When the select input changes, update the value in cache.
     * @param {sap.ui.base.Event} event
     * @param {data set when binding this function} Use picklistId to identify the different input.
     */
    updatePicklistCache: function (event, oData) {
      this.checkCacheExistAndInit();
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      let oComboBox = event.getSource();
      let sSelectedKey = oComboBox.getSelectedKey();
      let sValue = oComboBox.getValue();
      if (!sSelectedKey && sValue) {
        oComboBox.setValueState(ValueState.Error);
        cache[oData.pickListId] = null;
      } else {
        oComboBox.setValueState(ValueState.None);
        cache[oData.pickListId] = sSelectedKey;
      }
      this.checkValidated();
      // If VaccinatedYet has been changed, Vaccination Status should be changed too.
      if (oData.pickListId === "VaccinatedYet") {
        this.items[1].selectedKey = "";
        cache['VaccineStatus'] = null;
      }
      this.applyRulesToInputItem();
    },

    /**
     * When the datepicker input changes, update the value in cache.
     * @param {sap.ui.base.Event} event
     * @param {data set when binding this function} Use datePickerId to identify the different input.
     */
    updateDatePickerCache: function (event, oData) {
      this.checkCacheExistAndInit();
      let oDP = event.getSource();
      let bValid = event.getParameter("valid");
      if (!bValid) {
        oDP.setValue("");
      }
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      // Get data by model but not event. Because model date is treat as UTC.
      this.items.filter(e => e.id === oData.datePickerId)
                .forEach(e => cache[oData.datePickerId] = e.dateValue === null ? null : e.dateValue.valueOf());
      /***************** Rule Begin *****************/
      // The second dose date must be after the first one. This is a special rule.
      let firstDate = this.items[2], secondDate = this.items[3];
      if (firstDate.dateValue && secondDate.dateValue && (secondDate.dateValue <= firstDate.dateValue)) {
        firstDate.valueState = ValueState.Error;
        secondDate.valueState = ValueState.Error;
      } else {
        // If either date is set null, remove the error state.
        firstDate.valueState = ValueState.None;
        secondDate.valueState = ValueState.None;
      }
      /****************** Rule End ******************/
      this.checkValidated();
    },

    /**
     * Check if field of cache exist.
     * @param {Input Item} item
     * @returns {boolean}
     */
    checkFieldOfCacheExist: function (item) {
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      return !!cache[item.id];
    },

    /**
     * Check if workflow cache exist. If not, init it.
     * @returns {boolean}
     */
    checkCacheExistAndInit: function () {
      if (this.noCacheAndInitAlreadyFlag) {
        return false;
      }
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      if (!cache || Object.keys(cache).length === 0) {
        this.getGlobalModel().setProperty(`/cache/${this.getView().cacheId}`, {});
        this.noCacheAndInitAlreadyFlag = true;
        return false;
      }
      return true;
    },

    /**
     * Validate the required input value is not null. Also the fields should be valid.
     * If not valid, set Vaccine Step and Last Step false.
     */
    checkValidated: function () {
      let invalid = false;
      this.items.forEach(e => {
        if (e.valueState === ValueState.Error) {
          invalid = true;
        } else if (e.required) {
          if (!this.checkFieldOfCacheExist(e)) {
            invalid = true;
            e.valueState = ValueState.Error;
          }
        }
      });
      let vaccineStep = this.getView().step;
      let lastStepId = this.getGlobalModel().getProperty(`/stepId/completeLearningCourses`);
      let lastStep = this.getOwnerComponent().byId(lastStepId);
      vaccineStep.setValidated(true);
      if (this.getGlobalModel().getProperty("/MandatoryCourseComplete") === true) {
        lastStep.setValidated(true);
      }
      if (invalid) {
        vaccineStep.setValidated(false);
        lastStep.setValidated(false);
      }
    },

    /**
     * Check if field is exist in MDF Object. MDF Object is set in global model by onInit.
     * @param {Input Item} item
     * @returns {boolean}
     */
    checkFieldOfMdfObjExist: function (item) {
      let mdfObj = this.getView().getModel("items").getProperty("/mdfObjectData");
      return !!(mdfObj && mdfObj[item.mdfKey]);
    },

    /**
     * Check if MDF Object exists.
     * @returns {boolean}
     */
    checkMdfObjExist: function () {
      return !!this.getView().getModel("items").getProperty("/mdfObjectData");
    },

    /**
     * Generate the _metadata of MDF Object.
     */
    _generateIdOfMdfObject: function () {
      let loginUser = this.card.getCombinedParameters().loginUser;
      let mdfObject = this.getParameters().mdfObjectVaccine.value;
      let model = this.getView().getModel("items");
      // If user has records, use the records id as current id. The api will only get the latest effective version.
      if (this.checkMdfObjExist()) {
        let mdfObj = model.getProperty("/mdfObjectData");
        this.metadataToPost = mdfObj.__metadata;
      } else {
        let dateId = new Date().toISOString();
        let metaDataId = `effectiveStartDate=datetimeoffset'${dateId}',externalCode='${loginUser}'`;
        this.metadataToPost = {
          "uri": `${mdfObject}(${metaDataId})`,
          "type": `SFOData.${mdfObject}`
        };
      }
    },

    /**
     * Upsert data into mdfObj.
     * The data is from cache. This function may be called in the vaccine step and last step.
     * If there is no cache, no request will be sent.
     * @returns If there is no cache which means there is no update to mdfObj, returns.
     */
    upsertMdfObject: function() {
      if (!this.getParameters().vaccineStepEnable.value
        || !this.getView().getModel("items").getProperty("/mdfObjConfigCorrect")) {
        return;
      }
      this._generateIdOfMdfObject();
      let metadata = this.metadataToPost;
      let postBody = {
        "__metadata": metadata
      };
      let cache = this.getGlobalModel().getProperty(`/cache/${this.getView().cacheId}`);
      if (!cache || Object.keys(cache).length === 0) {
        // If cache is empty, that means:
        // There is no mdf obj and no default value set.
        console.log("No change");
        return;
      }
      let items = this.items;
      items.forEach((item) => {
        if (cache[item.id]) {
          switch (item.type) {
            case 'pickList':
              postBody[item.mdfKey] = cache[item.id];
              break;
            case 'date':
              if (cache[item.id]) {
                postBody[item.mdfKey] = `/Date(${cache[item.id]})/`;
              }
          }
        }
      });
      const i18n = this.getI18nResource();
      let errMsg = i18n.getText("MDFOBJECT_UPSERT_ERROR_MESSAGE");
      this.getOwnerComponent().card.request({
        url: `{{destinations.sfDestination}}/odata/v2/upsert`,
        method: 'POST',
        headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
        withCredentials: true,
        parameters: postBody
      }).then(r => {
        if (r.d[0].status === 'OK') {
          console.log("success");
        } else {
          console.error(r.d[0].message);
          MessageToast.show(errMsg);
        }
      }).catch(e => {
        console.error(e);
        MessageToast.show(errMsg);
      });
    },

    beforeStepComplete: function () {
      this.upsertMdfObject();
    },

    beforeWizardComplete: function () {
      this.upsertMdfObject();
    }
  });
});
