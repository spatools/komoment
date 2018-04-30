# KoMoment [![Build Status](https://travis-ci.org/spatools/komoment.png)](https://travis-ci.org/spatools/komoment) [![Bower version](https://badge.fury.io/bo/komoment.png)](http://badge.fury.io/bo/komoment) [![npm version](https://badge.fury.io/js/komoment.svg)](https://badge.fury.io/js/komoment) [![NuGet version](https://badge.fury.io/nu/komoment.png)](http://badge.fury.io/nu/komoment)

Knockout Moment (date) integration.

## Installation

Using Bower:

```console
$ bower install komoment --save
```

Using NPM: 

```console
$ npm install komoment --save
```

Using NuGet: 

```console
$ Install-Package KoMoment
```

## Usage

You could use komoment in different context.

### Browser (AMD from source)

#### Configure RequireJS.

```javascript
requirejs.config({
    paths: {
        knockout: 'path/to/knockout',
        moment: 'path/to/moment',
        komoment: 'path/to/komoment'
    }
});
```

#### Load modules

```javascript
define(["knockout", "komoment"], function(ko, komoment) {
    var date = ko.observable("2014-01-01T00:00:00Z").extend({ moment: { unix: true } });

});
```

### CommonJS

Install with NPM.

#### Use it in your code

```javascript
require("komoment");

var date = ko.observable("2014-01-01T00:00:00Z").extend({ moment: { unix: true } });
```

## Documentation

Documentation is hosted on 
[Github Wiki](https://github.com/spatools/komoment/wiki)