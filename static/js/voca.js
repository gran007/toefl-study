var text = '';
var textList = [];

// javascript 시작시 이벤트
function init() {
    setNavClickEvent();
    getFileList();
}

function setNavClickEvent() {
    $('.navButton').click(function() {
        $(this).toggleClass('active');
        if($(this).hasClass('active')) {
            $('.sidenav').show('slide', {direction: "right"}, 200);
        } else {
            $('.sidenav').hide('slide', {direction: "left"}, 200);
        }
    });
}

function getFileList() {
    $.getJSON('/vocaFileList', function(fileList) {
        var ul = $('<ul></ul>');
        var lastSelectedVocaFileName = $.cookie('lastSelectedVocaFileName');
        $.each(fileList, function(index, item) {
            var li = $('<li></li>').addClass(item.type).html(item.name).attr('filePath', item.path);;
            li.click(fileClick);
            ul.append(li);
            if(lastSelectedVocaFileName === item.name) {
                li.click();
            }
        });
        $('.sidenav').append(ul);
        $('.navButton').click();
    });
}

function handleClass(item, className) {
	if(item.hasClass(className)) {
		item.removeClass(className);
	} else{
		item.addClass(className);
	}	
}

// list 선택시 이벤트
function fileClick(e) {
	$(document).scrollTop(0);
    $(this).addClass('selected');
    $(this).siblings().removeClass('selected');
    var name = $(this).html();
    $.cookie('lastSelectedVocaFileName', name, { expires : 30 });
    var filePath = $(this).attr('filePath');
    $.ajax({
        url: '/readFile',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({filePath: filePath}),
        success: function(list) {
            textList = list;
            var content = $('.content');
            content.html('');
			$.each(textList, function(index, item) {
				var itemList = item.split('\t');
                if(itemList[0].length != 0) {
					var id = name+'-'+itemList[0];
					
					var row = $('<div></div>').addClass('Rtable-row').attr('id', id);
					
					if($.cookie(id)) {
						row.addClass('on');
					}
					
					var first = $('<div></div>').addClass('Rtable-cell first').html(itemList[0]);
					var second = $('<div></div>').addClass('Rtable-cell second').html(itemList[1]);
					third = $('<div></div>').addClass('Rtable-cell third');
					
					first.click(function(){					
						var parentRow = $(this).parent();
						var selId = parentRow.attr('id');
						var savedId = $.cookie(selId);
						if(savedId) {
							$.removeCookie(selId, null);
							parentRow.removeClass('on');
						} else {
							$.cookie(selId, { expires : 30 });
							parentRow.addClass('on');
						}						
					});
					
					//if(detectmob()) {	
						second.click(function(){	
						say(itemList[1]);
						//playSound(itemList[1]);
						});	
					/*} else {
						longClick(second, function() {
							playSound(itemList[1]);
						});
					}*/					
					
					row.append(first);
                    row.append(second);
                    row.append(third);
					content.append(row);
                }
                colRow  = $('<div></div>').addClass('col-row');
                third.append(colRow);
				var firstCol = $('<div></div>').addClass('first').html(itemList[3]);
				
				//if(detectmob()) {					
					firstCol.click(function() {
						say(itemList[3]);
						//playSound(itemList[3]);
					});	
				/*} else {
					longClick(firstCol, function() {
						playSound(itemList[3]);
					});	
				}*/				
				
				var secondCol = $('<div></div>').addClass('second').html(itemList[2]);
				secondCol.click(function() {
						handleClass(content, 'third-cell-second-col-hide');
				});
                colRow.append(firstCol);
                colRow.append(secondCol);
            });
            $('.navButton').click();
            //console.log(textList);
        }
    });
}

/*function playSound(text) {
	var msg = new SpeechSynthesisUtterance(text);
	msg.lang = 'en-US';
	window.speechSynthesis.cancel();
	window.speechSynthesis.speak(msg);
}*/

var sayTimeout = null;

function say(text) {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();

        if (sayTimeout !== null)
            clearTimeout(sayTimeout);

        sayTimeout = setTimeout(function () { say(text); }, 250);
    }
    else {
        var message = new SpeechSynthesisUtterance(text);
        message.lang = "en-US";
        speechSynthesis.speak(message);
    }
}

function longClick(item, func) {
	var tmr = 0;
	var second = 300;
	$(item).mousedown(function () {
	  tmr = setTimeout(function () {
		  func();		
	  }, second);
	}).mouseup(function () {
	  clearTimeout(tmr);
	});
}

$(function() {
    init();
});

function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}