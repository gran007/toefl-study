var text = '';
var textList = [];
var index = 0;
var time = 0;
var timer;
var isLast = false;
var cookie = false;
var slideDuration = 200;

// javascript 시작시 이벤트
function init() {
    getFileList();
    setPageEvent();
    setTextAreaEvent();
    setCheckBoxEvent();
	setSpeakEvent();
}

function getFileList() {
    $.getJSON('/writingFileList', function(fileList) {
        var ul = $('<ul></ul>');
        $.each(fileList, function(index, item) {
            var type = item.type;
            var li = $('<li></li>').addClass(type).html(item.name);
            var ul2 = $('<ul></ul>');
            ul2.hide();
            li.append(ul2);
            $.each(item.subList, function(fileIndex, fileItem) {
                var li2 = $('<li></li>').addClass(fileItem.type).html(fileItem.name).attr('filePath', fileItem.path);
                li2.click(fileClick);
                ul2.append(li2);
            });
            li.click(folderClick);
            ul.append(li);
        });
        $('.sidenav').append(ul);
        var lastSelectedFileName = $.cookie('lastSelectedFileName');
        index = parseInt($.cookie('paragraphIndex'));
        $.each($('.sidenav ul li'), function(index, item) {
            if($(item).html() === lastSelectedFileName) {
                item.click();
                cookie = true;
                return;
            }
        });
        if(!cookie) {
            $('.sidenav ul li:first-child').click();
        }
    });
}

function folderClick() {
    $(this).siblings().removeClass('selected');
    $(this).siblings().children().slideUp(slideDuration);
    if($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        $(this).children().slideUp(slideDuration);
    } else {
        $(this).addClass('selected');
        $(this).children().slideDown(slideDuration);
    }
}

// list 선택시 이벤트
function fileClick(e) {
    e.stopPropagation();
    time = 0;
    setTimer();
    $('.file').removeClass('selected');
    $(this).parent().parent().addClass('selected');
    $(this).parent().slideDown(slideDuration);
    $(this).addClass('selected');
    $.cookie('lastSelectedFileName', $(this).html(), { expires : 30 });
    var filePath = $(this).attr('filePath');
    $('.textArea').val('');
    $.ajax({
        url: '/readFile',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({filePath: filePath}),
        success: function(list) {
            textList = list;
            if(!cookie) {
                if(isLast) {
                    index = textList.length - 1;
                } else {
                    index = 0;
                }
                isLast = false;
            } else {
                cookie = false;
            }
            setText();
        }
    });
}

function setTimer() {
    $('#timer').text("00:00:00");
    clearInterval(timer);
    timer = setInterval(function() {
        time += 1;
        var hour = parseInt(time / 3600);
        var minute = parseInt((time - hour * 3600) / 60);
        var second = parseInt(time - hour * 3600 - minute * 60);
        $('#timer').text(getTimeFormat(hour, minute, second));
    }, 1000);
}

function getTimeFormat(hour, minut, second) {
    return ("0" + hour).slice(-2) + ":" +
        ("0" + minut).slice(-2) + ":" +
        ("0" + second).slice(-2) ;
}

// diff checker
function getDifference(b)
{
    var result = "";
    for(var i = 0, len = b.length; i < len; i++) {
        if(text[i] == b[i]) {
            result += b[i];
        } else {
            break;
        }
    }
    return result;
}

function setPageEvent() {
    $('.arrowUp').click(function() {
        setPrevPage();
    });
    $('.arrowDown').click(function() {
        setNextPage();
    });
}

function setTextAreaEvent() {
    $('.textArea').bind('input propertychange', function() {
        var result = getDifference(this.value);
        $('.checked').text(result);
        $('.unchecked').text(text.substr(result.length));
    });

    $('.textArea').keyup(function(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 33) {  // page up & enter
            setPrevPage();
        } else if(code == 34 || code == 13) { // page down
            setNextPage();
        }
    });
}

function setPrevPage() {
    var preIndex = index;
    if(index - 1 >= 0) {
        index -= 1;
    } else {
        isLast = true;
        $('li.file.selected').prev().click();
    }
    if(preIndex != index) {
        $('.textArea').val('');
        setText();
    }
    $.cookie('paragraphIndex', index, { expires : 30 });
}

function setNextPage() {
    var preIndex = index;
    if(index + 1 < textList.length) {
        index += 1;
    } else {
        isLast = false;
        $('li.file.selected').next().click();
    }
    if(preIndex != index) {
        $('.textArea').val('');
        setText();
    }
    $.cookie('paragraphIndex', index);
}

function setCheckBoxEvent() {
    $('#showTextCheckBox').change(function(){
        if($(this).is(":checked")){
            $('.unchecked').removeClass('hidden');
        }else{
            $('.unchecked').addClass('hidden');
        }
    });
}

// page up down 시 페이지 새로 세팅
function setText() {
    if(textList.length > index) {
        text = textList[index]
            .replace(/\s\s+/g, ' ')
            .replace(/[’‘]/g, "'")
            .replace(/[“”]/g,'"');
    }
    $('.checked').text("");
    $('.unchecked').text(text);
    $('.textArea').focus();
}

var sayTimeout = null;

function setSpeakEvent() {
	$('.speak').click(function() {
		var text = '';
		text += $('.text>.checked').html();
		text += $('.text>.unchecked').html();
		say(text);
	});
}

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

$(function() {
    init();
});