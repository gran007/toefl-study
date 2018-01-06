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
					var first = $('<div></div>').addClass('Rtable-cell first').html(itemList[0]);
					var second = $('<div></div>').addClass('Rtable-cell second').html(itemList[1]);
					third = $('<div></div>').addClass('Rtable-cell third');
					
					second.click(function(){					
						var msg = new SpeechSynthesisUtterance(itemList[1]+', '+itemList[3]);
						msg.lang = 'en-US';
						window.speechSynthesis.speak(msg);
					});
					
					content.append(first);
                    content.append(second);
                    content.append(third);
                }
                /*if(itemList[1].length != 0) {
                }*/
                row  = $('<div></div>').addClass('row');
                third.append(row);
                row.append($('<div></div>').addClass('first').html(itemList[3]));
                row.append($('<div></div>').addClass('second').html(itemList[2]));				

            });
            $('.navButton').click();
            //console.log(textList);
        }
    });
}

$(function() {
    init();
});