var StartView = function(store) {

    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
    };

    this.render = function() {
        this.el.html(StartView.template());
        return this;
    };

    this.initialize();

}

StartView.template = Handlebars.compile($("#start-tpl").html());
