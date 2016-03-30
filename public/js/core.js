var rightKey, leftKey, topKey, bottomKey;
var pagePreloadFunctions = new Array();
var pagePositionFunctions = new Array();
var pageStopFunctions = new Array();
var pageStartFunctions = new Array();

//==============================================================================
//pozycjonowanie stałych elementów całej strony
//==============================================================================


var positionElements = function() {
   var innerWidth = $('body').innerWidth();
   
   //alert($(window).width()+' '+innerWidth);
   $('.staticRamka').width(innerWidth-20);
   $('.ramka1').width(innerWidth-20).addClass('afterLoad');
   //$('.ramka1').hide();
   $('.ramka2').width(innerWidth-40).height($(window).height()-20).css('margin',0);
   $('.ramkaTop').show();
   $('.ramkaBottom').show();
   //position header
   $('#header').width(innerWidth-40).css('left',20).css('z-index',5);
   
   //position aktualnego rozdziału
   var currentPage = jQuery(parallax.current.page).attr('id');
   if(typeof pagePositionFunctions[currentPage] === 'function'){
		pagePositionFunctions[currentPage]();
	}
   
   //przypisy 
   if (innerWidth < 1000) {
      $('.przypisBoczny').addClass('static');
   }
   else {
      $('.przypisBoczny').removeClass('static');
   }
   
   //glowna strona musi być obrabiana osobno
   if (currentPage=="glowna") {
      if (innerWidth>800) {
         $('#glowna .content').width(innerWidth-40).css('left',20);
         var innerHeight = $(window).height();
         $('#glowna .content').height(innerHeight-40).css('top',20);
      }
      else {
         //bez ramki
         $('#glowna .content').width(innerWidth).css('left',0);
         var innerHeight = $(window).height();
         $('#glowna .content').height(innerHeight).css('top',0);
      }
      $('#glowna .content').addClass('blueBg greenBg yellowBg');
      $('body').removeClass('startUp');
      $('#pdfDownload,#epubDownload,#zycie_mini,#informacja_mini,#perypetie_mini,#mobiDownload').css('position','absolute');
   }
	
	positionGraphs();
}

var positionGraphs = function() {
	$('.wykresContainer').each(function() {
		var bg = $(this).find('img.standard');
		var ratio = $(bg).width()/$(bg).attr('data-original-width');
		
		$(this).find('.slupek').each(function() {
			if ($(this).hasClass('vertical')) {
				//alert($(this).attr('data-original-top')+' '+ratio);
				$(this).css({
					left: $(this).attr('data-original-left')*ratio,
					top: $(this).attr('data-full')==0 ? $(this).attr('data-original-top')*ratio : ($(this).attr('data-original-top')-$(this).attr('data-max-height'))*ratio
				});
				if ($(this).attr('data-full')==1) {
					$(this).height($(this).attr('data-max-height')*ratio);
				}
				if ($(this).attr('data-original-width')!='') {
					$(this).width($(this).attr('data-original-width')*ratio);
				}
			}
			else {
				$(this).css({
					left: $(this).attr('data-original-left')*ratio,
					top: $(this).attr('data-original-top')*ratio
				});
				if ($(this).attr('data-full')==1) {
					$(this).width($(this).attr('data-max-width')*ratio);
				}
				
			}
		});
	});
}

var resetGraphs = function() {
	$('.wykresContainer').each(function() {
		var bg = $(this).find('img.standard');
		var ratio = $(bg).width()/$(bg).attr('data-original-width');
		
		$(this).find('.slupek').each(function() {
			if ($(this).hasClass('vertical')) {
				//alert($(this).attr('data-original-top')+' '+ratio);
				$(this).css({
					top: Math.ceil($(this).attr('data-original-top')*ratio),
					height: 0
				}).attr('data-full',0);
			}
			else {
				$(this).css({
					top: Math.ceil($(this).attr('data-original-top')*ratio),
					width: 0
				}).attr('data-full',0);
			}
		});
	});
}


var wypisyReset = function() {
	$('.przypisBoczny').css({'margin-right': '-200%'});
}

//==============================================================================
//działanie menu
//==============================================================================


var menuTimeout = undefined;
var wysEltuMenu = 31;

var showMenu = function() {
   if (menuTimeout!=undefined) {
      clearTimeout(menuTimeout);
      menuTimeout = undefined;
   }
   var ileElt = $('#spistresci li').length;
   
   $('#spistresci').stop().animate({
      height: ileElt*wysEltuMenu
   }, 200, 'swing');
}

var hideMenu = function() {
   var wys = wysEltuMenu;
   if ($('#spistresci .title').attr('data-permanent')==0) {
      wys = 0;
   }
   $('#spistresci').stop().animate({
      height: wys
   }, 200, 'swing');
}

$(function() {
   $('#spistresciShow,#spistresci .title, #spistresci .element').mouseenter(function() {
      showMenu();
   }).mouseleave(function() {
      if (menuTimeout==undefined) {
         menuTimeout = setTimeout('hideMenu()', 100);
      }
   });
   
   $('#spistresci .element a').click(function() {
      var newPageNr = $('#'+$(this).attr('data-page')).attr('data-pagenr')*1;
      var newPageId = $(this).attr('data-page');
      var currentPageNr = jQuery(parallax.current.page).attr('data-pagenr')*1;
      var currentPageId = jQuery(parallax.current.page).attr('id');
      
      if (false && newPageId=='kontakt' && currentPageId!='kontakt') {
         parallax[newPageId].top();
      }
      else if (false && currentPageId=='kontakt' && newPageId!='kontakt') {
         parallax[newPageId].bottom();
      }
      else {
         if (newPageNr > currentPageNr) {
            parallax[newPageId].right();
         }
         else if (newPageNr<currentPageNr) {
            parallax[newPageId].left();
         }
      }
      hideMenu();
   });
});


//==============================================================================
//parallax sterowanie
//==============================================================================


//Sets the correct triggers for the arrows, plus arrow keys
function setRight(page, name){
   $("#next span").html(name);
	$("#next").show().unbind('click').click(function(){
		parallax[page].right();
	});
	rightKey = function(){
		parallax[page].right();
	};
}

function setLeft(page, name){
   $("#prev span").html(name);
	$("#prev").show().unbind('click').click(function(){
		parallax[page].left();
	});
	leftKey = function(){
		parallax[page].left();
	};
}

function setTop(page){
	$("#top").show().unbind('click').click(function(){
		parallax[page].top();
	});
	topKey = function(){
		parallax[page].top();
	};
}

function setBottom(page){
	$("#bottom").show().unbind('click').click(function(){
		parallax[page].bottom();
	});
	bottomKey = function(){
		parallax[page].bottom();
	};
}

$(function() {
   //Set up the triggers for the arrow keys
	$(document).keydown(function(e){
		if (e.keyCode == 37 && typeof leftKey === 'function') {
			leftKey();
		} else if(e.keyCode == 38 && typeof topKey === 'function') {
			topKey();
		} else if(e.keyCode == 39 && typeof rightKey === 'function') {
			rightKey();
		} else if(e.keyCode == 40 && typeof bottomKey === 'function') {
			bottomKey();
		}
	});
      
   

	//The fadey bits
	$("#prev").mouseenter(function(){
      $("#prev span").show();
      /*
		$("#prev").animate({width: 100}, 100, function() {
         $("#prev span").fadeIn(100);
      });
      */
	}).mouseleave(function(){
      /*
      $("#prev span").stop().fadeOut(100, function() {
         $("#prev").stop().animate({width: 4}, 100);
      });
		*/
      $("#prev span").hide();
	});

	$("#next").mouseenter(function(){
      $("#next span").show();
		//$("#next").animate({paddingRight: 30}, 400);
	}).mouseleave(function(){
      //$("#next").stop().animate({paddingRight: 20}, 100);
      $("#next span").hide();
	});

	$("#top").mouseenter(function(){
		$("#top").animate({paddingTop: 30}, 400);
	}).mouseleave(function(){
		$("#top").stop().animate({paddingTop: 0}, 100);
	});
   
   $("#bottom").mouseenter(function(){
		$("#bottom").animate({paddingBottom: 30}, 400);
	}).mouseleave(function(){
		$("#bottom").stop().animate({paddingBottom: 0}, 100);
	});
});


//==============================================================================
//ogólne funkcje animacji/popupów etc.
//==============================================================================

var strzalkaTimeout = undefined;

var animujStrzalke = function(divId) {
   $('#'+divId+' #strzalka img').animate({marginTop:30},600,'swing',function() {
      $('#'+divId+' #strzalka img').animate({marginTop:0},600,'swing',function() {
         
      });
   });
   strzalkaTimeout = setTimeout('animujStrzalke(\''+divId+'\')', 1300);
}

var animujStrzalkeStop = function(divId) {
   $('#'+divId+' #strzalka img').stop(true);
   if (strzalkaTimeout!=undefined) {
      clearTimeout(strzalkaTimeout);
   }
}

var malaStrzalkaTimeout = undefined;

var animujMaleStrzalki = function(divId) {
	return; //zastapione gifem
   $('#'+divId+' .rozwijalnyDiv a.strzalkaRozwijania img, #'+divId+' .rozwijalnyDiv a.strzalkaZwijania img').each(function() {
		$(this).stop(true,true).animate({marginTop:21},800,'swing').animate({marginTop:0},800,'swing');
   });
   malaStrzalkaTimeout = setTimeout('animujMaleStrzalki(\''+divId+'\')', 1700);
}

var animujMaleStrzalkiStop = function(divId) {
	return; //zastapione gifem
   $('#'+divId+' .rozwijalnyDiv a.strzalkaRozwijania img, #'+divId+' .rozwijalnyDiv a.strzalkaZwijania img').stop(true);
   if (malaStrzalkaTimeout!=undefined) {
      clearTimeout(malaStrzalkaTimeout);
   }
}

var strzalkaRozwijaniaClick = function() {
	//alert('s');return;
	var parent = $(this).parents('.rozwijalnyDiv');
	//alert('rozwijam');
	var hiddenDiv = $(parent).find('div:hidden');
	var laczymyP = false;
	if ($(parent).find('.threeDrops').length) {
		laczymyP = true;
		var paragrafDoLaczenia1 = $($(parent).find('.threeDrops')).parents('p');
		var paragrafDoLaczenia2 = $(hiddenDiv).find('p').first();
	}
	
	$(this).hide();
	if (laczymyP) {
		$(parent).find('.threeDrops').hide();
		
		$(paragrafDoLaczenia1).attr('data-original', $(paragrafDoLaczenia1).html());
		$(paragrafDoLaczenia1).html($(paragrafDoLaczenia1).html()+$(paragrafDoLaczenia2).html());
		$(paragrafDoLaczenia2).hide();
	}
	//$(parent).append($(hiddenDiv).html());
	$(parent).find('.strzalkaZwijania').show().css('display','block').unbind('click').click(strzalkaZwijaniaClick);
	$(hiddenDiv).slideDown().addClass('hiddenDiv');
	
	$(parent).animate({
		width: $(parent).parents('.text').width()*0.98
	}, 800);
}

var strzalkaZwijaniaClick = function() {
	var parent = $(this).parents('.rozwijalnyDiv');
	//alert('zwijam');
	var hiddenDiv = $(parent).find('div.hiddenDiv');
	var laczymyP = false;
	if ($(parent).find('.threeDrops').length) {
		laczymyP = true;
		var paragrafDoLaczenia1 = $($(parent).find('.threeDrops')).parents('p');
		var paragrafDoLaczenia2 = $(hiddenDiv).find('p').first();
	}
	
	$(this).hide();
	if (laczymyP) {
		$(paragrafDoLaczenia1).html($(paragrafDoLaczenia1).attr('data-original'));
		$(paragrafDoLaczenia1).attr('data-original','');
		$(parent).find('.threeDrops').show();
	}
	//$(parent).append($(hiddenDiv).html());
	$(parent).find('.strzalkaRozwijania').show().css('display','block').unbind('click').click(strzalkaRozwijaniaClick);
	$(hiddenDiv).slideUp(400, function() {
		if (laczymyP) {
			$(paragrafDoLaczenia2).show();
		}
	});
	
	$(parent).animate({
		width: $(parent).parents('.text').width()*0.48
	}, 400);
}

$(function() {
   $('.strzalkaRozwijania').click(strzalkaRozwijaniaClick);
	$('.strzalkaZwijania').click(strzalkaZwijaniaClick);
   
   //animowane przykłady
   $('.przykladLudzik').sprite({
      fps: 10, 
      no_of_frames: 8
   }).spStop();
   
   
   // Inline popups
   $('.magnPopup').magnificPopup({
     //delegate: 'a',
     removalDelay: 500, //delay removal by X to allow out-animation
     callbacks: {
       beforeOpen: function() {
          
          this.st.mainClass = this.st.el.attr('data-effect');
		  if (this.st.el.attr('data-position')!='') {
			this.st.mainClass += ' '+this.st.el.attr('data-position');
		  }
       }
     },
     midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
   });
   
   $( window ).scroll(function() {
      if ($(document).scrollTop()>0) {
         $('#liniaScroll').show();
      }
      else {
         $('#liniaScroll').hide();
      }
   });
	
	//podmianka svg przy niewykrywaniu
	svgeezy.init('nocheck', 'png');
});
