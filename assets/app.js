/* global Firebase */
if (window.analytics) {
    var lang = $('html').attr('lang')

    window.analytics.page('Landing', {
        language: lang
    })

    analytics.trackLink($('[href="/client/#auth/login"]'), 'Clicked Login')
    analytics.trackLink($('[href="/client/#auth/register"]'), 'Clicked Sign Up')
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, '$1 $2')
    return x;
}


$(function() {
    $('.customer-count').css('opacity', 0);

    var supportsSvg = function() {
        var e = document.createElement('div');
        e.innerHTML = '<svg></svg>';
        return !!(window.SVGSVGElement && e.firstChild instanceof window.SVGSVGElement);
    };

    if (!supportsSvg())
    {
        $('.header .logo').attr('src', '/cryptonext.png');
    }

    if (window.Firebase) {
        var firebaseName = 'cryptonext-dev'

        if (window.environment == 'production') firebaseName = 'cryptonext'
        if (window.environment == 'staging') firebaseName = 'cryptonext-staging'

        var firebaseRef = new Firebase('https://' + firebaseName + '.firebaseIO.com/')

        var stats = firebaseRef.child('/stats/userCount');
        stats.on('value', function(snapshot) {
            var count = numberWithCommas(snapshot.val())
            $('.user-count').text(count);
            $('.customer-count').animate({opacity: 1}, 500);
        });

        var exchangeRates = firebaseRef.child('/stats/exchangeRates');
        exchangeRates.on('value', function(snapshot) {
            var data = snapshot.val();
            
            $('#BTCUSD').text(data['BTCUSD']);
            $('#BTCEUR').text(data['BTCEUR']);
            $('div.exchangerates').fadeTo('slow', 1);
        });
    }

    $('.flags a[href="#set-language"]').click(function(event){
        event.preventDefault();
        var language = $(this).attr('data-language');
        var path = window.location.pathname;
        var date = new Date();
        date.setFullYear(date.getFullYear() + 10);

        if (language == 'en-US' && path != '/en/') {
            document.cookie = 'language=en-US;expires=' + date.toGMTString() + ';path=/';
            window.location = '/en/';
        }
		else if (language == 'pt-PT' && path != '/pt/') {
            document.cookie = 'language=pt-PT;expires=' + date.toGMTString() + ';path=/';
            window.location = '/pt/';
        }
    });
})
