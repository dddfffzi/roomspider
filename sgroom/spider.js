const fs = require('fs')

const {execSync} = require('child_process')

const _allRegions = ["Bedok","Changi","Paya Lebar","Pasir Ris","Tampines","Ang Mo Kio","Hougang","Punggol","Seletar","Sengkang","Serangoon","Lim Chu Kang","Mandai","Sembawang","Woodlands","Yishun","Bishan","Bukit Merah","Bukit Timah","Geylang","Kallang","Marine Parade","Novena","Queenstown","Tanglin","Toa Payoh","CBD","Newton","Orchard","Outram","Bukit Batok","Bukit Panjang","Boon Lay","Choa Chu Kang","Clementi","Jurong East","Jurong West","Pioneer","all-mrt-ns","Bukit Batok","Bukit Gombak","Choa Chu Kang","Yew Tee","Kranji","Marsiling","Woodlands","Admiralty","Sembawang","Yishun","Khatib","Yio Chu Kang","Ang Mo Kio","Bishan","Braddell","Toa Payoh","Novena","Newton","Orchard","Somerset","Dhoby Ghaut","City Hall","Raffles Place","Marina Bay","all-mrt-ew","Tampines","Simei","Changi Airport","Expo","Tanah Merah","Bedok","Kembangan","Eunos","Paya Lebar","Aljunied","Kallang","Lavender","Bugis","City Hall","Raffles Place","Tanjong Pagar","Outram Park","Tiong Bahru","Redhill","Queenstown","Commonwealth","Buona Vista","Dover","Clementi","Jurong East","Chinese Garden","Lakeside","Boon Lay","Pioneer","Joo Koon","HarbourFront","Outram Park","Chinatown","Clarke Quay","Dhoby Ghaut","Little India","Farrer Park","Boon Keng","Potong Pasir","Woodleigh","Serangoon","Kovan","Hougang","Buangkok","Sengkang","Punggol","Dhoby Ghaut","Bras Basah","Esplanade","Promenade","Nicoll Highway","Stadium","Mountbatten","Dakota","Paya Lebar","MacPherson","Tai Seng","Bartley","Serangoon","Lorong Chuan","Bishan","Marymount","Caldecott","Bukit Brown","Botanic Gardens","Farrer Road","Holland Village","Buona Vista","One-north","Kent Ridge","Haw Par Villa","Pasir Panjang","Labrador Park","Telok Blangah","HarbourFront","Nanyang Technological University","Singapore Management University","Singapore University of Technology and Design","Singapore Institute of Management","Singapore Polytechnic","Ngee Ann Polytechnic","Republic Polytechnic","Nanyang Polytechnic","Temasek Polytechnic","Management Development Institute of Singapore","EASB East Asia Institute of Management","PSB Academy","Kaplan","James Cook University","month","day","unit","master","common","other","share"]

const allRegions = []
_allRegions.forEach(item => {
    if (allRegions.indexOf(item) === -1) {
        allRegions.push(item)
    }
})

let list = []
allRegions.forEach((region, index) => {
    try {
        const cmd =
        `curl 'https://www.sgroom.com/PR/FI/any/${encodeURI(region.toLowerCase())}/0/99999999/0/any/1/1/1/1/1/0/-50/any/any/' -H 'pragma: no-cache' -H 'cookie: __cfduid=d98f6cd7413336dc21aa6aba8569e31241546072959; sessionid=8v86kb2w6uc7hetb4ds99dnabdpooio9; django_language=zh; _ga=GA1.2.321696698.1546072960; _gid=GA1.2.1190643403.1546072960' -H 'accept-encoding: gzip' -H 'accept-language: en-US,en;q=0.9' -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36' -H 'accept: application/json, text/javascript, */*; q=0.01' -H 'cache-control: no-cache' -H 'authority: www.sgroom.com' -H 'x-requested-with: XMLHttpRequest' -H 'referer: https://www.sgroom.com/web/index/all_mrt_ew/' --compressed
        `
        let res = JSON.parse(execSync(cmd).toString())
        res = res.map(item => {
            return Object.assign(item, {
                region,
                url: `https://www.sgroom.com/web/post/${item.post_id}/`
            })
        })
        list = list.concat(res)
        console.log(`${region}下 查到数据${res.length}条`)        
    } catch (e) {
        console.log(e)
        console.log(`${region}下 查询失败`)
    }
})

// console.log(list)

fs.writeFileSync('./total.json', JSON.stringify(list, null, 4))
