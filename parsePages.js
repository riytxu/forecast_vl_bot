const puppeteer = require('puppeteer')

async function searchWeather() {

   // const browser = await puppeteer.launch(); // for win
   const browser = await puppeteer.launch({ // for linus
      executablePath: '/usr/bin/chromium-browser'
    });
   const page = await browser.newPage();

   await page.goto('https://www.gismeteo.ru/weather-vladivostok-4877/10-days/');

   const gismeteoSelector = {
      TypeOfWeather: (num) => {
         return `div.widget-row.widget-row-icon > div:nth-of-type(${num}) > div`
      },
      Temp: (num, temp) => {
         return `div.widget-row-chart.widget-row-chart-temperature > div > div > div:nth-of-type(${num}) > div.${temp} > span.unit.unit_temperature_c`
      },
      WildAndDegree: (selector) => {
         return `div.widget.widget-wind.widget-days > div.widget-body.widget-columns-10 > div > div ${selector}`
      },
      Precipitation: (num) => {
         return `div.widget-row.widget-row-precipitation-bars.row-with-caption > div:nth-of-type(${num}) > div:nth-of-type(1)`
      }
   }

   let gismeteoTypeOfWeather10Days = {}
   let gismeteoTempMax10Days = {}
   let gismeteoTempMin10Days = {}
   let gismeteoWild10Days = {}
   let gismeteoWildDegree10Days = {}
   let gismeteoPrecipitation10Days = {}

   for (let i = 1; i <= 10; i++) {
      gismeteoTypeOfWeather10Days[i] = await page
         .$eval(gismeteoSelector.TypeOfWeather(i), (element) => element.getAttribute('data-text'))

      gismeteoTempMax10Days[i] = await page
         .$eval(gismeteoSelector.Temp(i, 'maxt'), (element) => element.innerText + '°')

      if (!!await page.$(gismeteoSelector.Temp(i, 'mint'))) {
         gismeteoTempMin10Days[i] = await page
            .$eval(gismeteoSelector.Temp(i, 'mint'), (element) => element.innerText + '°')
      } else {
         gismeteoTempMin10Days[i] = ' -'
      }

      gismeteoWild10Days[i] = await page
         .$eval(gismeteoSelector.WildAndDegree(`> div.widget-row.widget-row-wind-speed > div:nth-of-type(${i}) > span`), (element) => element.innerText) + ' м/c'

      gismeteoWildDegree10Days[i] = await page
         .$eval(gismeteoSelector.WildAndDegree(`> div.widget-row.widget-row-wind-direction > div:nth-of-type(${i}) > div.direction`), (element) => element.innerText)

      gismeteoPrecipitation10Days[i] = await page
         .$eval(gismeteoSelector.Precipitation(i), (element) => element.innerText)
   } 

   await page.goto('https://primpogoda.ru/weather/vladivostok/.14days');

   const primpogodaSelector = {
      DayOfWeek: (week, num, div) => {
         return `div.forecast > div.table-container${week} > table.data.long.borders-vertical > tbody > tr.divider > td:nth-child(${num})${div}`
      },
      TypeOfWeather: (week, num) => {
         return `div.forecast > div.table-container${week} > table.data.long.borders-vertical > tbody > tr.weather.day > td:nth-child(${num}) > div`
      },
      Temp: (week, num, minMax) => {
         return `div.forecast > div.table-container${week} > table.data.long.borders-vertical > tbody > tr.temperature.divider.tip-right > td:nth-child(${num}) > span.font-lg${minMax}`
      },
      Wild: (week ,num) => {
         return `div.forecast > div.table-container${week} > table.data.long.borders-vertical > tbody > tr.wind.simple.tip-right > td:nth-of-type(${num}) > div`
      },
      Degree: (week, num) => {
         return `div.forecast > div.table-container${week} > table.data.long.borders-vertical > tbody > tr.wind-direction.tip-right > td:nth-of-type(${num}) > span`
      },
      Precipitation: (week, num) => {
         return `div.forecast > div.table-container${week} > table.data.long.borders-vertical > tbody > tr.precip.advanced.divider.tip-right > td:nth-of-type(${num})`
      }
   }

   let primpogodaDayOfMonth10Days = {}
   let primpogodaTypeOfWeather10Days = {}
   let primpogodaTempMin10Days = {}
   let primpogodaTempMax10Days = {}
   let primpogodaWild10Days = {}
   let primpogodaWildDegree10Days = {}
   let primpogodaPrecipitation10Days = {}

   for (let i = 1, week = '~.table-container'; i <= 10; i++) {
      if (i <= 7) {
         primpogodaDayOfMonth10Days[i] = await page
            .$eval(primpogodaSelector.DayOfWeek('', i, ''), (element) => element.innerText
            .split('').map((item) => {return (item == '\n') ? ' ' : item}).join('').split(' '))

         primpogodaTypeOfWeather10Days[i] = await page
            .$eval(primpogodaSelector.TypeOfWeather('', i), (element) => element.innerText)
         
         primpogodaTempMin10Days[i] = await page
            .$eval(primpogodaSelector.Temp('', i, '~.font-lg'), (element) => element.innerText)

         primpogodaTempMax10Days[i] = await page
            .$eval(primpogodaSelector.Temp('', i, ''), (element) => element.innerText)

         primpogodaWild10Days[i] = await page
            .$eval(primpogodaSelector.Wild('', i), (element) => element.innerText)

         primpogodaWildDegree10Days[i] = await page
            .$eval(primpogodaSelector.Degree('', i), (element) => element.innerText)

         primpogodaPrecipitation10Days[i] = await page
            .$eval(primpogodaSelector.Precipitation('', i), (element) => element.innerText)

      } else {
         primpogodaDayOfMonth10Days[i] = await page
            .$eval(primpogodaSelector.DayOfWeek(week, i - 7, ''), (element) => element.innerText
            .split('').map((item) => {return (item == '\n') ? ' ' : item}).join('').split(' '))

         primpogodaTypeOfWeather10Days[i] = await page
            .$eval(primpogodaSelector.TypeOfWeather(week, i - 7), (element) => element.innerText)

         primpogodaTempMin10Days[i] = await page
            .$eval(primpogodaSelector.Temp(week, i - 7, '~.font-lg'), (element) => element.innerText)

         primpogodaTempMax10Days[i] = await page
            .$eval(primpogodaSelector.Temp(week, i - 7, ''), (element) => element.innerText)

         primpogodaWild10Days[i] = await page
            .$eval(primpogodaSelector.Wild(week, i - 7), (element) => element.innerText)

         primpogodaWildDegree10Days[i] = await page
            .$eval(primpogodaSelector.Degree(week, i - 7), (element) => element.innerText)

         primpogodaPrecipitation10Days[i] = await page
            .$eval(primpogodaSelector.Precipitation(week, i - 7), (element) => element.innerText)
      }
   }

   await browser.close()

   const resulrObj = {
      gismeteo: {
         TypeOfWeather10Days: gismeteoTypeOfWeather10Days,
         TempMin10Days: gismeteoTempMin10Days,
         TempMax10Days: gismeteoTempMax10Days,
         Wild10Days: gismeteoWild10Days,
         WildDegree10Days: gismeteoWildDegree10Days,
         Precipitation10Days: gismeteoPrecipitation10Days
      },
      primpogoda: {
         DayOfWeek: primpogodaDayOfMonth10Days,
         TypeOfWeather10Days: primpogodaTypeOfWeather10Days,
         TempMin10Days: primpogodaTempMin10Days,
         TempMax10Days: primpogodaTempMax10Days,
         Wild10Days: primpogodaWild10Days,
         WildDegree10Days: primpogodaWildDegree10Days,
         Precipitation10Days: primpogodaPrecipitation10Days
      }
   }
   return resulrObj
}
module.exports = {searchWeather}