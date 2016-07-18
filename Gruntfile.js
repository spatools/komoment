﻿'use strict';

module.exports = function (grunt) {
    // Load grunt tasks automatically
    require("jit-grunt")(grunt, {
        nugetpack: "grunt-nuget",
        nugetpush: "grunt-nuget"
    });
    require('time-grunt')(grunt); // Time how long tasks take. Can help when optimizing build times

    var options = {
        dev: grunt.option('dev')
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),
        paths: {
            src: 'src',
            build: 'dist',
            temp: '.temp',
            test: 'test'
        },

        ts: {
            options: {
                target: "es3",
                module: "amd",
                sourceMap: false,
                declaration: false,
                comments: false
            },
            dev: {
                src: "<%= paths.src %>/**/*.ts",
                options: {
                    sourceMap: true
                }
            },
            test: {
                src: "<%= paths.test %>/**/*.ts"
            },
            dist: {
                src: "<%= paths.src %>/**/*.ts",
                dest: "<%= paths.build %>/",
                options: {
                    basePath: '<%= paths.src %>'
                }
            }
        },

        copy: {
            declaration: {
                src: "<%= paths.src %>/base.d.ts",
                dest: "<%= paths.build %>/komoment.d.ts"
            }
        },

        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },
            dev: {
                src: "<%= paths.src %>/**/*.ts"
            },
            test: {
                src: "<%= paths.test %>/**/*.ts"
            }
        },

        connect: {
            test: {
                options: {
                    port: "8080",
                    open: "http://localhost:8080/test/index.html",
                    keepalive: true
                }
            }
        },

        mocha: {
            test: ["<%= paths.test %>/index.html"],
            options: {
                log: true,
                logErrors: true
            }
        },

        clean: {
            dev: [
                "<%= paths.src %>/**/*.d.ts",
                "!<%= paths.src %>/base.d.ts",
                "<%= paths.src %>/**/*.js",
                "<%= paths.src %>/**/*.js.map"
            ],
            test: [
                "<%= paths.test %>/**/*.d.ts",
                "!<%= paths.test %>/_test.d.ts",
                "<%= paths.test %>/**/*.js",
                "<%= paths.test %>/**/*.js.map"
            ]
        },

        nugetpack: {
            all: {
                src: "nuget/*.nuspec",
                dest: "nuget/",

                options: {
                    version: "<%= pkg.version %>"
                }
            }
        },
        nugetpush: {
            all: {
                src: "nuget/*.<%= pkg.version %>.nupkg"
            }
        },

        watch: {
            tslint: {
                files: ['<%= tslint.dev.src %>'],
                tasks: ['tslint:dev']
            },
            test: {
                files: ['<%= paths.test %>/*.*'],
                tasks: ['test']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            }
        }
    });

    grunt.registerTask("fixdecla", function () {
        var content = grunt.file.read("dist/komoment.d.ts");
        content = content.replace(/\.{2}\/typings/g, "../../../typings");
        grunt.file.write("dist/komoment.d.ts", content);
    });

    grunt.registerTask("declaration", ["copy:declaration", "fixdecla"]);

    grunt.registerTask("build", ["tslint:dev", "ts:dist", "declaration"]);
    grunt.registerTask("build-dev", ["tslint:dev", "ts:dev"]);
    grunt.registerTask("build-test", ["build-dev", "tslint:test", "ts:test"]);

    grunt.registerTask("test", ["build-test", "mocha:test"]);
    grunt.registerTask("btest", ["build-test", "connect:test"]);

    grunt.registerTask("nuget", ["nugetpack", "nugetpush"]);

    grunt.registerTask("default", ["clean", "test", "build"]);
};