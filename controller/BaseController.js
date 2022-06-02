sap.ui.define(["sap/ui/core/mvc/Controller"], function (t) {
    "use strict";
    return t.extend("workzone2.workzonehr.sap.sf.workflow.returntoworkplace_employee.controller.BaseController", {
        getParameters: function () {
            return this.getOwnerComponent().getManifestEntry("sap.card").configuration.parameters
        },
        getI18nResource: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle()
        },
        isStringEmpty: function (t) {
            return !t || !t.trim()
        },
        getGlobalModel: function () {
            return this.getOwnerComponent().getModel("global")
        },
        beforeStepComplete: function () {},
        beforeWizardComplete: function () {},
        embedWebsiteFeedbackStarter: function (t, e) {
            let n = "QSI_S_" + t.split("=")[1];
            var r = function (t, n, r, o) {
                this.get = function (t) {
                    for (var t = t + "=", e = document.cookie.split(";"), n = 0, r = e.length; n < r; n++) {
                        for (var o = e[n];
                            " " == o.charAt(0);) o = o.substring(1, o.length);
                        if (0 == o.indexOf(t)) return o.substring(t.length, o.length)
                    }
                    return null
                };
                this.set = function (t, e) {
                    var n = "",
                        n = new Date;
                    n.setTime(n.getTime() + 6048e5);
                    n = "; expires=" + n.toGMTString();
                    document.cookie = t + "=" + e + n + "; path=/; "
                };
                this.check = function () {
                    var e = this.get(r);
                    if (e) e = e.split(":");
                    else if (100 != t) "v" == n && (t = Math.random() >= t / 100 ? 0 : 100), e = [n, t, 0], this.set(r, e.join(":"));
                    else return !0;
                    var o = e[1];
                    if (100 == o) return !0;
                    switch (e[0]) {
                        case "v":
                            return !1;
                        case "r":
                            return o = e[2] % Math.floor(100 / o), e[2]++, this.set(r, e.join(":")), !o
                    }
                    return !0
                };
                this.go = function () {
                    if (this.check()) {
                        var t = document.createElement("script");
                        t.type = "text/javascript";
                        t.src = o;
                        document.getElementById(e) && document.getElementById(e).appendChild(t)
                    }
                };
                this.start = function () {
                    var t = this;
                    "complete" !== document.readyState ? window.addEventListener ? window.addEventListener("load", function () {
                        t.go()
                    }, !1) : window.attachEvent && window.attachEvent("onload", function () {
                        t.go()
                    }) : t.go()
                }
            };
            try {
                new r(100, "r", n, t).start()
            } catch (t) {}
        }
    })
});