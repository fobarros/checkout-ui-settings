// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.
var userIdOnPersonalInfo = {
    init: function init() {
      vtexjs.checkout.getOrderForm().then(function (data) {
        var userId = data.userProfileId;
        $.ajax({
          //the v param is to remove masterdata cache
          url: "/api/dataentities/CL/search/?_where=userId=".concat(userId, "&_fields=epicorAccountID"),
          type: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/vnd.vtex.ds.v10+json"
          }
        }).then(function (data) {
          var epicorAccountId = data[0].epicorAccountID;
          $(".client-profile-summary").append("<div>Account #: ".concat(epicorAccountId, "</div>"));
        });
      });
    }
  };
    
  
  
  var showCompanyName = {
    init: function init() {
      util.onEmailIsSet(function () {
        vtexjs.checkout.getOrderForm().then(function (data) {
          var email = data.clientProfileData.email;
          $.ajax({
            //the v param is to remove masterdata cache
            url: "/api/dataentities/CL/search/?_where=email=".concat(email, "&_fields=corporateName,tradeName"),
            type: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/vnd.vtex.ds.v10+json"
            },
            success: function success(data) {
              var corporateName = !!data[0].corporateName ? data[0].corporateName : "";
              var tradeName = !!data[0].tradeName ? data[0].tradeName : "";
              var hifen = corporateName && tradeName ? "-" : "";
              var content = "".concat(corporateName, " ").concat(hifen, " ").concat(tradeName);
  
              if ($("#corporate-trade-name").length) {
                $("#corporate-trade-name").text("".concat(content));
              } else {
                $(".client-profile-email").prepend("<div id=\"corporate-trade-name\">".concat(content, "</div>"));
              }
            }
          });
        });
      });
    }
  };
  
    
  var disablePersonalInfoEditButton = {
    init: function init() {
      util.waitElement($('#edit-profile-data'), function () {
        $('#edit-profile-data').remove();
        $("#is-not-me").remove();
      });
    }
  };
  
  
  var poNumberFeature = {
    showInputOnPOSection: false,
    init: function init() {
      poNumberInput.init();
      fakeSubmitButton.init();
      util.onPageStopLoading(function () {
        if (poNumberFeature.showInputOnPOSection) {
          $('.box-payment-group2.box-payment-option.custom201PaymentGroupPaymentGroup').append(poNumberInput.input);
        } else {
          $(".payment-submit-wrap").append(poNumberInput.input);
        }
        
        originalSubmitButton.hide();
        $(".payment-submit-wrap").append(fakeSubmitButton.btn);
      });
      util.waitElement($("#payment-data-submit"), function () {
      });
    }
  };
        
        
  var fakeSubmitButton = {
    btn: null,
    init: function init() {
      fakeSubmitButton.btn = fakeSubmitButton.buildButton();
      fakeSubmitButton.btn.on("click", function () {
        var poIsEmpty = $("#poNumberInput")[0].value === "";
        
        theCheckout.handleSubmit();
      });
    },
    buildButton: function buildButton() {
      return $("<button class=\"jsSubmitFakeButton btn btn-success btn-large btn-block\">\n        <i class=\"icon-lock\"></i>\n        <i class=\"icon-spinner icon-spin\" style=\"display: none;\"></i>\n        <span>Complete Order</span>\n      </button>");
    },
    hideLoadingAndResetButton: function hideLoadingAndResetButton() {
      fakeSubmitButton.btn.find("i.icon-spinner").hide();
      fakeSubmitButton.btn.find("i.icon-lock").show();
      fakeSubmitButton.enableButton();
    },
    setButtonAsLoading: function setButtonAsLoading() {
      fakeSubmitButton.btn.find("i.icon-lock").hide();
      fakeSubmitButton.btn.find("i.icon-spinner").show();
      fakeSubmitButton.disableButton();
    },
    disableButton: function disableButton() {
      fakeSubmitButton.btn.attr("disabled", "");
    },
    enableButton: function enableButton() {
      fakeSubmitButton.btn.removeAttr("disabled");
    }
  };
  var originalSubmitButton = {
    hide: function hide() {
      $("[id=payment-data-submit]").css("visibility", "hidden");
      $("[id=payment-data-submit]").css("max-height", "0");
      $("[id=payment-data-submit]").css("height", "0");
      $("[id=payment-data-submit]").addClass("jsSubmitButton");
    }
  };
  var poNumberInput = {
    input: null,
    init: function init() {
      poNumberInput.input = poNumberInput.buildInput();
    },
    buildInput: function buildInput() {
      return $("\n        <div style=\"\n          padding-right: 15px;\n          margin-bottom: 10px;\n        \" id=\"poWrap\">\n        <label> Purchase Order Number: (optional) </label>\n          <input \n            type=\"text\"\n            id=\"poNumberInput\" style=\"\n            font-size: 20px;\n            height: 36px;\n            line-height: 34px;\n            width: 100%;\" \n            name=\"poNumber\">\n          <span class=\"help error feedback\" style=\"display: none\">This field is required.</span>\n        </div>");
    },
    showError: function showError() {
      $("#poNumberInput").addClass("error");
      $("#poWrap").find(".feedback").show();
    },
    hideError: function hideError() {
      $("#poNumberInput").removeClass("error");
      $("#poWrap").find(".feedback").hide();
    },
    handleEmpty: function handleEmpty() {
      poNumberInput.showError();
      $("#poNumberInput").on("keypress", poNumberInput.hideError);
    }
  };
  
  var util = {
    waitElement: function waitElement(selector, fn) {
      var element = setInterval(function () {
        if ($(selector).length) {
          clearInterval(element);
          fn();
        }
      }, 200);
    },
    onOrignalButtonStopLoading: function onOrignalButtonStopLoading(fn) {
      var internal = setInterval(function () {
        if (!!!$(".jsSubmitButton").prop("disabled")) {
          clearInterval(internal);
          fn();
        }
      }, 200);
    },
    onPageStopLoading: function onPageStopLoading(fn) {
      var internal = setInterval(function () {
        if (!$("body.loading").length) {
          clearInterval(internal);
          fn();
        }
      }, 200);
    },
    onEmailIsSet: function onEmailIsSet(fn) {
      var internal = setInterval(function () {
        if (!!$(".client-profile-email span.email").text()) {
          clearInterval(internal);
          fn();
        }
      }, 200);
    }
  };
  
  var theCheckout = {
    submit: function submit() {
      $("#payment-data-submit").click();
    },
    handleSubmit: function handleSubmit() {
      var poNumber = {
        value: $("#poNumberInput")[0].value
      };
      fakeSubmitButton.setButtonAsLoading();
      util.onOrignalButtonStopLoading(function () {
        fakeSubmitButton.enableButton();
        fakeSubmitButton.hideLoadingAndResetButton();
      });
      vtexjs.checkout.getOrderForm().then(function (data) {
        console.log("here: "+poNumber.value);
        
        if(!!poNumber.value) {
          
          $.ajax({
            type: "PUT",
            url: "/api/checkout/pub/orderForm/".concat(data.orderFormId, "/customData/profile/poNumber"),
            data: poNumber,
            dataType: "json"
          }).then(theCheckout.submit);
          
        } else {
          
          theCheckout.submit();
          
        }
      });
    }
  };
  
  $(window).on("checkoutRequestBegin.vtex", function (event, orderForm) {
    fakeSubmitButton.setButtonAsLoading();
    
    //showCompanyName.init();
    
    setTimeout(function () {
      fakeSubmitButton.hideLoadingAndResetButton();
    }, 1000);
  });
  
  
  $(document).ready(function () {
    poNumberFeature.init();
    userIdOnPersonalInfo.init();
    disablePersonalInfoEditButton.init();
  });
  
  /*
  // WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.
  $(document).ready(function() {
    removeShipChanges();
    
    $(window).on("orderFormUpdated.vtex", function(evt, orderForm) {
      removeShipChanges();
    });
  });*/