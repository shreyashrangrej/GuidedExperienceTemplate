sap.ui.define(
  [
    "sap/sf/workflow/returntoworkplace_employee/controller/BaseController",
    "sap/ui/model/json/JSONModel"
  //  "sap/m/MessageBox",
  ],
  function (BaseController, JSONModel) {
    "use strict";

    const KEY_SEPARATOR = "|";
    var pollingId = -1;

    return BaseController.extend("workzone2.workzonehr.sap.sf.workflow.returntoworkplace_employee.completeLearningCourses.completeLearningCourses",
      {
        onInit: function () {
          console.info("step3");
          let model = new JSONModel();
          this.getView().setModel(model);
          model.setProperty("/mandatoryCourses", []);
          model.setProperty("/optionalCourses", []);
          let selectedCourses = this.getSelectedCourses();
          console.log("###0 selectedCourses:", selectedCourses);

          clearInterval(pollingId);
          pollingId = setInterval(this.initCourses.bind(this), 10000, selectedCourses);
        },

        initCourses: function (selectedCourses) {
          let model = this.getView().getModel();

          return Promise.all([this.fetchCourseDetails(selectedCourses), this.fetchCourseRatings(selectedCourses)])
          .then((aData) => {       
            let courses = [aData[0].mandatoryCourses, aData[0].optionalCourses];
            let ratings = aData[1];
            
            //Assembly the result before updating the model
            console.log("###3-Found mandatory: " + courses[0].length + "||Found optional: " + courses[1].length);
            courses.forEach(courseList => {
              courseList.forEach(item => {
                item.dueDate = this.handleDueDate(item);
                item.itemThumbnailURI = this.handleDefaultImage(item);
                item.ratings = this.handleCourseRating(item, ratings);
              });  
            });
            console.log("###3-Finished Assembly: ", courses);

            // Clear polling when there is no courses left
            if (!courses[0].length && !courses[1].length) {
              clearInterval(pollingId);
            }
            // 1.No Mandatory course.
            // 2.MDF configuration is correct.
            if (!courses[0].length 
            && this.getGlobalModel().getProperty("/mdfObjConfigCorrect") !== false) {
              this.getView().step.setValidated(true);
              this.getGlobalModel().setProperty("/MandatoryCourseComplete", true);
            }

            //update courses model
            model.setProperty("/mandatoryCourses", courses[0]);
            model.setProperty("/optionalCourses", courses[1]);
          })
          .catch((error) => {
            console.error("###0-Error in initCourses: ", error);
          });
        },

        beforeStepComplete: function () {
          //clear polling when click Complete button
          clearInterval(pollingId);
        },

        /**
         * Method to fetch the details of picked mandatory/optional courses using EML API
         **/
        fetchCourseDetails: function (pickedCourses) {
          if (!pickedCourses.length) {
            return {
              mandatoryCourses: [],
              optionalCourses: []
            };
          }
          return this.getOwnerComponent().card.request({
            url: "{{destinations.sfDestination}}/rest/experience/workzone/v1/EligibleEmployeeCourses",
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            parameters: pickedCourses,
            withCredentials: true,
          })
          .then((result) => {
            console.log("###2-PickedCourses: ", result);
            return result;
          })
          .catch((error) => {
            console.error("###2-Error in fetchCourseDetails: ", error);
            //this.getMessageBox4APIError();
            //clearInterval(pollingId);
          });
        },

        /**
         * Method to fetch Ratings of the course with rating enabled using EML API
         **/
        fetchCourseRatings: function (pickedCourses){
          if (!pickedCourses.length) {
            return [];
          }
          return this.getOwnerComponent().card
            .request({
              url: "{{destinations.sfDestination}}/rest/experience/workzone/v1/EligibleEmployeeCourses/Ratings",
              method: "POST",
              headers: {
                "content-type": "application/json"
              },
              parameters: pickedCourses,
              withCredentials: true
            })
            .then((result) => {
              console.log("###1-Ratings: ", result);
              return result;
            })
            .catch((error) => {
              console.error("###1-Error in fetchCourseRating: ", error);
              return [];
            });
        },

        onPressActionButton: function (event) {
          const path = event.getSource().getBindingContext().getPath();
          const item = this.getView().getModel().getProperty(path);
          console.log("itemDetailsDeeplink", item);
          const url = item.itemDetailsDeeplink;
          console.log(url);
          window.open(url, "_blank");
        },
        /**
         * Method to handle the due date:
         * Logic: 1) if the daysRemaining is null, mark it as 'Due Anytime',
         *        2) if it is a negative number, it means this course is 'Overdue'.
         *        3) Otherwise, display the actual required date as Due Date
         **/
        handleDueDate: function (oNode) {
          const daysRemaining = oNode.daysRemaining;
          const requiredDate = oNode.requiredDate;

          const i18n = this.getI18nResource();
          const overdueText = i18n.getText("COMPLETE_LEARNING_COURSE_STEP_OVERDUE");
          const dueAnytimeText = i18n.getText("COMPLETE_LEARNING_COURSE_STEP_DUE_ANYTIME");

          let requiredDateText = "";
          let requiredDateStatus = "None";

          if (daysRemaining === null) {
            requiredDateText = dueAnytimeText;
          } else if (daysRemaining <= 0) {
            requiredDateText = overdueText;
            requiredDateStatus = "Error";
          } else {
            let oFormat = sap.ui.core.format.DateFormat.getInstance();
            requiredDateText = i18n.getText("COMPLETE_LEARNING_COURSE_STEP_DUE_DATE", [oFormat.format(new Date(requiredDate))]);
          }
          return {
            requiredDateText: requiredDateText,
            requiredDateStatus: requiredDateStatus
          };
        },

        /**
         * Method to handle the default image per classification for learning item if image is not provided
         **/
        handleDefaultImage: function (oNode) {
          let thumbnailURI = oNode.itemThumbnailURI;
          const cpnt_classification = oNode.itemClassification;
          const pathToImages = "sap/sf/workflow/returntoworkplace_employee/completeLearningCourses/img/";

          if (thumbnailURI === null) {
            switch (cpnt_classification) {
              case "CONTINUOUS ONLINE ACCESS":
                thumbnailURI = sap.ui.require.toUrl(pathToImages + "Online/280444_GettyImages-525975242_low.jpg");
                break;
              case "EXTERNAL-COURSE":
                thumbnailURI = sap.ui.require.toUrl(pathToImages + "External/280863_GettyImages-602323633_full_low.jpg");
                break;
              case "TIME-BASED":
                thumbnailURI = sap.ui.require.toUrl(pathToImages + "Instructor-led/280663_GettyImages-168831200_super_low.jpg");
                break;
              case "BLENDED":
                thumbnailURI = sap.ui.require.toUrl(pathToImages + "Blended/280849_GettyImages-595349545_super_low.jpg");
                break;
              case "PROGRAM":
                thumbnailURI = sap.ui.require.toUrl(pathToImages + "Program/276097_276097_l_srgb_s_gl.jpg");
                break;
              default:
                thumbnailURI = sap.ui.require.toUrl(pathToImages + "Other/274574_274574_l_srgb_s_gl.jpg");
            }
          }
          return thumbnailURI;
        },

        /**
         * Method to handle the ratings when it is enabled for the course.
         **/
        handleCourseRating: function (oNode, ratings) {
          const i18n = this.getI18nResource();
          let item = {}; 
          if (oNode.enableRating) {
            //find the rating info and they're not null
            for (let i = 0; i < ratings.length; i++){
              if (ratings[i].keyString === oNode.keyString && ratings[i].isRatingEnabled && ratings[i].totalRating !== null) {
                console.log("###3-Find rating for : " + oNode.keyString);
                item.averageRating = (Math.floor(ratings[i].averageRating * 4) / 4).toFixed(2); //round down to nearest fourth
                item.totalRating = ratings[i].totalRating;
                item.averageRatingTooltip = i18n.getText("LEARNING_COURSE_AVERAGE_RATING_TOOLTIP",[item.averageRating]);
                item.totalRatingTooltip = i18n.getText("LEARNING_COURSE_TOTAL_RATING_TOOLTIP",[item.totalRating]);
                return item;
              }
            }
            console.log("###3-Can't find rating for : " + oNode.keyString);
            return null;
          }
          else {
            return null;
          }
        },

        getSelectedCourses: function () {
          //get selected courses: {itemID}|{itemTypeID}|{revisionDate}
          let mandatoryList = this.getParameters().mandatoryCourses.value;
          let optionalList = this.getParameters().optionalCourses.value;
          console.log("start: mandatory course: " + mandatoryList.length + "||optional course: " + optionalList.length);

          function adjustCourseList(courseList, isMandatory) {
            return courseList.map(it => it.split(KEY_SEPARATOR)).map(it => {
              return {
                itemID: it[0],
                itemTypeID: it[1],
                revisionDate: it[2],
                mandatory: isMandatory
              };});
          }
          mandatoryList = adjustCourseList(mandatoryList,true);
          optionalList = adjustCourseList(optionalList,false);
          return mandatoryList.concat(optionalList);
        }

        /*
        getMessageBox4APIError: function () {
          MessageBox.warning(this.getView().getModel("i18n").getResourceBundle().getText('API_ERROR_INFO'));
        }*/
      }
    );
  }
);
