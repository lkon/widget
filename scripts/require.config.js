var jam = {
    "packages": [
        {
            "name": "jquery",
            "location": "vendor/jquery",
            "main": "jquery.js"
        },
        {
            "name": "core",
            "location": "vendor/jquery.ui",
            "main": "jquery.ui.core.js"
        },
		{
			"name": "widget",
			"location": "vendor/jquery.ui",
			"main": "jquery.ui.widget.js"
		},
        {
            "name": "accordion",
            "location": "vendor/jquery.ui",
            "main": "jquery.ui.accordion.js"
        },
        {
        	"name": "underscore",
        	"location": "vendor/underscore",
        	"main": "underscore.js"
        },
        {
            "name": "Backbone",
            "location": "vendor/backbone",
            "main": "backbone.js"
        }
    ],
    "shim": {}
};

if (typeof require !== "undefined" && require.config) {
    require.config({packages: jam.packages, shim: jam.shim});
}
else {
    var require = {packages: jam.packages, shim: jam.shim};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}