'use strict';

describe('Controller: DluploaderCtrl', function () {

  // load the controller's module
  beforeEach(module('dluploaderFileApp'));

  var UploaderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UploaderCtrl = $controller('DluploaderCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(true).toBeTruthy();
    console.log(scope.showFullScreen);
    expect(scope.showFullScreen).toBeFalsy();
  });
});
