sap.ui.define(["sap/ui/integration/Extension"], function (Extension) {
  "use strict";

  var CompleteLearningCoursesExtension = Extension.extend("workzone2.workzonehr.sap.sf.workflow.returntoworkplace_employee.CompleteLearningCoursesExtension");


  CompleteLearningCoursesExtension.prototype.init = function() {
    Extension.prototype.init.apply(this, arguments);

    this.validated = false;
    this.validatePromise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    }); 
    
  };
  
  //should return a promise
  CompleteLearningCoursesExtension.prototype.checkCanSeeCourses = function () {
    console.log("##Validating... Started? " + this.validated);
    const oCard = this.getCard();
    if (!this.validated) {
      this.validated = true;
      this.requestSearchItem(oCard, this.resolve, this.reject);
    }
    console.log(this.validatePromise);
    return this.validatePromise;
  };

  CompleteLearningCoursesExtension.prototype.requestSearchItem = function (oCard, resolve, reject) {
    oCard
      .request({
        url:
          "{{destinations.lmsDestination}}/learning/odatav4/public/admin/searchItem/v1/Items?$select=itemID&$filter=contains(criteria/itemTitle,'design')&$format=json",
        headers: { "successfactors-employment-id": oCard.getCombinedParameters().loginUser },
        withCredentials: true
      })
      .then((aData) => {
        console.log("###OK in requestSearchItem: " + aData);
       // this.validated = false;
        resolve({
          canSeeCourses: true
        });
      })
      .catch((oError) =>  {
        console.log("###NOK in requestSearchItem: ", oError); 

        if (oError[1].status !== 503) {
          resolve({
            canSeeCourses: false
          });
        } else {
          console.log("###Retry API for 503");
          setTimeout(CompleteLearningCoursesExtension.prototype.requestSearchItem, 1000, oCard, resolve, reject);
        }
      })
      .catch((error) => {
        console.error(error);
        resolve({
          canSeeCourses: false
        });
      })
      .finally(()=> {
        console.log("###End");
    });
  };

  return CompleteLearningCoursesExtension;
});
