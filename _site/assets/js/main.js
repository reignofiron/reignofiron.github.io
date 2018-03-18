$(function() {

  $('.roiNav-trigger').click(function() {

    $(this).toggleClass('is-clicked');
    $('.roiNav').find('ul').toggleClass('is-visible');
    $('html, body').toggleClass('overflow-hidden')

  });

});
