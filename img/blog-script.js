$('.share_icon_1').mouseenter(function () {
    $('.share_icon_1 path').css('fill', '#10345A');
});

$('.share_icon_1').mouseleave(function () {
    $('.share_icon_1 path').css('fill', '#8C8C8C');
});

$('.share_icon_2').mouseenter(function () {
    $('.share_icon_2 path').css('fill', '#10345A');
});

$('.share_icon_2').mouseleave(function () {
    $('.share_icon_2 path').css('fill', '#8C8C8C');
});


$('.see_more').click(function () {
    if ($('.more_tags').css('display') == "none") {
        $('.more_tags').slideDown(200);
    }
    else {
        $('.more_tags').slideUp(200);
    }
});

$(document).ready(function () {
    $('.pool_link').click(function () {
        if ($('.tag_pool').css('height') == '135px') {
            $('.tag_pool').css('height', 'fit-content');
            $(".pool_link").html("See less");
            return false;
        }
        else {
            $('.tag_pool').css('height', '135px');
            $(".pool_link").html("See more");
            return false;
        }
    });
});

$(window).resize(function () {
    if ($(window).width() <= 760) {
        $('.tag_pool').css('height', '135px');
        $(".pool_link").html("See more");
    }
    if ($(window).width() > 760) {
        $('.tag_pool').css('height', 'fit-content');
    }
});

var starClicked = false;

$(function () {
    $('.star').click(function () {
        $(this).children('.selected').addClass('is-animated');
        $(this).children('.selected').addClass('pulse');

        var target = this;

        setTimeout(function () {
            $(target).children('.selected').removeClass('is-animated');
            $(target).children('.selected').removeClass('pulse');
        }, 1000);

        starClicked = true;
    })

    $('.full').click(function () {
        if (starClicked == true) {
            setFullStarState(this)
        }
        $(this).closest('.rating').find('.js-score').text($(this).data('value'));

        $(this).find('js-average').text(parseInt($(this).data('value')));

        $(this).closest('.rating').data('vote', $(this).data('value'));

        console.log(parseInt($(this).data('value')));
    })

    $('.full').hover(function () {
        if (starClicked == false) {
            setFullStarState(this)
        }
    })

    $('.full').focus(function () {
        if (starClicked == false) {
            setFullStarState(this)
        }
    })
})

function updateStarState(target) {
    $(target).parent().prevAll().addClass('animate');
    $(target).parent().prevAll().children().addClass('star-colour');
    $(target).parent().nextAll().removeClass('animate');
    $(target).parent().nextAll().children().removeClass('star-colour');
}

function setFullStarState(target) {
    $(target).addClass('star-colour');
    $(target).parent().addClass('animate');
    $(target).siblings('.half').addClass('star-colour');
    updateStarState(target)
}