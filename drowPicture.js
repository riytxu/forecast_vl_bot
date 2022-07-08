const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const weather = require('./parsePages.js')

async function drowPicture() {

  const weatherContent = await weather.searchWeather()
  const width = 860
  const height = 1530
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')
  const image = await loadImage((function() {
    let TypeOfWeather = weatherContent.primpogoda.TypeOfWeather10Days[1].toLowerCase()
    if (TypeOfWeather.includes('дождь') || TypeOfWeather.includes('пасмурно') || TypeOfWeather.includes('туман')) { return './rain.png'}
    else { return './sun.png'}
  }()));
  context.drawImage(image, 0, 0, width, height)
  context.textAlign = 'center'
  context.fillStyle = '#FFFFFF'

  let choiceIcon = (num) => {
    let TypeOfWeather = weatherContent.primpogoda.TypeOfWeather10Days[num].toLowerCase()
    if (TypeOfWeather.includes('дождь')) {
      return './icon_rain.png'
    } else if (TypeOfWeather.includes('туман') || TypeOfWeather.includes('пасмурно')) {
      return './icon_fog.png'
    } else if (TypeOfWeather.includes('облачно')) {
      return './icon_cloudy.png'
    } else {
      return './icon_sun.png'
    }
  }

  let DayOfWeek = weatherContent.primpogoda.DayOfWeek

  let replaceDegree = (num) => {
    let primpogodaDegree = weatherContent.primpogoda.WildDegree10Days[num].toLowerCase()
    if (primpogodaDegree === 'южный') { return 'Ю' }
    else if (primpogodaDegree === 'юго-западный') { return 'ЮЗ' }
    else if (primpogodaDegree === 'юго-восточный') { return 'ЮВ' }
    else if (primpogodaDegree === 'восточный') { return 'В' }
    else if (primpogodaDegree === 'северо-восточный') { return 'СВ' }
    else if (primpogodaDegree === 'северный') { return 'С' }
    else if (primpogodaDegree === 'северо-западный') { return 'СЗ' }
    else if (primpogodaDegree === 'западный') { return 'З' }
    else {return ' - '}
  }

  let primpogodaPrecipitation = (num) => {
    let Precipitation = weatherContent.primpogoda.Precipitation10Days[num]
    if (Precipitation === '') { return '-'}
    else { return Precipitation.replace('.', ',')}
  }

  let gismeteoPrecipitation = (num) => {
    let Precipitation = weatherContent.gismeteo.Precipitation10Days[num]
    if (Precipitation === '0') { return '-'}
    else { return Precipitation + ' мм'}
  }

  (async function firstBlock() {

    let centrX = 430;
    let leftX = 200;
    let rightX = 650;

    /* icon */

    let iconDiameter = 200
    let icon = await loadImage(choiceIcon(1))
    context.drawImage(icon, centrX - iconDiameter/2, 220 - iconDiameter/2, iconDiameter, iconDiameter)

    /* day of week/mounth */

    context.font = 'bold 35pt Sans'
    context.fillText(DayOfWeek[1][0] + ' ' + DayOfWeek[1][1] + ' ' + DayOfWeek[1][2], centrX, 80)

    /* temp max/min */

    context.font = 'bold 30pt Sans'
    context.fillText(weatherContent.primpogoda.TempMax10Days[1] + '' + weatherContent.primpogoda.TempMin10Days[1], leftX, 230)
    context.fillText(weatherContent.gismeteo.TempMax10Days[1] + weatherContent.gismeteo.TempMin10Days[1], rightX, 230)

    /* wind + degree */

    context.fillText(weatherContent.primpogoda.Wild10Days[1] + ' ' + replaceDegree(1), leftX, 340)
    context.fillText(weatherContent.gismeteo.Wild10Days[1] + ' ' + weatherContent.gismeteo.WildDegree10Days[1], rightX, 340)

    /* precipitation */

    context.fillText(primpogodaPrecipitation(1), leftX, 440)
    context.fillText(gismeteoPrecipitation(1), rightX, 440)

    /* type of weather */

    context.font = 'italic 30pt Sans'
    context.fillText(weatherContent.primpogoda.TypeOfWeather10Days[1], centrX, 520)

  }());

  (async function secondBlock() {

    let iconDiameter = 150

    for (let num = 2, x = 130; num <= 5; num++, x+= 200) {

      /* icon */
      let icon = await loadImage(choiceIcon(num))
      context.drawImage(icon, x - iconDiameter/2, 830 - iconDiameter/2, iconDiameter, iconDiameter)

      /* day of week/mounth */
      context.font = 'bold 20pt Sans'
      context.fillText(DayOfWeek[num][0] + ' ' + DayOfWeek[num][1], x, 710)
      context.fillText(DayOfWeek[num][2], x, 735)

      /* temp max/min */
      context.fillText(weatherContent.primpogoda.TempMax10Days[num] + '' + weatherContent.primpogoda.TempMin10Days[num], x, 940)
      context.fillText(weatherContent.gismeteo.TempMax10Days[num] + weatherContent.gismeteo.TempMin10Days[num], x, 1070)

      /* wind + degree */
      context.fillText(weatherContent.primpogoda.Wild10Days[num] + ' ' + replaceDegree(num), x, 965)
      context.fillText(weatherContent.gismeteo.Wild10Days[num] + ' ' + weatherContent.gismeteo.WildDegree10Days[num], x, 1095)

      /* precipitation */
      context.fillText(primpogodaPrecipitation(num), x, 995)
      context.fillText(gismeteoPrecipitation(num), x, 1125)
    }

  }());

  (async function thirdBlock() {

    let iconDiameter = 100

    for (let num = 6, x = 100; num <= 10; num++, x+= 165) {
      
      /* icon */
      icon = await loadImage(choiceIcon(num))
      context.drawImage(icon, x - iconDiameter/2, 1300 - iconDiameter/2, iconDiameter, iconDiameter)

      /* day of week/mounth */
      context.font = 'bold 15pt Sans'
      context.fillText(DayOfWeek[num][0] + ' ' + DayOfWeek[num][1], x, 1235)

      /* temp max/min */
      context.font = 'bold 14pt Sans'
      context.fillText(weatherContent.primpogoda.TempMax10Days[num] + '' + weatherContent.primpogoda.TempMin10Days[num], x, 1375)
      context.fillText(weatherContent.gismeteo.TempMax10Days[num] + weatherContent.gismeteo.TempMin10Days[num], x, 1460)

      /* wind + degree */
      context.fillText(weatherContent.primpogoda.Wild10Days[num] + ' ' + replaceDegree(num), x, 1395)
      context.fillText(weatherContent.gismeteo.Wild10Days[num] + ' ' + weatherContent.gismeteo.WildDegree10Days[6], x, 1480)

      /* precipitation */
      context.fillText(primpogodaPrecipitation(num), x, 1415)
      context.fillText(gismeteoPrecipitation(num), x, 1500)
    }

  }())

  .then(() => {
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./return.png', buffer)
  })

}
module.exports = {drowPicture}