
$(document).ready(function() {


  // ************************************************************
  // Smooth Scrolling 
  // - can link to a # of another page, and smooth-scroll down to that #

    var scrollElement = 'html, body';
    
    // Smooth scrolling for internal links
    $("a[href^='#']").click(function(event) {
      event.preventDefault();
      
      var $this = $(this),
      target = this.hash,
      $target = $(target);
      
      if( !(typeof $target.offset() === "undefined")) {
        $(scrollElement).stop().animate({
          'scrollTop': $target.offset().top
        }, 500, 'swing', function() {
          window.location.hash = target;
        });
      }
    });


    // 
    // Insert demo code into example area
    // 
    $( "pre.codex" ).each(function( i ) {

      // console.log('codex previous: ' + $(this).prev().html())
      var prevHtml = $(this).prev().html();
      $(this).text(prevHtml);

    });

    $(".highlight").bind('click',function() {
      SelectText($(this).get(0));
    })

});

function SelectText(element) {
    var doc = document;
    if (doc.body.createTextRange) { // ms
        var range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = doc.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        
    }
}



// using .load prevents Waypoints from firing on page load
$(window).load(function() {

    var sticky = new Waypoint.Sticky({
      element: $('.sg_main_head_menu')[0]
    })


    // create a list of nav waypoints
    $( "h2" ).each(function( i ) {

      var elem = $(this);

      // window scrolling down
      var nav = new Waypoint({
        element: elem,
        handler: function(direction) {

          if(direction == 'down') {
            // console.log('DOWN h2 trigger ' + $(elem).html())

            $('.sg_main_head_menu a').removeClass('in-view');
            $('.sg_main_head_menu a[href="#'+$(elem).html().toLowerCase().replace(/ /g,'') +'"]').addClass('in-view');
          }
        },
        offset: '20%'
      })

      // window scrolling up
      var nav = new Waypoint({
        element: elem,
        handler: function(direction) {

          if(direction == 'up') {
            // console.log('UP h2 trigger ' + $(elem).html())

            // elems = $('.sg_main_head_menu a[href^="#"]');
            // console.log(elem);
            // console.log('>>> UP h2 trigger elem: ' + $(elems).find('.in-view') + ' prevElem : ' + $(elem).prev().html())
            // console.log($(elems).find('.in-view'))

            // $('.sg_main_head_menu a').removeClass('in-view');
            // $('.sg_main_head_menu a[href$="#"]').prev().addClass('in-view');

            navelems = $('.sg_main_head_menu a.in-view');
            // console.log('>>> UP h2 trigger elem: ' + $(navelems).html() + ' prevElem : ' + $(navelems).prev().html())
            

            // console.log('UP h2 trigger elem ' + $(elem).html() + ' prevElem : ' + $(elem).prev().html())

            $('.sg_main_head_menu a').removeClass('in-view');
            $(navelems).prev().addClass('in-view');
          }
        },
        offset: '10%'
      })


    });
});