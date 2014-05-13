# KoMoment [![Build Status](https://travis-ci.org/spatools/komoment.png)](https://travis-ci.org/spatools/komoment) [![Bower version](https://badge.fury.io/bo/komoment.png)](http://badge.fury.io/bo/komoment) [![NuGet version](https://badge.fury.io/nu/komoment.png)](http://badge.fury.io/nu/komoment)

Knockout Moment (date) integration.

## Installation

Using Bower:

```console
$ bower install komoment --save
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
define(["komoment"], function(komoment) {
    var date = ko.observable("2014-01-01T00:00:00Z").extend({ moment: { unix: true } });

});
```

### Browser (with built file)

Include built script in your HTML file.

```html
<script type="text/javascript" src="path/to/knockout.js"></script>
<script type="text/javascript" src="path/to/moment.js"></script>
<script type="text/javascript" src="path/to/komoment.min.js"></script>
```

#### Use it in your code

```javascript
var date = ko.observable("2014-01-01T00:00:00Z").extend({ moment: { unix: true } });
```

## Documentation

Documentation is hosted on 
[Github Wiki](https://github.com/spatools/komoment/wiki)