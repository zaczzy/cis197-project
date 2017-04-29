/**
 * Created by zac_zhao on 4/28/17.
 */
$(document).ready(function () {
  window.makeArticle = function (article) {
    var html = '<div data-article-id="' + article.id + '" class="article"><h1>article ' + '<span class="qid">' + article.id + '</span>' + '</h1><p class="the-article">' +
      article.id + '</p><br><p>Asked by Socket user ID: <span class="socket-user">' +
      article.title + '</p></div><div class="answer"><h1>Answer</h1><p>' +
      '<div class="form-group"><textarea class="form-control" rows="5" id="answer">' +
      article.text + '</textarea></div></p><button class="btn btn-default" id="update-answer">Add Answer</button></div>';
    return html;
  };
  
  window.makeArticlePreview = function (article) {
    var html = [
      '<li data-article-id="' + article.id + '" class="article-preview"><h1><span class="preview-content">' +
      article.title + '</span></h1><p><em>Author: ' + article.author + '</em></p>'
    ];
    html = html.join('');
    return html;
  };
  
});
