'use strict';

angular.module('dluploaderFileApp')
    .directive('dluploader', function(dluploader) {

        var files = [];
        return {
            templateUrl: 'views/directives/dluploader.html',
            controller: 'MainCtrl',
            restrict: 'E',
            scope: {
                multiple: '=',
                fullscreen: '=',
                droppable: '=',
                autoupload: '='
            },
            link: function postLink(scope, element) {

                scope.singleFile = false;
                scope.dluploaderFiles = null;
                scope.selectedFiles = [];
                scope.notifications = [];
                scope.thereAreToUpload = false;

                scope.cancelAll = function() {
                    dluploader.cancelAll();
                };

                scope.setFiles = function(dropFiles) {
                    scope.thereAreToUpload = true;

                    if (dropFiles) {
                        scope.selectedFiles = dropFiles;
                    } else {
                        scope.selectedFiles = angular.element('#dluploader')[0].files;
                    }

                    if (!scope.multiple && scope.selectedFiles.length > 1) {
                        console.info('error:', 'Configuration is for single file.');

                    } else {
                        angular.forEach(scope.selectedFiles, function(file) {
                            var object = {
                                file: file,
                                progress: 0,
                                canceled: false,
                                message: null,
                                completed: false
                            };

                            var insert = dluploader.addToCache(object);
                            if (insert) {
                                files.push(object);
                            } else {
                                console.log('Notice:', 'File "' + file.name + '" exist on list');
                            }
                        });
                    }

                    scope.inputFiles = dluploader.getCache();
                    scope.$apply();

                    if (scope.autoupload !== undefined && scope.autoupload) {
                        scope.startUpload();
                    }
                };

                scope.startUpload = function() {
                    scope.thereAreToUpload = false;
                    dluploader.uploadFile(files).then(function(message) {
                        if (message) {
                            scope.notifications.push(message);
                        } else {
                            scope.notifications.push('An error has ocurred');
                        }
                    });

                    files = [];

                };

                scope.resetUpload = function() {
                    files = [];
                    scope.inputFiles = [];
                    dluploader.clearCache();
                };

              function droppableZoneON() {
                if (!!scope.fullscreen && scope.droppable) {
                  scope.showFullScreen = true;
                } else if(!(!!scope.fullscreen) && scope.droppable) {
                  scope.showDroppable = true;
                }
                scope.$apply();
              }

              function droppableZoneOFF() {
                if (!!scope.fullscreen && scope.droppable) {
                  scope.showFullScreen = false;
                } else if(!(!!scope.fullscreen) && scope.droppable) {
                  scope.showDroppable = false;
                }
                scope.$apply();
              }

                function dragEnter(event) {
                  droppableZoneON();
                    event.stopPropagation();
                    event.preventDefault();
                }

                function dragLeave(event) {
                  droppableZoneOFF();
                    event.stopPropagation();
                    event.preventDefault();
                }

                function dragOver(event) {
                  droppableZoneON();
                    event.stopPropagation();
                    event.preventDefault();

                }

                function drop(event) {

                  droppableZoneOFF();
                    if (event.dataTransfer.files.length > 0) {
                        scope.setFiles(event.dataTransfer.files);
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }

                if (scope.multiple === true) {
                    element.find('input[type=\'file\']').attr('multiple', '');
                }

                if (scope.droppable === true) {
                    element.find('input[type=\'file\']').addClass('droppable');
                }

                if (scope.fullscreen === true && scope.droppable) {
                    var dropbox = element[0];
                    var dropboxBody = document.getElementsByTagName('body')[0];

                    dropboxBody.addEventListener('dragenter', dragEnter, false);
                    dropbox.addEventListener('dragleave', dragLeave, false);
                    dropboxBody.addEventListener('dragover', dragOver, false);
                    dropbox.addEventListener('drop', drop, false);
                }

              if (scope.fullscreen !== true && scope.droppable) {
                var dropBox = document.getElementsByClassName('droppable-zone')[0];

                dropBox.addEventListener('dragenter', dragEnter, false);
                dropBox.addEventListener('dragleave', dragLeave, false);
                dropBox.addEventListener('dragover', dragOver, false);
                dropBox.addEventListener('drop', drop, false);
              }
            }
        };
    });
