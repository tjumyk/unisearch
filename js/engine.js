// Generated by CoffeeScript 1.12.5
(function() {
  angular.module('app').factory('engine', [
    '$http', '$q', '$sce', 'util', function($http, $q, $sce, util) {
      var clean_text, service;
      clean_text = function(text) {
        return text.replace(/\s+/g, ' ').trim();
      };
      service = {
        providers: {
          youdaodict: {
            name: '有道词典',
            url: 'https://dict.youdao.com',
            templateUrl: 'ui/youdaodict.html',
            templateOnLoad: function() {
              $('.pro_trans.ui.accordion').accordion();
            },
            executor: function(task) {
              return new $q(function(resolve, reject) {
                return $http.get("https://dict.youdao.com/w/eng/" + (encodeURIComponent(task.keyword)) + "/").then(function(response) {
                  var $doc, $error_wrapper, $phrs_list_tab, $t_pe_trans_all_trans, $t_pe_trans_type_list, $t_web_trans, $web_phrases, $wordbook, doc, exception, i, keyword, len, pro_trans, pronounces, rank_list, sort_item, t_id, trans_lines, type_items, type_names, typo_corrections, web_phrases, web_trans;
                  try {
                    doc = response.data;
                    $doc = $(doc);
                    typo_corrections = [];
                    $error_wrapper = $doc.find('.error-wrapper:first');
                    if ($error_wrapper.length) {
                      $error_wrapper.find('.typo-rel').each(function() {
                        var $suggestion, $title, key, meaning;
                        $suggestion = $(this);
                        $title = $suggestion.find('.title:first');
                        key = $title.text();
                        $title.remove();
                        meaning = $suggestion.text().trim();
                        return typo_corrections.push({
                          keyword: key,
                          meaning: meaning
                        });
                      });
                    }
                    pronounces = {};
                    trans_lines = [];
                    $phrs_list_tab = $doc.find('#phrsListTab');
                    if ($phrs_list_tab.length) {
                      $wordbook = $phrs_list_tab.find('.wordbook-js:first');
                      if ($wordbook.length) {
                        keyword = $wordbook.find('.keyword:first').text().trim();
                        $wordbook.find('.pronounce').each(function() {
                          var $pronounce, phonetic, pronounce_type, text;
                          $pronounce = $(this);
                          text = $pronounce.text().trim();
                          if (text.length === 0) {
                            return;
                          }
                          pronounce_type = text[0];
                          phonetic = $pronounce.find('.phonetic:first').text().trim();
                          if (pronounce_type === '美') {
                            return pronounces['us'] = phonetic;
                          } else if (pronounce_type === '英') {
                            return pronounces['gb'] = phonetic;
                          }
                        });
                      }
                      $phrs_list_tab.find('.trans-container li').each(function() {
                        return trans_lines.push($(this).text().trim());
                      });
                    }
                    web_trans = [];
                    $t_web_trans = $doc.find('#tWebTrans');
                    if ($t_web_trans.length) {
                      $t_web_trans.find('.wt-container').each(function() {
                        var $wt_container, content, title;
                        $wt_container = $(this);
                        title = clean_text($wt_container.find('.title:first').text());
                        content = $wt_container.find('.collapse-content:first').html().trim();
                        return web_trans.push({
                          title: title,
                          content: content
                        });
                      });
                    }
                    web_phrases = [];
                    $web_phrases = $doc.find('#webPhrase');
                    if ($web_phrases.length) {
                      $web_phrases.find('.wordGroup').each(function() {
                        var $word_group, content, title;
                        $word_group = $(this);
                        title = clean_text($word_group.find('.contentTitle:first').text());
                        content = clean_text($word_group.text()).substring(title.length).trim();
                        return web_phrases.push({
                          title: title,
                          content: content
                        });
                      });
                    }
                    pro_trans = [];
                    $t_pe_trans_type_list = $doc.find('#tPETrans-type-list');
                    $t_pe_trans_all_trans = $doc.find('#tPETrans-all-trans');
                    if ($t_pe_trans_type_list.length && $t_pe_trans_all_trans.length) {
                      type_names = {};
                      type_items = {};
                      rank_list = [];
                      $t_pe_trans_type_list.find('.p-type').each(function() {
                        var $p_type, rank_score, t_id, t_name;
                        $p_type = $(this);
                        t_name = $p_type.text().trim();
                        t_id = $p_type.attr('rel');
                        type_names[t_id] = t_name;
                        rank_score = 0;
                        if (t_name.indexOf('计算机') >= 0) {
                          rank_score += 10;
                        }
                        if (t_name.indexOf('数学') >= 0) {
                          rank_score += 8;
                        }
                        if (t_name.indexOf('电子') >= 0) {
                          rank_score += 3;
                        }
                        if (t_name.indexOf('技术') >= 0) {
                          rank_score += 1;
                        }
                        return rank_list.push([t_id, rank_score]);
                      });
                      $t_pe_trans_all_trans.find('li.types').each(function() {
                        var $type, clz, i, items, len, ref, t_id;
                        $type = $(this);
                        t_id = void 0;
                        ref = $type.attr('class').split(/\s+/);
                        for (i = 0, len = ref.length; i < len; i++) {
                          clz = ref[i];
                          if (clz.indexOf('ptype_') === 0) {
                            t_id = clz;
                            break;
                          }
                        }
                        if (t_id === void 0) {
                          throw 't_id not found';
                        }
                        items = [];
                        $type.find('.items').each(function() {
                          var $item_source, $item_trans, $items, ref_num, ref_source, source, title, trans;
                          $items = $(this);
                          title = $items.find('.title:first').text().trim();
                          ref_num = void 0;
                          ref_source = void 0;
                          source = void 0;
                          trans = void 0;
                          $items.find('.additional').each(function() {
                            var $additional, $ref, ind, key, ref_source_title, ref_source_url, t;
                            $additional = $(this);
                            t = $additional.text().trim();
                            key = '引用次数：';
                            ind = t.indexOf(key);
                            if (ind >= 0) {
                              return ref_num = parseInt(t.substring(ind + key.length));
                            } else {
                              key = '参考来源 -';
                              ind = t.indexOf(key);
                              if (ind >= 0) {
                                ref_source_title = t.substring(ind + key.length).trim();
                                ref_source_url = void 0;
                                $ref = $additional.next();
                                if ($ref.length) {
                                  ref_source_title = $ref.text().trim();
                                  ref_source_url = $ref.attr('href');
                                }
                                return ref_source = {
                                  title: ref_source_title,
                                  url: ref_source_url
                                };
                              }
                            }
                          });
                          $item_source = $items.find('.source:first');
                          if ($item_source.length) {
                            source = $item_source.html().trim();
                          }
                          $item_trans = $items.find('.trans:first');
                          if ($item_trans.length) {
                            trans = $item_trans.html().trim();
                          }
                          return items.push({
                            title: title,
                            ref_num: ref_num,
                            ref_source: ref_source,
                            source: source,
                            trans: trans
                          });
                        });
                        return type_items[t_id] = items;
                      });
                      rank_list.sort(function(a, b) {
                        return b[1] - a[1];
                      });
                      for (i = 0, len = rank_list.length; i < len; i++) {
                        sort_item = rank_list[i];
                        t_id = sort_item[0];
                        pro_trans.push({
                          field: type_names[t_id],
                          items: type_items[t_id]
                        });
                      }
                    }
                    return resolve({
                      keyword: keyword,
                      typo_corrections: typo_corrections,
                      pronounces: pronounces,
                      trans_lines: trans_lines,
                      web_trans: web_trans,
                      web_phrases: web_phrases,
                      pro_trans: pro_trans
                    });
                  } catch (error) {
                    exception = error;
                    return reject(exception);
                  }
                }, function(response) {
                  return reject(util.formatResponseError(response));
                });
              });
            }
          },
          wikipedia: {
            name: 'Wikipedia',
            url: 'https://en.wikipedia.org',
            templateUrl: 'ui/wikipedia.html',
            templateOnLoad: function() {},
            executor: function(task) {
              return new $q(function(resolve, reject) {
                var api, api_host, kw;
                kw = task.keyword;
                api_host = "https://en.wikipedia.org";
                api = api_host + "/w/api.php?action=query&format=json&prop=extracts%7Cpageimages%7Crevisions%7Cinfo%7Ccategories%7Clinks&pllimit=50&redirects=true&exintro=false&exsentences=2&explaintext=true&piprop=thumbnail&pithumbsize=320&rvprop=timestamp&inprop=watched&indexpageids=true&titles=" + encodeURIComponent(kw);
                return $http.get(api).then(function(response) {
                  var i, l, len, page, pageid, query, raw, ref;
                  raw = response.data;
                  query = raw.query;
                  pageid = query.pageids[0];
                  if (pageid === '-1') {
                    return resolve({});
                  } else {
                    page = query.pages[pageid];
                    page.pageurl = api_host + '/wiki/' + encodeURIComponent(page.title.replace(/[ ]/g, '_'));
                    ref = page.links;
                    for (i = 0, len = ref.length; i < len; i++) {
                      l = ref[i];
                      l.href = api_host + '/wiki/' + encodeURIComponent(l.title.replace(/[ ]/g, '_'));
                    }
                    return resolve(page);
                  }
                }, function(response) {
                  return reject(util.formatResponseError(response));
                });
              });
            }
          },
          dictionary_com: {
            name: 'Dictionary.com',
            url: 'http://www.dictionary.com',
            templateUrl: 'ui/dictionary_com.html',
            templateOnLoad: function() {
              $('.pronounce.button').on('click', function() {
                var $audio;
                $audio = $(this).siblings('audio');
                if ($audio.length > 0) {
                  return $audio[0].play();
                }
              });
            },
            executor: function(task) {
              return new $q(function(resolve, reject) {
                var api, kw;
                kw = task.keyword;
                api = 'http://www.dictionary.com/browse/' + encodeURIComponent(kw);
                return $http.get(api).then(function(response) {
                  var $doc, $header, $luna_box, $source_data, def_list, keyword, pronounce, pronounce_audios;
                  $doc = $(response.data);
                  $luna_box = $doc.find('#source-luna .source-box .luna-box');
                  if ($luna_box.length > 0) {
                    $header = $luna_box.find('header.main-header');
                    if ($header.length > 0) {
                      keyword = $header.find('h1.head-entry').text().trim();
                      pronounce_audios = [];
                      $header.find('audio source').each(function() {
                        var $source;
                        $source = $(this);
                        return pronounce_audios.push({
                          src: $sce.trustAsResourceUrl($source.attr('src')),
                          type: $source.attr('type')
                        });
                      });
                      pronounce = $header.find('.pronounce .pron.ipapron').text().trim();
                    }
                    $source_data = $luna_box.find('.source-data');
                    if ($source_data.length > 0) {
                      def_list = [];
                      $source_data.find('.def-list .def-pbk').each(function() {
                        var $def, defs, title;
                        $def = $(this);
                        title = $def.find('.luna-data-header').text().trim();
                        defs = [];
                        $def.find('.def-set').each(function() {
                          var $def_content, $def_example, $def_set, $def_sub_list, def_example, def_text, sub_defs;
                          $def_set = $(this);
                          $def_content = $def_set.find('.def-content');
                          $def_sub_list = $def_content.find('.def-sub-list');
                          if ($def_sub_list.length > 0) {
                            sub_defs = [];
                            $def_sub_list.find('li').each(function() {
                              var $def_example, $sub_def, def_example, def_text;
                              $sub_def = $(this);
                              $def_example = $sub_def.find('.def-inline-example');
                              def_example = $def_example.text().trim();
                              $def_example.remove();
                              def_text = $sub_def.text().trim();
                              return sub_defs.push({
                                def: def_text,
                                example: def_example
                              });
                            });
                            $def_sub_list.remove();
                            def_text = $def_set.find('.def-content').text().trim();
                            return defs.push({
                              def: def_text,
                              sub_defs: sub_defs
                            });
                          } else {
                            $def_example = $def_content.find('.def-inline-example');
                            def_example = $def_example.text().trim();
                            $def_example.remove();
                            def_text = $def_set.find('.def-content').text().trim();
                            return defs.push({
                              def: def_text,
                              example: def_example
                            });
                          }
                        });
                        return def_list.push({
                          title: title,
                          defs: defs
                        });
                      });
                    }
                  }
                  return resolve({
                    keyword: keyword,
                    pronounce_audios: pronounce_audios,
                    pronounce: pronounce,
                    def_list: def_list
                  });
                }, function(response) {
                  if (response.status === 404) {
                    return resolve({});
                  } else {
                    return reject(util.formatResponseError(response));
                  }
                });
              });
            }
          }
        }
      };
      return service;
    }
  ]);

}).call(this);

//# sourceMappingURL=engine.js.map
