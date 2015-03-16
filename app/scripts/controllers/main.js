'use strict';

angular.module('dluploaderFileApp')
    .controller('MainCtrl', function($scope, dluploader) {
        dluploader.init('POST', 'http://localhost:1234/sites/lab/dluploader/api/uploader.php');
    });
