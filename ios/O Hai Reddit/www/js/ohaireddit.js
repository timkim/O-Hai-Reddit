var self = this;
var nextPage = '';

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
            $('#theTable').append('<tr class="redditLinkRow"><td id="'+children[i].data.id+'" data-url="'+children[i].data.url+'" class="redditLink"><a>'+children[i].data.title+'</a></td><td class="redditComment" data-permalink="'+children[i].data.permalink+'" rowspawn="2"><a class="btn" style="font-size:50%"><i class="icon-comment"></i>'+children[i].data.num_comments+'</a></td></tr><tr class="redditMetaInfoRow"><td><span class="label label-warning">'+children[i].data.ups+'</span><span class="label label-info">'+children[i].data.subreddit+'</span><span class="label label-success">'+children[i].data.author+'</span></td></tr>');
        }
       
        $('.redditLink').click(function(){
            window.plugins.childBrowser.showWebPage($(this).attr('data-url'));
        });
        
        $('.redditComment').click(function(){
            self.getComments($(this).attr('data-permalink'));
        });
        
        $('#moarButton').button('reset');
        myScroll.refresh();
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
            if(data.length>1){
                var comments = data[1].data.children;
                var commentsLength = comments.length-1;
                $('#masterComment').append(self.renderComments(comments,3));
            }
        }
    });
};

