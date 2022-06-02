sap.ui.define(["sap/sf/workflow/returntoworkplace_employee/controller/BaseController", "sap/m/WizardStep", "sap/ui/core/mvc/XMLView", "sap/ui/model/json/JSONModel", "sap/ui/core/HTML"], function (e, t, i, s, a) {
    "use strict";
    const o = "Insertion---app--employeeLastPageSurveyLink";
    return e.extend("workzone2.workzonehr.sap.sf.workflow.returntoworkplace_employee.controller.Main", {
        onInit: async function () {
            this.card = this.getOwnerComponent().card;
            let e = this.getParameters().vaccineStepEnable.value;
            let s = this.byId("rtwMainFlowWizard");
            this.getGlobalModel().setProperty("/stepId", {});
            this.getGlobalModel().getProperty("/steps").forEach(a => {
                if (!e && a.id === "completeVaccineCheck") {
                    return true
                }
                let o = new t(this.createId(a.id), a.settings);
                this.getGlobalModel().setProperty(`/stepId/${a.id}`, this.createId(a.id));
                o.attachComplete(this.completeWizardStep, this);
                o.cacheId = a.id;
                s.addStep(o);
                i.create({
                    viewName: a.view
                }).then(e => {
                    e.cacheId = a.id;
                    e.step = o;
                    o.stepView = e;
                    a.contentView = e;
                    e.placeAt(o)
                })
            });
            this.updateFlowStateByCache();
            let n = new a;
            n.setContent(`<div id="${o}" />`);
            this.byId("insertionPosition").addItem(n)
        },
        uuid: -1,
        wfInstanceId: null,
        updateFlowStateByCache: async function () {
            let e = new s;
            e.setProperty("/canReturn", false);
            let t = this.byId("wizardStartButton");
            t.setModel(e, "btnModel");
            t.setBusy(true);
            let i = this.card.getCombinedParameters().loginUser;
            await this.card.request({
                url: `{{destinations.wfDestination}}/rest/v1/workflow-instances?definitionId=returnToWorkplaceEmployeeFlow&businessKey=${i}&$orderby=startedAt&$top=1&status=RUNNING,COMPLETED`,
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }).then(e => {
                if (Array.isArray(e) && e.length > 0) {
                    if (e[0].status === "RUNNING") {
                        this.wfInstanceId = e[0].id
                    } else if (e[0].status === "COMPLETED") {
                        this.byId("wizardNavContainer").to(this.byId("completedPage"))
                    }
                }
            }).catch(e => {
                this.loadError()
            });
            if (this.wfInstanceId) {
                this.card.request({
                    url: `{{destinations.wfDestination}}/rest/v1/workflow-instances/${this.wfInstanceId}/context`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then(i => {
                    this.uuid = i.uuid;
                    if (!i.cache) {
                        i.cache = {}
                    }
                    this.getGlobalModel().setProperty("/cache", i.cache);
                    e.setProperty("/canReturn", true);
                    t.setBusy(false)
                }).catch(e => {
                    this.loadError()
                })
            } else {
                t.setBusy(false)
            }
        },
        loadError: function () {
            let e = this.byId("loadError");
            let t = this.byId("startBox");
            e.setVisible(true);
            t.setVisible(false)
        },
        navigateToWizardContentPage: function () {
            this.byId("wizardNavContainer").to(this.byId("wizardContentPage"))
        },
        completeWizardStep: function (e) {
            let t = e.getSource().stepView;
            t.getController().beforeStepComplete();
            this.getGlobalModel().setProperty("/cache/currentStep", e.getSource().cacheId);
            let i = {
                workflowInstanceId: this.wfInstanceId,
                definitionId: "msgPayload",
                context: {
                    uuid: this.uuid,
                    tmpCache: this.getGlobalModel().getProperty("/cache")
                }
            };
            this.card.request({
                url: `{{destinations.wfDestination}}/rest/v1/messages`,
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                parameters: i,
                withCredentials: true
            })
        },
        completeWizard: function () {
            this.getGlobalModel().getProperty("/steps").forEach(e => {
                let t = e.contentView;
                if (t) {
                    t.getController().beforeWizardComplete()
                }
            });
            let e = {
                workflowInstanceId: this.wfInstanceId,
                definitionId: "msgPayload",
                context: {
                    uuid: this.uuid,
                    shutdown: true
                }
            };
            this.card.request({
                url: `{{destinations.wfDestination}}/rest/v1/messages`,
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                parameters: e,
                withCredentials: true
            });
            this.byId("wizardNavContainer").to(this.byId("completedPage"))
        },
        navToCompletePage: function (e) {
            if (e.getParameters().to === this.byId("completedPage")) {
                let e = this.getParameters();
                let t = e.lastPageQualtricsURL.value;
                if (t) {
                    window.QSI = undefined;
                    this.renderQualtrics(t)
                } else {
                    this.byId("DynamicSideContent").setShowSideContent(false)
                }
            }
        },
        renderQualtrics: function (e) {
            setTimeout(() => {
                this.embedWebsiteFeedbackStarter(e, o)
            }, 200)
        }
    })
});