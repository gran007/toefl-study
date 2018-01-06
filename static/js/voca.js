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
					
					second.click(function(){	
						if(index == 0) {
							handleClass(content, 'second-cell-hide');
						}
						var msg = new SpeechSynthesisUtterance(itemList[1]);
						msg.lang = 'en-US';
						window.speechSynthesis.speak(msg);
					});
					
					row.append(first);
                    row.append(second);
                    row.append(third);
					content.append(row);
                }
                /*if(itemList[1].length != 0) {
                }*/
                colRow  = $('<div></div>').addClass('col-row');
                third.append(colRow);
				var firstCol = $('<div></div>').addClass('first').html(itemList[3]);
				firstCol.click(function() {
					if(index == 0) {
						handleClass(content, 'third-cell-first-col-hide');
					} else {
					var msg = new SpeechSynthesisUtterance();
						msg.text = itemList[3];
						msg.lang = 'en-US';						
						window.speechSynthesis.speak(msg);	
					}					
				});
				var secondCol = $('<div></div>').addClass('second').html(itemList[2]);
				secondCol.click(function() {
					if(index == 0) {
						handleClass(content, 'third-cell-second-col-hide');
					} else {
						var msg = new SpeechSynthesisUtterance();
							msg.text = itemList[2];
							msg.lang = 'ko-KR';
							window.speechSynthesis.speak(msg);
					}
				});
                colRow.append(firstCol);
                colRow.append(secondCol);
            });
            $('.navButton').click();
            //console.log(textList);
        }
    });
}

$(function() {
    init();
});