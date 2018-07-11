$(function() {

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
