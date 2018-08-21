var apiKey = "39424dade4d141af9a0807725a14ed20", // production
apiKey = "6987280b74b24575a4e805277bb5baa6", // local
roiGroupId = "2974952",
exaltedGroupId = "3085051"
;

(function(){ // smooth scrolling pants

  $('a[href*="#"]') // Select all links with hashes
    // Remove links that I don't want scrolling the page
    .not('.tertiary-nav-item a') // tertitary nav links
    .not('[href="#"]')
    .not('[href="#0"]') // placeholder links
    .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

      if (target.length) {// Does a scroll target exist?

        event.preventDefault();

        $('html, body').animate({
          scrollTop: target.offset().top-60

        }, 1000, function() { // Must change focus!

          var $target = $(target);

          $target.focus();

          if ($target.is(":focus")) { // Checking if the target was focused

            return false;

          } else {

            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again

          };
        });
      }
    }
  });

})();

function checkParams(param) {

  var
  pageURL = window.location.search.substring(1),
  urlParams = pageURL.split('&');

  if (urlParams.length > 0) {
    for (var i = 0; i < urlParams.length; i++) {
      var pair = urlParams[i].split('=');
      if (pair[0] == param) {
        return pair[1];
      }
    }
  }
}

$(function() { // doc ready pants

	// mobile nav trigger
  $('.roiNav-trigger').click(function() {

    $(this).toggleClass('is-clicked');
    $('.roiNav').find('nav').toggleClass('is-visible');
    $('html, body').toggleClass('overflow-hidden')

  });

	/* Search/filter component */
  $('input.search').on('input', function(e) {

    var
    filter = $(this).val().toLowerCase(),
    container = $(this).data('container'),
    scope = $(this).data('scope');

    $('.' + scope).each(function() { // loop through current scope

      var
      $this = $(this),
      name = $this.data('searchable').toLowerCase();
			// loop through query words
      for (var i = 0; i < scope.length; i++) {
				// if current word in q finds match in title
        if (name.indexOf(filter) > -1) {
          $this.show()
        } else {
          $this.hide();
        }
      }

    }); // end scope loop

  });

  $('.collapsible-title').click(function(){

  	$(this).toggleClass('is-expanded')
  		.parent().find('.collapsible-section--content')
  			.toggleClass('is-expanded')
  			.slideToggle();

  });

});
