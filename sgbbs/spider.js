const {execSync} = require('child_process')
const cheerio = require('cheerio')
const moment = require('moment')
const fs = require('fs')

const getPageRes = (page = 1) => {
    const cmd = `curl 'https://bbs.sgcn.com/forum-138-${page}.html' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'Referer: https://bbs.sgcn.com/forum-138-2.html' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9' -H 'Cookie: pgv_pvi=6870726020; _ga=GA1.2.1831752351.1528865790; iZOJfd_c4f3_saltkey=K2sCr8JG; iZOJfd_c4f3_lastvisit=1546074267; iZOJfd_c4f3_visitedfid=138; PHPSESSID=19qcmmiceidl440p36t8t5ttp5; _gid=GA1.2.1655498110.1546077868; iZOJfd_c4f3_sendmail=1; iZOJfd_c4f3_st_t=0%7C1546078587%7Caaeaeec1d40dd3340aaff61140281765; iZOJfd_c4f3_forum_lastvisit=D_138_1546078587; iZOJfd_c4f3_home_diymode=1; iZOJfd_c4f3_lastact=1546078647%09forum.php%09ajax' --compressed`
    
    const res = execSync(cmd).toString()
    
    const $ = cheerio.load(res)
    
    const len = $("#threadlisttableid tr").length
    const result = []
    for (let i = 0; i < len ; i ++) {
        const tr = $("#threadlisttableid tr").eq(i)
        const tags = tr.find('.common em').text()
        if (tags.indexOf('出租') !== -1) {
            const region = tr.find('.common em').eq(1).text()
            const title = tr.find('.common a.xst').text()
            const author = tr.find('.by').eq(0).find('cite a').text()
            let time = tr.find('.by').eq(0).find('span').text()
            if (time.indexOf('天前') !== -1) {
                try {
                    const dayOff = parseInt(time)
                    time = moment().add(-dayOff, 'days').format('YYYY-MM-DD')
                } catch (e) {}
            } else {
                time = time.split('-').map(item => {
                    item = parseInt(item)
                    if (item < 10) {
                        item = '0' + item
                    }
                    return item
                }).reverse().join('-')
            }
            const url = tr.find('.common a.xst').attr('href')
            // 获取content 是否可煮 是否有屋主 电话 联系人
            const postCmd = `curl '${url}' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.9' -H 'Cookie: pgv_pvi=6870726020; _ga=GA1.2.1831752351.1528865790; iZOJfd_c4f3_saltkey=K2sCr8JG; iZOJfd_c4f3_lastvisit=1546074267; iZOJfd_c4f3_visitedfid=138; PHPSESSID=19qcmmiceidl440p36t8t5ttp5; _gid=GA1.2.1655498110.1546077868; iZOJfd_c4f3_home_diymode=1; iZOJfd_c4f3_st_t=0%7C1546079957%7C9e40b9c43b728429ef261df89ec8ae3c; iZOJfd_c4f3_forum_lastvisit=D_138_1546079957; iZOJfd_c4f3_sendmail=1; iZOJfd_c4f3_st_p=0%7C1546080753%7Ce46b28972a0991083c1b3970d20e45bd; iZOJfd_c4f3_viewid=tid_16439865; iZOJfd_c4f3_lastact=1546080753%09connect.php%09check' --compressed`
            const postRes = execSync(postCmd).toString()
            
            const postBody = cheerio.load(postRes)
            const postCode = postBody('table.mbm tr').eq(2).find('td').text().trim()
            const hasOwner = postBody('table.mbm tr').eq(8).find('td').text().trim()            
            const isCooked = postBody('table.mbm tr').eq(9).find('td').text().trim()
            const hasAgency = postBody('table.mbm tr').eq(11).find('td').text().trim()
            const contact = postBody('table.mbm tr').eq(12).find('td').text().trim()
            const phone = postBody('table.mbm tr').eq(14).find('td').text().trim()
            const content = postBody('table.t_fsz').text().trim()
            
            result.push({
                region,
                title,
                author,
                time,
                url,
                postCode,
                hasOwner,
                isCooked,
                hasAgency,
                contact,
                phone,
                content
            })
        }
    }
    return result
}

const main = () => {
    let total = []
    for (let page = 1; page <= 50; page ++) {
        const result = getPageRes(page)
        total = total.concat(result)
        console.log(`第${page}页，已找到${result.length}条`)
    }
    console.log(`一共找到${total.length}条`)
    fs.writeFileSync('./total.json', JSON.stringify(total, null, 4))
}

main()
