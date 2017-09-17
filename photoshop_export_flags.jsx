#target photoshop
//$.level = 2;

/*
 *  Script by Loginoff Nick (nloginoff (at) gmail dot com)
 *  Script export layers to files adding group-name as prefix or create folders like a groups
 *  Function translite - replac a russian words to english.
 *  Photoshop CS5
 *  04.02.2014
 *
 */

(function() {
    var LONG_NAMES = 0; // Save Long Names - Folder_SubFolder_Layer or save only "Layer"
    var CREATE_FOLDERS = 0; // Create Hierarchy Folders. Warning if this 0 and LONG_NAMES = 0, maybe recreate files.
    var SEPARATOR = '_'; // Separator for file name
    var PREFIX_FILE = '' + SEPARATOR; //

    // Converts name to something Windows won't complain about.
    function translite(str) {
        var arr = {'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ж':'g', 'з':'z', 'и':'i', 'й':'y', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o', 'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'ы':'i', 'э':'e', 'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ж':'G', 'З':'Z', 'И':'I', 'Й':'Y', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O', 'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Ы':'I', 'Э':'E', 'ё':'yo', 'х':'h', 'ц':'ts', 'ч':'ch', 'ш':'sh', 'щ':'shch', 'ъ':'', 'ь':'', 'ю':'yu', 'я':'ya', 'Ё':'YO', 'Х':'H', 'Ц':'TS', 'Ч':'CH', 'Ш':'SH', 'Щ':'SHCH', 'Ъ':'', 'Ь':'','Ю':'YU', 'Я':'YA'};
        var replacer = function(a){return a in arr ? arr[a] : '';};
        return str.replace(/[А-яёЁьЬ]/g, replacer);//.toLowerCase();
    }

    function scanLayers(el, current_folder, prefix_name) {
        // scan through the entire document
        for (var a = 0; a < el.layers.length; a++) {
            var cgroup = el.layers[a];

            if (!cgroup.visible) {
                continue;
            }

            var gname = translite(el.layers[a].name);

            // scan through each group
            if (cgroup.layers && cgroup.layers.length > 0) {
                for (var b = 0; b < cgroup.layers.length; b++) {
                    var clayer = cgroup.layers[b];
                    clayer.visible = false;
                }

                for (var b = 0; b < cgroup.layers.length; b++) {
                    var clayer = cgroup.layers[b];
                    var lname = translite(cgroup.layers[b].name);

                    switch (b) {
                        case 0: lname = "communism"; break;
                        case 1: lname = "democratic"; break;
                        case 2: lname = "fascism"; break;
                        case 3: lname = "neutality"; break;
                    }

                    var file_name = gname + SEPARATOR + lname;

                    clayer.visible = true;
                    saveLayer(clayer, file_name, current_folder, false);
                    clayer.visible = false;
                }
            }
        }
    }

    function saveAsTGA(saveFile) {
        var initDlgDisplay = app.displayDialogs;

        TargaSaveOptions.resolution = TargaBitsPerPixels.THIRTYTWO;
        // Okay to default to always alpha channels because bits will determine if alpha saved or not
        TargaSaveOptions.alphaChannels = true;
        TargaSaveOptions.rleCompression = false

        // turn off dialogs real quick so the damn thing doesn't pop up when saving
        app.displayDialogs = DialogModes.NO;

        // Save
        activeDocument.saveAs(new File(saveFile), TargaSaveOptions, false, Extension.NONE);

        // Restore dialogs
        app.displayDialogs = initDlgDisplay;
    };

    function saveLayer(layer, lname, path, shouldMerge) {
        activeDocument.activeLayer = layer;

        // dupLayers();

        // if (shouldMerge === undefined || shouldMerge === true) {
        //     activeDocument.mergeVisibleLayers();
        // }

        // activeDocument.trim(TrimType.TRANSPARENT,true,true,true,true);

        var saveFile = File(path + "/" + lname + ".tga");

        saveAsTGA(saveFile);

        // app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    };

    if(!documents.length) return;
    var doc = activeDocument;
    var DocPath = doc.path;
    var DocName = translite(doc.name.replace(/\.psd/g,''));

    var outFolder = new Folder(DocPath + "/" + DocName + "_layers");
    if (!outFolder.exists) {
        outFolder.create();
    }

    // ensure valid folder
    var width = doc.width.as("px")
    var height = doc.height.as("px")
    if (width == 82 && height == 52) {
        // nothing; target folder is root as above
    }
    if (width == 41 && height == 26) {
        outFolder = new Folder(DocPath + "/" + DocName + "_layers/medium");
    }
    else if (width == 10 && height == 7) {
        outFolder = new Folder(DocPath + "/" + DocName + "_layers/small");
    }
    else {
        if (!(confirm("Continue anyway?", true, "Flags should be 82x52, 41x26, or 10x7. Your active document is "+width+"x"+height+"."))) {
            return;
        }
    }

    // make subfolder if needed
    if (!outFolder.exists) {
        outFolder.create();
    }

    scanLayers(doc, outFolder, PREFIX_FILE + DocName);
})();
