$(function() {

  $('.roiNav-trigger').click(function() {

    $(this).toggleClass('is-clicked');
    $('.roiNav').find('nav').toggleClass('is-visible');
    $('html, body').toggleClass('overflow-hidden')

  });

});
