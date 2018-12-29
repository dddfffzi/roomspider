const fs = require('fs')
const total = JSON.parse(fs.readFileSync('./total.json'))

console.log(`总数: ${total.length}`)
const maxPrice = 850
const minPrice = 600
const favRegions = ["Outram Park","Tiong Bahru","Redhill","Queenstown","Commonwealth","Buona Vista","Dover","Clementi","Jurong East","Chinese Garden","Lakeside","Boon Lay"]
const favTitle = `可煮`
const minTime = '2018-11-01 15:35:55+08:00'

const arr = total.filter(item => {
    return item.price >= minPrice 
        && item.price <= maxPrice
        && favRegions.indexOf(item.region) !== -1
        && item.title.indexOf(favTitle) !== -1
        && item.time >= minTime
}).map(item => {
    return {
        region: item.region,
        title: item.title,
        price: item.price,
        url: item.url
    }
})

console.log(`找到数: ${arr.length}`)
fs.writeFileSync('sgroom_find.txt', JSON.stringify(arr, null, 4))
