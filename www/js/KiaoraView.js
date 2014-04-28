

var KiaoraView = function(homeView) {

    this.homeView = homeView;

    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
    };

    this.render = function() {
	if (!this.homeView) {
	    this.homeView = { enteredName:  "" }
	}

	var nes = Object.size(KiaoraView.explored_stories);

	if (nes > 0) {

	    this.homeView.numExploredStories = nes;
	    this.homeView.remainingStories = KiaoraView.totalNumStories - nes;
	}
        this.el.html(KiaoraView.template(this.homeView));

        return this;
    };


    this.initialize();
}

KiaoraView.template = Handlebars.compile($("#kiaora-tpl").html());

KiaoraView.totalNumStories = 5
KiaoraView.explored_stories = {};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
