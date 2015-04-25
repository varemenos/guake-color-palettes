#!/usr/bin/env node
var fs = require('fs');

var capitalize = function (s) {
    return s && s[0].toUpperCase() + s.slice(1);
};

var getPaletteName = function (filename) {
    var name = filename
        .split('guake-').join('')
        .split('.sh').join('')
        .split('-').map(function (partialStr) {
            return capitalize(partialStr);
        }).join(' ');

    return name;
};

var getForegroundColor = function (file) {
    var color = file[0]
        .split('gconftool-2 -s -t string /apps/guake/style/font/color "').join('')
        .split('"').join('');

    return color;
};

var getBackgroundColor = function (file) {
    var color = file[1]
        .split('gconftool-2 -s -t string /apps/guake/style/background/color "').join('')
        .split('"').join('');

    return color;
};

var getPaletteColors = function (file) {
    var temp = file[2]
        .split('gconftool-2 -s -t string /apps/guake/style/font/palette "').join('')
        .split('"').join('');

    var colors = [[], [], [], []];
    var counter = -1;

    temp.split(':').forEach(function (color, i) {
        if (i % 5 === 0) {
            counter ++;
        }

        colors[counter].push(color);
    });

    return colors;
};

var mergeColors = function (foreground, background, palette) {
    palette[palette.length - 1].push(background);
    palette[palette.length - 1].push(foreground);

    var result = [];

    for (var i = 0; i < palette.length; i++) {
        result.push(palette[i].join(':'));
    }

    return result;
};

var makePaletteString = function (palette) {
    var result = '\t\'' + palette.name + '\'\:\n';

    palette.colors.forEach(function (row) {
        result += '\t\t\'' + row + '\:\'\n';
    });

    paletteStr += result.slice(0,-3) + '\',\n';
};

var makeGuakePalette = function (filename, index) {
    var file = fs.readFileSync(filespath + '/' + filename).toString().split("\n");

    var foregroundColor = getForegroundColor(file);
    var backgroundColor = getBackgroundColor(file);
    var paletteColors = getPaletteColors(file);

    var guakePalette = {
        name: getPaletteName(filename),
        colors: mergeColors(foregroundColor, backgroundColor, paletteColors)
    };

    makePaletteString(guakePalette);
};

var filespath = 'palettes/';
var paletteStr;
var logPaletteStr = function () {
    var files = fs.readdirSync(filespath);

    paletteStr = 'PALETTES = {\n';
    files.forEach(makeGuakePalette);
    paletteStr = paletteStr.slice(0,-2) + '\n}';

    console.log(paletteStr);
};

logPaletteStr();
