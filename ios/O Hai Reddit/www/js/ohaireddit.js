var self = this;
var nextPage = '';
// TODO: need to css out inline styles
var linkTMPL=['<tr class="redditLinkRow">',
    '<td id="{{id}}" data-url="{{url}}" class="redditLink">',
        '{{#thumbnail}}<a style="float:left;width:50px;height:50px;margin: 0 5px;"><img src="{{thumbnail}}" /></a>{{/thumbnail}}',
        '<a>{{title}}</a>',
        '<p>{{domain}}</p>',
        '<div>',
            '<span class="label label-warning" style="margin-right:3px;">{{ups}}</span>',
            '<span class="label label-info"style="margin-right:3px;">{{subreddit}}</span>',
            '<span class="label label-success">{{author}}</span>',
        '</div>',
    '</td>',
    '<td class="redditComment" data-permalink="{{permalink}}">',
        '<a class="btn" style="font-size:50%"><i class="icon-comment"></i>{{numComments}}</a>',
    '</td>',
'</tr>'].join('');



$('#moarButton').on('click',function(){
    $('#moarButton').button('loading');
    $('#commentContainer').hide();
    $('#masterComment').html('');
    self.getMoar({after:nextPage});
});

var getMoar= function(qs){
    qs = (qs?qs:'');
    $.ajax({
      url: 'http://reddit.com/.json',
      dataType: 'json',
      data: qs,
      success: function(data){
        var children = data.data.children;
        var j = children.length;
        nextPage = data.data.after;
        for(var i=0;i<j;++i){
            // should really template this godawful string out
            var linkView = {
                id: children[i].data.id,
                thumbnail: children[i].data.thumbnail!=''||children[i].data.thumbnail!=null?children[i].data.thumbnail:null,
                url: children[i].data.url,
                title: children[i].data.title,
                domain: children[i].data.domain,
                ups: children[i].data.ups,
                subreddit: children[i].data.subreddit,
                author: children[i].data.author,
                permalink: children[i].data.permalink,
                numComments: children[i].data.num_comments
                
            };
            $('#theTable').append(Mustache.render(linkTMPL,linkView));

        }


        $('.redditLink').click(function(){
            window.plugins.childBrowser.showWebPage($(this).attr('data-url'));
        });
        
        $('.redditComment').click(function(){
            self.getComments($(this).attr('data-permalink'));
        });
        
        $('#moarButton').button('reset');
        
      }
    });
};

var renderComments = function(comments,depth){
    var commentHTML = '';
    var commentLength = comments.length-1;
    if(depth>=0){
        for(var i=0;i<commentLength;i++){
            commentHTML += '<li id="'+comments[i].data.id+'"><blockquote>'+comments[i].data.body+'<small>'+comments[i].data.author+' '+comments[i].data.ups+' points</small></blockquote></li>';
            if(comments[i].data.replies && comments[i].data.replies.data.children.length!=0){
                commentHTML += '<ul>' + renderComments(comments[i].data.replies.data.children,depth-1) + '</ul>';
            }
        }
    }
    return commentHTML;
};

var getComments = function(permalink){
    $('#commentContainer').show();
    $.ajax({
        url: 'http://reddit.com' + permalink + '.json',
        dataType: 'json',
        success: function(data){
            $('#tableContainer').hide();
            $('#backButton').attr('disabled','false');
            PGMenuElement.update();
            if(data.length>1){
                var comments = data[1].data.children;
                var commentsLength = comments.length-1;
                $('#masterComment').append(self.renderComments(comments,3));
            }
        }
    });
};


