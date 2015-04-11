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
    var color = file[2]
        .split('gconftool-2 -s -t string /apps/guake/style/font/palette "').join('')
        .split('"').join('');

    return color;
};

var mergeColors = function (foreground, background, palette) {
    palette+= ':' + background;
    palette+= ':' + foreground;

    return palette;
};

var makePaletteString = function (palette) {
    var result = '# ' + palette.name;

    palette.colors.split(':').forEach(function (color, i) {
        if (i % 5 === 0) {
            result += '\t\n';
        }

        result += color + ':';
    });

    result = result.split('\n').join('\n\'');
    result = result.split('\:\t\n').join('\:\'\t\n');
    result = result.slice(0, - 1) + '\'';
    result = result.split('\n').join('\n\t');

    paletteStr += '\n\t' + result + ',';
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

    paletteStr = 'PALETTES = [';
    files.forEach(makeGuakePalette);
    paletteStr = paletteStr.slice(0, - 1) + '\n]';

    console.log(paletteStr);
};

logPaletteStr();
