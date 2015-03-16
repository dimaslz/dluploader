'use strict';

angular.module('dluploaderFileApp')
    .service('dluploader', function($rootScope, $q) {
        var uploadDefer;
        var progress;
        var progressVisible;
        var xml = null;

        var self = this;
        self.inputFiles = null;
        self.config = null;
        var cache = [];

        function init(method, endpoint) {
            $rootScope.method = method;
            $rootScope.endpoint = endpoint;
        }

        function uploadProgress(file, event) {
            progress = (event.lengthComputable) ? Math.round(event.loaded * 100 / event.total) : 'unable to compute';
            file.progress = progress;

            $rootScope.$apply();
            uploadDefer.notify(progress);
        }

        function uploadFailed() {
            uploadDefer.reject('There was an error attempting to upload the file.');
        }

        function uploadCanceled(file) {
            progressVisible = false;

            file.progress = '-';

            uploadDefer.reject('The upload has been canceled by the user or the browser dropped the connection');
        }

        function abortUpload() {
            xml.abort();
            uploadDefer.reject('There was an error attempting to upload the file.');
        }

        function uploadComplete() {
            try {
                uploadDefer.resolve('Finished');
            } catch (e) {
                console.log(e);
            }
        }

        function fileExist(filename) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].file.name === filename) {
                    return true;
                }
            }

            return false;
        }

        function checkSize(filesize) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].file.size === filesize) {
                    return true;
                }
            }

            return false;
        }

        function addToCache(file) {
            var fileFALSEsizeFALSE = !fileExist(file.file.name) && !checkSize(file.file.size);
            var fileTRUEsizeFALSE = fileExist(file.file.name) && !checkSize(file.file.size);
            if (fileFALSEsizeFALSE || fileTRUEsizeFALSE) {
                if (fileTRUEsizeFALSE) {
                    removeElementFromCache(file.file.name);
                }
                cache.push(file);

                return getCache();
            }

            return false;
        }

        function getCache() {
            return cache;
        }

        function removeElementFromCache(elem) {
            for (var i = 0; i < cache.length; i++) {
                if (cache[i].file.name === elem) {
                    cache.splice(i, 1);
                    return true;
                }
            }

            return false;
        }

        function clearCache() {
            cache = [];
        }

        return {
            init: init,
            addToCache: addToCache,
            getCache: getCache,
            clearCache: clearCache,
            abortUpload: abortUpload,
            uploadFile: function(files) {
                uploadDefer = $q.defer();

                var filesToUpload = files;

                if (filesToUpload.length === 0) {
                    uploadDefer.resolve('');
                    return uploadDefer.promise;
                }

                var dashes = '--';
                var boundary = 'boundaryupload';
                var crlf = '\r\n';

                angular.forEach(filesToUpload, function(file) {
                    var fileReader = new FileReader();

                    fileReader.onerror = function() {
                        removeElementFromCache(file.file.name);
                        $rootScope.inputFiles = getCache();
                        $rootScope.$apply();
                    };
                    fileReader.onload = function(e) {
                        var filename = file.file.name;
                        var xhr = new XMLHttpRequest();
                        xhr.upload.addEventListener('progress', angular.bind(null, uploadProgress, file), false);
                        xhr.addEventListener('load', uploadComplete, false);
                        xhr.addEventListener('error', uploadFailed, false);
                        xhr.addEventListener('abort', uploadCanceled, false);
                        xhr.open($rootScope.method, $rootScope.endpoint + '?file=' + file.file.name, true);
                        var data = dashes + boundary + crlf + 'Content-Disposition: form-data;' + 'name="file";' + 'filename="' + encodeURIComponent(file.file.name) + '"' + crlf + 'Content-Type: ' + file.file.type + crlf + crlf + e.target.result + crlf + dashes + boundary + dashes;
                        xhr.setRequestHeader('Content-Type', 'multipart/form-data;charset=utf-8;boundary=' + boundary);
                        xhr.setRequestHeader('X-FILENAME', encodeURIComponent(filename));

                        if ($rootScope.method === 'POST') {
                            xhr.send(data);
                        } else if ($rootScope.method === 'PUT') {
                            xhr.send(e.target.result);
                        }

                        xml = xhr;
                    };
                    try {
                        fileReader.readAsDataURL(file.file);
                    } catch (err) {
                        console.log('Err: ', err);
                    }
                });

                return uploadDefer.promise;
            }
        };

    });
