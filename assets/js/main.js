$(function() {

  $('.roiNav-trigger').click(function() {

    $(this).toggleClass('is-clicked');
    $('.roiNav').find('nav').toggleClass('is-visible');
    $('html, body').toggleClass('overflow-hidden')

  });

  $('input.search').on('input', function(e) {

    var
    filter = $(this).val().toLowerCase(),
    container = $(this).data('container'),
    scope = $(this).data('scope');

    $('.' + scope).each(function() { // loop through current scope

      var
      $this = $(this),
      name = $this.data('searchable').toLowerCase();

      for (var i = 0; i < scope.length; i++) { // loop through query words

        if (name.indexOf(filter) > -1) { // if current word in q finds match in title
          $this.show()
        } else {
          $this.hide();
        }

      }

    }); // end scope loop

  });

});
