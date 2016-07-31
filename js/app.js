var app = angular.module('app', ['ngAnimate', 'countrySelect','naif.base64','angular-lodash']);

app.controller('MainCtrl', function($scope,$http,$window,$log) {

  $scope.searchDomainShow = false;
  $scope.seDomainShow = false;
  $scope.nuDomainShow = false;
  $scope.seButtonDisable = false;
  $scope.nuButtonDisable = false;

  $scope.user = {};

  $scope.acceptTermsShow = false;
  $scope.imageDiv = false;
  $scope.checkboxModel = {value : false};

  $scope.showImageDiv = function() {
     $scope.imageDiv = true;
  };

  $scope.searchDomain = _.throttle(function (domain){

    $scope.seButtonDisable = false;
    $scope.nuButtonDisable = false;
    $scope.seDomainShow = false;
    $scope.nuDomainShow = false;
    $scope.searchDomainShow = true;

    if (domain) {

      $http.get('https://domain-production-weld.herokuapp.com/api/domain/' + $scope.user.domain + '.se')
      .then(function(response) {
          //First function handles success (.se domain is available)
          $scope.freeDomainSE = "Välj!";
          $scope.seDomainShow = true;
          var seButton = angular.element(document.querySelector('#seButton'));
          seButton.css('color','#47e2a1');
          $scope.searchDomainNU();

      }, function(response) {
          //Second function handles error (.se domain is not available)
          $scope.freeDomainSE = "Upptagen!";
          $scope.seDomainShow = true;
          var seButton = angular.element(document.querySelector('#seButton'));
          seButton.css('color','#f86060');
          $scope.seButtonDisable = true;
          $scope.searchDomainNU();
      });
    };
  },1000);

  $scope.searchDomainNU = _.throttle(function() {

    if (domain) {

      $http.get('https://domain-production-weld.herokuapp.com/api/domain/' + $scope.user.domain + '.nu')
      .then(function(response) {
          //First function handles success (.nu domain is available)
          $scope.freeDomainNU = "Välj!";
          $scope.nuDomainShow = true;
          var nuButton = angular.element(document.querySelector('#nuButton'));
          nuButton.css('color','#47e2a1');

      }, function(response) {
          //Second function handles error (.nu domain is not available)
          $scope.freeDomainNU = "Upptagen!";
          $scope.nuDomainShow = true;
          var nuButton = angular.element(document.querySelector('#nuButton'));
          nuButton.css('color','#f86060');
          $scope.nuButtonDisable = true;
      });
    };
  },1000);

  $scope.buttonClicked = function(domain,$event) {
      $scope.user.domain = domain;
      if ($event.target.id == "seButton") {
        $scope.termsUrl = "https://www.iis.se/domaner/registrera/se/villkor/";
        $scope.termsDomain = ".SE";
      } else if ($event.target.id == "nuButton") {
        $scope.termsUrl = "https://www.iis.se/docs/terms-and-conditions-nu.pdf";
        $scope.termsDomain = ".NU";
      }
      $scope.searchDomainShow = false;
      $scope.acceptTermsShow = true;
      $scope.CreatePageButton = true;
  }

  $scope.register = function() {
    if ($scope.checkboxModel.value) {
      $scope.user.countrycode = $scope.user.countrycode.split(":").pop();
      $scope.user.tags = ["weekendfestival2016"];

      var data = JSON.stringify($scope.user);

      $http.post('https://weld-staging.herokuapp.com/api/users', data)
      .success(function (data, status, headers, config) {
          $scope.PostDataResponse = data;

          var pageUrl = "https://weld-staging.herokuapp.com/";
          $window.location.href = pageUrl + data.projectSlug;
      })
      .error(function (data, status, headers, config) {
          $scope.ResponseDetails = "Data: " + data +
              "<hr />status: " + status +
              "<hr />headers: " + headers +
              "<hr />config: " + config;
      });
    } else {
      alert("Var vänlig, acceptera villkor");
    }
  };
});

function imageURL(event){
  var imagePath = URL.createObjectURL(event.target.files[0]);
  $('#image-div').css('background-image', 'url(' + imagePath + ')');
}
