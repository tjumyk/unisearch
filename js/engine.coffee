angular.module('app').factory 'engine', ['$http', '$q', '$sce', 'util', ($http, $q, $sce, util)->
  clean_text = (text)->
    return text.replace(/\s+/g, ' ').trim()

  service =
    providers:
      youdaodict:
        name: '有道词典'
        url: 'https://dict.youdao.com'
        templateUrl: 'ui/youdaodict.html'
        templateOnLoad: ->
          $('.pro_trans.ui.accordion').accordion()
          return
        executor: (task)->
          new $q (resolve, reject)->
            $http.get("https://dict.youdao.com/w/eng/#{encodeURIComponent(task.keyword)}/").then (response)->
              try
                doc = response.data
                $doc = $(doc)

                typo_corrections = []

                $error_wrapper = $doc.find('.error-wrapper:first')
                if $error_wrapper.length
                  $error_wrapper.find('.typo-rel').each ->
                    $suggestion = $(@)
                    $title = $suggestion.find('.title:first')
                    key = $title.text()
                    $title.remove()
                    meaning = $suggestion.text().trim()
                    typo_corrections.push
                      keyword: key
                      meaning: meaning

                pronounces = {}
                trans_lines = []

                $phrs_list_tab = $doc.find('#phrsListTab')
                if $phrs_list_tab.length
                  $wordbook = $phrs_list_tab.find('.wordbook-js:first')
                  if $wordbook.length
                    keyword = $wordbook.find('.keyword:first').text().trim()
                    $wordbook.find('.pronounce').each ->
                      $pronounce = $(@)
                      text = $pronounce.text().trim()
                      if text.length == 0
                        return
                      pronounce_type = text[0]
                      phonetic = $pronounce.find('.phonetic:first').text().trim()
                      if pronounce_type == '美'
                        pronounces['us'] = phonetic
                      else if pronounce_type == '英'
                        pronounces['gb'] = phonetic
                  $phrs_list_tab.find('.trans-container li').each ->
                    trans_lines.push($(@).text().trim())

                web_trans = []

                $t_web_trans = $doc.find('#tWebTrans')
                if $t_web_trans.length
                  $t_web_trans.find('.wt-container').each ->
                    $wt_container = $(@)
                    title = clean_text($wt_container.find('.title:first').text())
                    content = $wt_container.find('.collapse-content:first').html().trim()
                    web_trans.push {
                      title
                      content
                    }

                web_phrases = []

                $web_phrases = $doc.find('#webPhrase')
                if $web_phrases.length
                  $web_phrases.find('.wordGroup').each ->
                    $word_group = $(@)
                    title = clean_text($word_group.find('.contentTitle:first').text())
                    content = clean_text($word_group.text()).substring(title.length).trim()
                    web_phrases.push {
                      title,
                      content
                    }

                pro_trans = []

                $t_pe_trans_type_list = $doc.find('#tPETrans-type-list')
                $t_pe_trans_all_trans = $doc.find('#tPETrans-all-trans')
                if $t_pe_trans_type_list.length and $t_pe_trans_all_trans.length
                  type_names = {}
                  type_items = {}
                  rank_list = []
                  $t_pe_trans_type_list.find('.p-type').each ->
                    $p_type = $(@)
                    t_name = $p_type.text().trim()
                    t_id = $p_type.attr('rel')
                    type_names[t_id] = t_name
                    rank_score = 0
                    if t_name.indexOf('计算机') >= 0
                      rank_score += 10
                    if t_name.indexOf('数学') >= 0
                      rank_score += 8
                    if t_name.indexOf('电子') >= 0
                      rank_score += 3
                    if t_name.indexOf('技术') >= 0
                      rank_score += 1
                    rank_list.push([t_id, rank_score])
                  $t_pe_trans_all_trans.find('li.types').each ->
                    $type = $(@)
                    t_id = undefined
                    for clz in $type.attr('class').split(/\s+/)
                      if clz.indexOf('ptype_') == 0
                        t_id = clz
                        break
                    if t_id == undefined
                      throw 't_id not found'

                    items = []
                    $type.find('.items').each ->
                      $items = $(@)
                      title = $items.find('.title:first').text().trim()
                      ref_num = undefined
                      ref_source = undefined
                      source = undefined
                      trans = undefined
                      $items.find('.additional').each ->
                        $additional = $(@)
                        t = $additional.text().trim()
                        key = '引用次数：'
                        ind = t.indexOf(key)
                        if ind >= 0
                          ref_num = parseInt(t.substring(ind + key.length))
                        else
                          key = '参考来源 -'
                          ind = t.indexOf(key)
                          if ind >= 0
                            ref_source_title = t.substring(ind + key.length).trim()
                            ref_source_url = undefined
                            $ref = $additional.next()
                            if $ref.length
                              ref_source_title = $ref.text().trim()
                              ref_source_url = $ref.attr('href')
                            ref_source =
                              title: ref_source_title
                              url: ref_source_url
                      $item_source = $items.find('.source:first')
                      if $item_source.length
                        source = $item_source.html().trim()
                      $item_trans = $items.find('.trans:first')
                      if $item_trans.length
                        trans = $item_trans.html().trim()
                      items.push {
                        title,
                        ref_num,
                        ref_source,
                        source,
                        trans
                      }
                    type_items[t_id] = items

                  rank_list.sort (a, b)->b[1] - a[1]
                  for sort_item in rank_list
                    t_id = sort_item[0]
                    pro_trans.push
                      field: type_names[t_id]
                      items: type_items[t_id]

                resolve {
                  keyword
                  typo_corrections
                  pronounces
                  trans_lines
                  web_trans
                  web_phrases
                  pro_trans
                }
              catch exception
                reject(exception)
            , (response)->
              reject(util.formatResponseError(response))

      wikipedia:
        name: 'Wikipedia'
        url: 'https://en.wikipedia.org'
        templateUrl: 'ui/wikipedia.html'
        templateOnLoad: -> return
        executor: (task)->
          new $q (resolve, reject)->
            kw = task.keyword
            api_host = "https://en.wikipedia.org"
            api = api_host + "/w/api.php?action=query&format=json&prop=extracts%7Cpageimages%7Crevisions%7Cinfo%7Ccategories%7Clinks&pllimit=50&redirects=true&exintro=false&exsentences=2&explaintext=true&piprop=thumbnail&pithumbsize=320&rvprop=timestamp&inprop=watched&indexpageids=true&titles=" + encodeURIComponent(kw)
            $http.get(api).then (response)->
              raw = response.data
              query = raw.query
              pageid = query.pageids[0]
              if pageid == '-1'
                resolve {}
              else
                page = query.pages[pageid]
                page.pageurl = api_host + '/wiki/' + encodeURIComponent(page.title.replace(/[ ]/g, '_'))
                for l in page.links
                  l.href = api_host + '/wiki/' + encodeURIComponent(l.title.replace(/[ ]/g, '_'))
                resolve(page)
            , (response)->
              reject(util.formatResponseError(response))

  return service
]
