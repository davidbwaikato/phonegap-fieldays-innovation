var app = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    registerEvents: function() {
        $(window).on('hashchange', $.proxy(this.route, this));
        $('body').on('mousedown', 'a', function(event) {
            $(event.target).addClass('tappable-active');
        });
        $('body').on('mouseup', 'a', function(event) {
            $(event.target).removeClass('tappable-active');
        });
    },

    route: function() {
        var self = this;
        var hash = window.location.hash;
        if (!hash) {
            if (this.homePage) {
                this.slidePage(this.homePage);
		this.homePage.reinitialize();
            } else {
                this.homePage = new HomeView(this.store).render();
                this.slidePage(this.homePage);
            }
            return;
        }
	// have a non-trivial hash

	if (hash == "#start") {

            if (this.startPage) {
		self.slidePage(this.startPage);
	    }
	    else {
		this.startPage = new StartView(this.homePage).render();
		self.slidePage(this.startPage);	    
		//this.startPage.crossfade();
	    }
	    return;
	}

	if (hash == "#kiaora") {

            if (this.kiaoraPage) {
		self.slidePage(this.kiaoraPage);
		this.kiaoraPage.render(); // force it to regenerate the story count
	    }
	    else {
		this.kiaoraPage = new KiaoraView(this.homePage).render();
		self.slidePage(this.kiaoraPage);	    
	    }
	    return;
	}


	if (hash == "#discoverar") {
            if (this.discoverPage) {
		this.discoverPage.setScanMode("ar");
		self.slidePage(this.discoverPage);
	    }
	    else {
		this.discoverPage = new DiscoverView("ar").render();
		self.slidePage(this.discoverPage);	    
	    }
	    return;
	}

	if (hash == "#discoverqr") {
            if (this.discoverPage) {
		this.discoverPage.setScanMode("qr");
		self.slidePage(this.discoverPage);
	    }
	    else {
		this.discoverPage = new DiscoverView("qr").render();
		self.slidePage(this.discoverPage);	    
	    }
	    return;
	}


    },

    slidePage: function(page) {

        var currentPageDest,
        self = this;

        // If there is no current page (app just started) -> No transition: Position new page in the view port
        if (!this.currentPage) {
            $(page.el).attr('class', 'page stage-center');
            $('body').append(page.el);
            this.currentPage = page;
            return;
        }

        // Cleaning up: remove old pages that were moved out of the viewport
        $('.stage-right, .stage-left').not('.homePage').remove();

        if (page === app.homePage) {
            // Always apply a Back transition (slide from left) when we go back to the home page
            $(page.el).attr('class', 'page stage-left');
            currentPageDest = "stage-right";
        } 
	else if ((page == app.startPage) && (this.currentPage == app.kiaoraPage)) {
            $(page.el).attr('class', 'page stage-left');
            currentPageDest = "stage-right";
	}
	else if ((page == app.kiaoraPage) && (this.currentPage == app.discoverPage)) {
            $(page.el).attr('class', 'page stage-left');
            currentPageDest = "stage-right";
	}
	else {
            // Forward transition (slide from right)
            $(page.el).attr('class', 'page stage-right');
            currentPageDest = "stage-left";
        }

        $('body').append(page.el);

        // Wait until the new page has been added to the DOM...
        setTimeout(function() {
            // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
            $(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
            // Slide in the new page
            $(page.el).attr('class', 'page stage-center transition');
            self.currentPage = page;


	    if (page == self.discoverPage) {
		self.discoverPage.scan();
	    }
        });

    },

    initialize: function() {
        var self = this;
        this.detailsURL = /^#employees\/(\d{1,})/;
        this.registerEvents();
        this.store = new MemoryStore(function() {
            self.route();
        });
    }

};

var bubblesStopped = false;

function stopBubbleAnnimation(delay) {
    if (!bubblesStopped) {
	app.startPage.crossfade(delay);
    }
    bubblesStopped = true;   
}

app.initialize();