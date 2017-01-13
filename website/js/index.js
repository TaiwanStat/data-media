$('#page-1').addClass("load");​
$('.menu').on('click', function() {
    if ($('.container').hasClass('is-open')) {
        $('.menu').removeClass('is-active');
        $('.container').removeClass('is-open');
    } else {
        $('.menu').addClass('is-active');
        $('.container').addClass('is-open');
    }
});

$('.nav li').on('click', function(event) {
    var duration = 0;
    $('.nav-primary').removeClass('nav-primary').addClass('nav-secondary')
    $(this).removeClass('nav-secondary').addClass('nav-primary')

    if (event.target.id === 'button1') {
        $('#page-2').removeClass('load')
        $('#page-1').addClass('load');​

    } else if (event.target.id === 'button2') {
        $('#page-1').removeClass('load')
        $('#page-2').addClass('load');​
    }
});
/******fake data*****/
var barData = []
var media = ['蘋果日報', '聯合報', '自由時報', '東森新聞雲', '中國時報']
var mediaEN = ['apple', 'udn', 'liberty', 'ettoday', 'china']
var mediaEN2C = {
    "apple" : '蘋果日報',
    "udn":'聯合報',
    "liberty":'自由時報',
    "ettoday":'東森新聞雲',
    "china":'中國時報'
}
var mediaColor = {
    "中國時報": '#FF4081',
    "蘋果日報": '#303F9F',
    "東森新聞雲": '#FF5252',
    "自由時報": '#4CAF50',
    "聯合報": '#4CAF50'
}


