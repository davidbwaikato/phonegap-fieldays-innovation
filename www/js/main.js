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
					
				//this.homePage.playVideo(function() {
					self.homePage.render();
					self.slidePage(self.homePage);
				//});
            }
            return;
	}

	if (hash == "#kiaora") {
	
        if (this.kiaoraPage) {
			self.slidePage(this.kiaoraPage);
			$('#info-page').empty(); // http://stackoverflow.com/questions/2648618/remove-innerhtml-from-div
			
			if(!window.cordova) {
				// KiaoraPage exists, meaning we've already played the video once
				delete this.homePage.webModeFirstTimeKiaora;
			}
			
			this.kiaoraPage.reinitialize(); // refresh values from the control file again
			this.kiaoraPage.render(); // force it to regenerate the story count			
	    }
	    else {
			//this.kiaoraPage = new KiaoraView(this.homePage).render();
			
			// If we're running on the web instead of as an app, 
			// we need to set a variable so that the balloon video can be displayed with an html5 video player
			if(!window.cordova) {
				this.homePage.webModeFirstTimeKiaora = 1;
			}
			
			this.kiaoraPage = new KiaoraView(this.homePage);
				 
			this.kiaoraPage.playVideo(function() {
					self.kiaoraPage.render();
					self.slidePage(self.kiaoraPage);
				});			
	    }
	    return;
	}

	if (hash == "#static-discover") {
		if (this.staticDiscoverPage) {			
			this.slidePage(this.staticDiscoverPage);			
		} else {				
			this.staticDiscoverPage = new StaticDiscoverView(this.homePage);
			this.staticDiscoverPage.render();				
			this.slidePage(this.staticDiscoverPage);
		}
		return;
	}

	
	if ((/^#discover/).test(hash)) {//if (hash == "#discover") {
	
		var myRegexp = /^#discover-(.*)$/;
		var match = myRegexp.exec(hash);
		var scanMode = "";
		var directStory = "";
		
		if(match != null && match.length == 2) { // first match match[0] is the entire regex, the second match is Innovation-Story-DD
			// load the innovation story directly
			
			scanMode = "noscan";			
			directStory = match[1];
		} 
		else { // catch all case, we go to the default discover page that does the scanning
			scanMode = "qr";
		
			// When the app starts, the scan mode value is retrieved from the control file and stored in homePage
			if(this.homePage && this.homePage.scanMode) {			
				scanMode = this.homePage.scanMode;
			}
		}
		
		
		if (this.discoverPage) {
			this.discoverPage.setScanMode(scanMode);			
		}
		else {
			this.discoverPage = new DiscoverView(scanMode, this.homePage).render();			
		}
		
		self.slidePage(this.discoverPage);
		if(scanMode == "noscan") {
			this.discoverPage.loadInnovationStory({text: directStory});
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
			this.considerPage = new ConsiderView(this.homePage);
			
			//this.kiaoraPage.playVideo(function() {
					self.considerPage.render();
					self.slidePage(self.considerPage);
			//});
				
			
	    }
	    return;
	}

	if (hash == "#winner-2013") {
        if (this.winner2013Page) {
			// Don't slide in Ayla's innovation-story, since that iframe has its own sliding behaviour
			// and doubling it causes the first page to wobble when it is brought into view
			//self.slidePage(this.winner2013Page);
			$(window).scrollTop(0); // Ensure scroll-bar is back to top
			$('body').append(this.winner2013Page.el);
	    }
	    else {
			this.winner2013Page = new Winner2013View().render();
			// Don't slide in Ayla's innovation-story, since that iframe has its own sliding behaviour
			// and doubling it causes the first page to wobble when it is brought into view
			//self.slidePage(this.winner2013Page);	    
			$(window).scrollTop(0); // Ensure scroll-bar is back to top
			$('body').append(this.winner2013Page.el);
	    }
	    return;
	}

	  if (hash == "#finish") {        
		if (this.finishPage) {
			this.slidePage(this.finishPage);				
		} else {			
			this.finishPage = new FinishView(this.homePage);
			self.finishPage.render();
			self.slidePage(this.finishPage);
			// if they've reached the finish page, can already write the log. No need to wait until they click on the final link back to splashPage
			//self.finishPage.writeToLog(); 
			self.homePage.writeEntryToLog("the-end", "done");
			
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
		else if ((page == app.kiaoraPage) && ((this.currentPage == app.discoverPage) || (this.currentPage == app.staticDiscoverPage))) {				
				$(page.el).attr('class', 'page stage-left');
				currentPageDest = "stage-right";
		}
		else if ((page == app.kiaoraPage) && (this.currentPage == app.considerPage)) {
				$(page.el).attr('class', 'page stage-left');
				currentPageDest = "stage-right";
		}
		else if ((page == app.considerPage) && (this.currentPage == app.winner2013Page)) {
				$(page.el).attr('class', 'page stage-left');
				currentPageDest = "stage-right";
		}
		else if ((page == app.winner2013Page) && (this.currentPage == app.finishPage)) {
				$(page.el).attr('class', 'page stage-left');
				currentPageDest = "stage-right";
		}
		else if ((page == app.finishPage) && (this.currentPage == app.splashPage)) {
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
				if(self.discoverPage.getScanMode() != "noscan") {
					self.discoverPage.scan();
				}	
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