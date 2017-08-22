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
        $.each(fileList, function(index, item) {
            var li = $('<li></li>').addClass(item.type).html(item.name).attr('filePath', item.path);;
            li.click(fileClick);
            ul.append(li);
        });
        $('.sidenav').append(ul);
        $('.navButton').click();
    });
}

// list 선택시 이벤트
function fileClick(e) {
    $(this).addClass('selected');
    $(this).siblings().removeClass('selected');
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
                    content.append($('<div></div>').addClass('Rtable-cell first').html(itemList[0]));
                }
                if(itemList[1].length != 0) {
                    content.append($('<div></div>').addClass('Rtable-cell second').html(itemList[1]));
                }
                content.append($('<div></div>').addClass('Rtable-cell third').html(itemList[2]));
                content.append($('<div></div>').addClass('Rtable-cell forth').html(itemList[3]));
            });
            $('.navButton').click();
            //console.log(textList);
        }
    });
}

$(function() {
    init();
});