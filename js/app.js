// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app = new Framework7({
    root: '#app', // App root element
    id: 'io.framework7.AwesomeApp', // App bundle ID
    name: 'Awesome Weather App', // App name
    theme: 'auto', // Automatic theme detection
    routes: routes,   // App routes
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
    url: '/'
});

//list of cities
let cities = ('Pretoria,Polokwane,Johannesburg,Bloemfontein,Cape Town,Port Elizabeth,East London,Mthatha,Queenstown,' +
    'Uitenhage,Sasolburg,Soweto,Roodepoort,Vanderbijlpark,Vereeniging,Durban,Pietermaritzburg,Lebowakgomo,' +
    'Musina,Nelspruit,Emalahleni,Mafikeng,Rustenburg,Potchefstroom,Kimberley,Paarl,Stellenbosch,Worcester').split(',');

//create auto complete
app.autocomplete.create({
    inputEl: '#autocomplete-dropdown-placeholder',
    openIn: 'dropdown',
    dropdownPlaceholderText: 'Try to type "Pretoria"',
    source: function (query, render) {
        var results = [];
        if (query.length === 0) {
            render(results);
            return;
        }
        // Find matched items
        for (var i = 0; i < cities.length; i++) {
            if (cities[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(cities[i]);
        }
        // Render items by passing array with result items
        render(results);
    }
});

var img;
var min;
var max;
var dsc;
var cty;

$$('#btnWeather').on('click', function () {

    //set up source
    let url = 'http://api.openweathermap.org/data/2.5/weather';
    let appId = 'a080d3b91e8e841d6f6c1ac46fba8e44';

    //city variables
    let cityName = $$('#autocomplete-dropdown-placeholder').val();
    let countryCode = 'za';

    //validate blank
    if (cityName == "") {
        return false;
    }

    //get request
    app.request({
        url: url,
        data: {q: cityName + ',' + countryCode, units: 'metric', appid: appId},
        type: 'GET',
        beforeSend: function () {
            app.preloader.show();
        },
        success: function (data) {

            let obj = JSON.parse(data);

            console.log(obj);

            testVar = obj.name;

            img = 'background-image:url(http://openweathermap.org/img/w/' + obj.weather[0].icon + '.png)';
            cty = obj.name + ', ' + obj.sys.country;
            dsc = obj.weather[0].description;
            min = 'Min temperature: ' + obj.main.temp_min;
            max = 'Max temperature: ' + obj.main.temp_max;

            app.preloader.hide();
            dynamicPopup.open();

        },
        statusCode: {
            404: function () {
                app.preloader.hide();
                cityNotFoundPopOver.open();
            }
        },
        error:function(xhr, status){

            if (status == 0)
            {

            }

            if (status == 404)
            {

            }

            //alert('an error occurred');
            app.preloader.hide();
        }
    });

});

function getTodayDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + '/' + mm + '/' + yyyy;

    return today;
}

let cityNotFoundPopOver = app.popover.create({
    targetEl: '#autocomplete-dropdown-placeholder',
    content: '<div class="popover">' +
        '<div class="popover-inner">' +
        '<div class="block">' +
        '<p id="notfound"></p>' +
        '</div>' +
        '</div>' +
        '</div>',
    // Events
    on: {
        open: function () {
            let val = $$('#autocomplete-dropdown-placeholder').val();
            $$('#notfound').text(val + ' city not found.');
        }
    }
});

var dynamicPopup = app.popup.create({
    content:
        '<div class="popup" id="my-popup">\n' +
        '<div class="card demo-card-header-pic">\n' +
        '<div id="picDiv" class="card-header align-items-flex-end"></div>\n' +
        '<div class="card-content card-content-padding">\n' +
        '<p class="date" id="date"></p>\n' +
        '<p id="min"></p>\n' +
        '<p id="max"></p>\n' +
        '<p id="descr"></p>\n' +
        '</div>\n' +
        '</div>\n' +
        '<div class="card-footer">\n' +
        '<a href="#" class="link popup-close right" >Close</a>\n' +
        '</div>\n' +
        '</div>',
    // Events
    on: {
        open: function () {
            $$('#picDiv').attr('style', img);
            $$('#picDiv').text(cty);
            $$('#descr').text(dsc);
            $$('#min').text('Min temperature: ' + min);
            $$('#max').text('Max temperature: ' + max);
            $$('#date').text('Today\'s date: ' + getTodayDate());
        }
    }
});