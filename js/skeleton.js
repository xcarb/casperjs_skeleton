function randomIntFromInterval(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function makeSC(postfix, casp)
{
    casp.capture(scpath+postfix + '.png', {
        top: 0,
        left: 0,
        width: 640,
        height: 480
    });
    casp.echo('New screenshot: '+postfix + '.png', 'INFO_BAR');
}


var mimeTypes = [
    {
        description: "Shockwave Flash 12.0 r0",
        filename: "NPSWF32_12_0_0_77.dll",
        length: 1,
        name: "Shockwave Flash",
        version: "12.0.0.77"
    },
    {
        description: "Shockwave Flash 12.0 r0",
        filename: "NPSWF32_12_0_0_48.dll",
        length: 1,
        name: "Shockwave Flash",
        version: "12.0.0.48"
    },
    {
        description: "Shockwave Flash 12.0 r0",
        filename: "NPSWF32_12_0_0_77.dll",
        length: 1,
        name: "Shockwave Flash",
        version: "12.0.0.77"
    },
    {
        description: "Shockwave Flash 11.7",
        filename: "NPSWF32_11_7_2_10.dll",
        length: 1,
        name: "Shockwave Flash",
        version: "11.7.2.10"
    },
    {
        description: "Shockwave Flash 11.7",
        filename: "NPSWF32_11_7_2_10.dll",
        length: 1,
        name: "Shockwave Flash",
        version: "11.7.2.10"
    },
    {
        description: "Shockwave Flash 10.3",
        filename: "NPSWF32_10_3_183.dll",
        length: 1,
        name: "Shockwave Flash",
        version: "10.3.183"
    }

];

var scpath = 'screenshots/';


var __utils__ = require('clientutils').create();
var fs = require('fs');
var dump = require("utils").dump;
var x = require('casper').selectXPath;

var casperhelp = require('casper').create();

var mtype = mimeTypes[randomIntFromInterval(0, 6)];
var viewports = [
    "1024,768", "800,600", "1920,1080", "1366,768", "1280,800", "1440,900"
]
var viewport = viewports[Math.floor(Math.random() * viewports.length)];
var vieww = parseInt(viewport.split(',')[0]);
var viewh = parseInt(viewport.split(',')[1]);

var url = "http://google.com";

try {
    var data = fs.read('user_agents.txt');
    var uas = data.split("\r\n");

    var useragent = uas[Math.floor(Math.random() * uas.length)];


} catch (e) {
    casperhelp.echo(e,'ERROR');
}


var casper = require('casper').create({
    verbose: false,
    logLevel: 'error',
    waitTimeout: 100000,
    timeout: 300000,
    stepTimeout: 100000,
    pageSettings: {
        webSecurityEnabled: false,
        localToRemoteUrlAccessEnabled: true,
        XSSAuditingEnabled: true,
        loadImages: true, // The WebPage instance used by Casper will
        loadPlugins: true, // use these settings
        userAgent: useragent
    },
    onWaitTimeout: function () {
        this.echo('Wait timeout reached!', 'ERROR');
         makeSC('_waittimeout',this);
         this.echo("Current URL: "+casper.getCurrentUrl(),'ERROR');
    },
    onStepTimeout: function () {
        this.echo('Step timeout reached!', 'ERROR');
         makeSC('_steptimeout',this);
         this.echo("Current URL: "+casper.getCurrentUrl(),'ERROR');
    }
});


casper.on('load.finished', function (status) {
    this.echo('Status: ' + status, 'INFO_BAR');
    this.echo("Current URL: "+casper.getCurrentUrl(),'INFO');
})

casper.on('remote.message', function (msg) {
    this.echo('Remote Msg: ' + msg,'INFO');
    this.echo("Current URL: "+casper.getCurrentUrl(),'INFO');
})

casper.on("page.error", function(msg, backtrace) {
    this.echo("=========================",'WARNING');
    this.echo("PAGE.ERROR:",'WARNING');
    this.echo(msg);
    dump(backtrace);
    this.echo("=========================",'WARNING');

});

casper.on('error', function(msg, backtrace) {
    this.echo('General Error:','ERROR');
    this.echo(msg,'WARNING');
    makeSC('_error',this);
});




casper.start(url, function () {
    this.echo("Start: " + this.getCurrentUrl());
}).viewport(vieww, viewh);
casper.page.customHeaders = {
    "Referer": "http://bing.com"
};
casper.page.onInitialized = function () {
    casper.page.evaluate(function (mtype) {
        var nav = window.navigator;
        var mimes = nav.mimeTypes;
        var plugs = nav.plugins;
        mimes.length = 3;
        mimes['application/x-shockwave-flash'] = {
            description: "Adobe Flash movie",
            enabledPlugin: mtype,
            suffixes: "swf",
            type: "application/x-shockwave-flash"
        }
        plugs.length = 6;
        plugs['Shockwave Flash'] = {
            description: "Adobe Flash movie",
            enabledPlugin: mtype,
            suffixes: "swf",
            type: "application/x-shockwave-flash"
        }

        window.navigator.mimeTypes = mimes;
        window.navigator.plugins = plugs;


    }, mtype);
};












casper.run(function () {
    //
});
