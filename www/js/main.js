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
	
	reroute: function(newhash) {
		var self = this;
		window.location.hash = newhash;
		self.route();
		return;
	},

    route: function() {
        var self = this;
        var hash = window.location.hash;
        if (!hash) {
            if (this.splashPage) {
                this.slidePage(this.splashPage);				
            } else {
                this.splashPage = new SplashView();
				self.splashPage.render();
				self.slidePage(this.splashPage);				
            }
            return;
        }
	// have a non-trivial hash
	if (hash == "#home") {
		 if (this.homePage) {
                this.slidePage(this.homePage);
				this.homePage.reinitialize();
            } else {
                this.homePage = new HomeView();
					//self.homePage.render();
					//self.slidePage(this.homePage);
					
				//this.homePage.playVideo(function() {
					self.homePage.render();
					self.slidePage(self.homePage);
				//});
            }
            return;
	}
	
	if (hash == "#start") {

        if (this.startPage) {
			self.slidePage(this.startPage);
			this.startPage.render(); // Regenerate name on page in case it has changed
	    }
	    else {
			//this.startPage = new StartView(this.homePage).render();
			//self.slidePage(this.startPage);	    
			// //this.startPage.crossfade();
			
			this.startPage = new StartView(this.homePage);
			
			this.startPage.playVideo(function() {
					self.startPage.render();
					self.slidePage(self.startPage);
					setTimeout(function() { self.startPage.playAudio(); }, 6500);
				});
				
	    }
	    return;
	}

	if (hash == "#kiaora") {

        if (this.kiaoraPage) {
			self.slidePage(this.kiaoraPage);		
			this.kiaoraPage.reinitialize(); // refresh values from the control file again
			this.kiaoraPage.render(); // force it to regenerate the story count
	    }
	    else {
			//this.kiaoraPage = new KiaoraView(this.homePage).render();
			
			this.kiaoraPage = new KiaoraView(this.homePage);		
				 
			this.kiaoraPage.playVideo(function() {
					self.kiaoraPage.render();
					self.slidePage(self.kiaoraPage);
				});			
	    }
	    return;
	}


	if (hash == "#discover") {
		var scanMode = "qr";
		
		if(this.kiaoraPage && this.kiaoraPage.scanMode) {			
			scanMode = this.kiaoraPage.scanMode;
		}
	
		if (this.discoverPage) {
			this.discoverPage.setScanMode(scanMode);
			self.slidePage(this.discoverPage);
	    }
	    else {
			this.discoverPage = new DiscoverView(scanMode).render();
			self.slidePage(this.discoverPage);	    
	    }
	    return;
	}

	if (hash == "#consider") {
        if (this.considerPage) {
			self.slidePage(this.considerPage);
	    }
	    else {
			//this.considerPage = new ConsiderView().render();
			//bubblesStopped = false; 
			//self.slidePage(this.considerPage);	
			this.considerPage = new ConsiderView();
			
			//this.kiaoraPage.playVideo(function() {
					self.considerPage.render();
					self.slidePage(self.considerPage);
			//});
				
			
	    }
	    return;
	}

	if (hash == "#winner-2013") {
        if (this.winner2013Page) {
			self.slidePage(this.winner2013Page);
	    }
	    else {
			this.winner2013Page = new Winner2013View().render();
			self.slidePage(this.winner2013Page);	    
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

        if (page === app.homePage && !this.currentPage == app.splashPage) {
            // Always apply a Back transition (slide from left) when we go back to the home page
            $(page.el).attr('class', 'page stage-left');
            currentPageDest = "stage-right";
			
			if (bubblesStopped == false) { // still in the process of doing the animation
				if (this.kiaoraPage) {
					// prevent crossfade to audio
					this.kiaoraPage.setCrossFade(false);
				}
			}
        } 
		else if ((page == app.splashPage) && (this.currentPage == app.homePage)) {
				$(page.el).attr('class', 'page stage-left');
				currentPageDest = "stage-right";
		}
		else if ((page == app.homePage) && (this.currentPage == app.kiaoraPage)) {
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
		else if ((page == app.discoverPage) && (this.currentPage == app.considerPage)) {
				$(page.el).attr('class', 'page stage-left');
				currentPageDest = "stage-right";
		}
		else if ((page == app.considerPage) && (this.currentPage == app.winner2013Page)) {
				$(page.el).attr('class', 'page stage-left');
				currentPageDest = "stage-right";
		}
		else {
				// Forward transition (slide from right)
				$(page.el).attr('class', 'page stage-right');
				currentPageDest = "stage-left";
				
				if (this.currentPage === app.homePage) { // going forwards, allow crossfade to audio
					if(this.kiaoraPage) {
						// prevent crossfade to audio
						this.kiaoraPage.setCrossFade(true);
					}
				}	
			}

		$(window).scrollTop(0); // Ensure scroll-bar is back to top

		$('body').append(page.el);

		setTimeout(function() {

			// Wait until the new page has been added to the DOM...
			// Slide out the current page: 
			//   If new page slides from the right -> slide current page to the left, and vice versa
				$(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
				// Slide in the new page
				$(page.el).attr('class', 'page stage-center transition');
				self.currentPage = page;

			if (page == self.discoverPage) {
				self.discoverPage.scan();
			}
		},500);

    },

	onDeviceReady: function() {
			
		// Init Html5Video plugin
			
		if (window.plugins && window.plugins.html5Video) {
			console.log("Initializing Html5Video Resources");
			window.plugins.html5Video.initialize({
				"startupVideo1" : "startupvideo1.mp4", 
				"startupVideo2" : "startupvideo2.mp4"
			});
		}
		
		this.route();
	},
	
    initialize: function() {
        var self = this;
        this.registerEvents();
		
		if (window.cordova) {
			document.addEventListener('deviceready', $.proxy(this.onDeviceReady,this), false);
		}
		else {
			console.log("Using 'load' event for testing with a desktop browser");
			window.addEventListener('load', $.proxy(this.onDeviceReady,this), false);
		}

    }

};

var bubblesStopped = false;

function stopBubbleAnnimation(delay) {
    if (!bubblesStopped) {
		var doCrossFade = app.kiaoraPage.getCrossFade();
		if(doCrossFade) {
			app.kiaoraPage.crossfade(delay);	
			bubblesStopped = true;
		}
	}    
}

function stopBubbleAnnimationEnd(delay) {
    if (!bubblesStopped) {
	app.considerPage.crossfade(delay);
    }
    bubblesStopped = true;   
}



app.initialize();