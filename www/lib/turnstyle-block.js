

function transformToTurnstyleBlock(baseId)
{
    // wrapper '-turnstyle' div has two child divs
    var select_wrapper = '#'+baseId+'-turnstyle > div';

    var $header = $(select_wrapper + ":nth-child(1)");
    var $body   = $(select_wrapper + ":nth-child(2)");

    $header.addClass("openclose ui-state-default ui-corner-all");

    var title = $header.html();

    var turnstyle_title = "";

    turnstyle_title += '<a href="#" id="'+baseId+'-openclose" class="openclose">\n';
    turnstyle_title += '  <div style="float: left; padding-top: 10px; width: 32px; height: 42px;">\n';
    turnstyle_title += '    <img id="'+baseId+'-closed" src="css/turnstyle-closed-32.png"/>\n';
    turnstyle_title += '    <img id="'+baseId+'-open"   src="css/turnstyle-open-32.png" \n';
    turnstyle_title += '         style="display: none;" />\n';
    turnstyle_title += '  </div>\n';
    turnstyle_title += '  '+title + '<span id="'+baseId+'-dots"> ...</span>\n';
    turnstyle_title += '</a>\n';

    $header.html(turnstyle_title);

    $body.attr("id",baseId+"-area");    

    $('#'+baseId+'-openclose').click(function() {
	//$('#'+baseId+'-area').toggle( "blind", {}, 500);
	
	// Technique to avoid "display: none" being done by jquery-ui as 
	// this has the undesired side-effect of unloading elements (such
	// as the entire Meandre workflow).

	if ($('#'+baseId+'-open').css("display") == "block") {
	    $('#'+baseId+'-area').slideUp(500,function(){
		$('#'+baseId+'-area').addClass('hide')
		    .slideDown(0);
	    });
	} else {
	    $('#'+baseId+'-area').slideUp(0,function(){
		$('#'+baseId+'-area').removeClass('hide')
		    .slideDown(500);
	    });
	}

	if ($('#'+baseId+'-open').css("display") == "none") {
	    $('#'+baseId+'-closed').css("display","none");
	    $('#'+baseId+'-open').css("display","block");
	    $('#'+baseId+'-dots').css("display","none");
	}
	else {
	    $('#'+baseId+'-open').css("display","none");
	    $('#'+baseId+'-closed').css("display","block");
	    $('#'+baseId+'-dots').css("display","inline");
	}			    			    
	return false;
    });
}

/*
(function(){
  var $button = $('#myButton'),
      $text   = $('#myText'),
      visible = true;
  $button.click(function(){
    if ( visible ) {
      $text.slideUp('fast',function(){
        $text.addClass('accessibly-hidden')
             .slideDown(0);
      });
    } else {
      $text.slideUp(0,function(){
        $text.removeClass('accessibly-hidden')
             .slideDown('fast');
      });
    }
    visible = ! visible;
  });
})();
*/
