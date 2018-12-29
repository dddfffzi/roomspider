const fs = require('fs')
const total = JSON.parse(fs.readFileSync('./total.json'))

console.log(`总数: ${total.length}`)
const favRegions = ["Outram Park","Tiong Bahru","Redhill","Queenstown","Commonwealth","Buona Vista","Dover","Clementi","Jurong East","Chinese Garden","Lakeside","Boon Lay"]
const favTitle = ``
const minTime = '2018-11-01'
const isCooked = '可煮'

const arr = total.filter(item => {
    return favRegions.some(region => item.region.indexOf(region) !== -1)
        && item.title.indexOf(favTitle) !== -1
        && item.time >= minTime
        && (item.isCooked === isCooked)
}).map(item => {
    return {
        region: item.region,
        title: item.title,
        time: item.time,
        hasOwner: item.hasOwner,
        isCooked: item.isCooked,
        hasAgency: item.hasAgency,
        url: item.url
    }
})

console.log(`找到数: ${arr.length}`)

fs.writeFileSync('sgbbs_find.txt', JSON.stringify(arr, null, 4))
