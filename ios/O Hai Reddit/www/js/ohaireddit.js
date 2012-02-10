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
            $('#theTable').append('<tr><td id="'+children[i].data.id+'" data-url="'+children[i].data.url+'" class="redditLink"><a>'+children[i].data.title+'</a></td><td class="redditComment" data-permalink="'+children[i].data.permalink+'" rowspawn="2"><a class="btn" style="font-size:50%"><i class="icon-comment"></i>'+children[i].data.num_comments+'</a></td></tr><tr><td><span class="label label-warning">'+children[i].data.ups+'</span><span class="label label-info">'+children[i].data.subreddit+'</span><span class="label label-success">'+children[i].data.author+'</span></td></tr>');
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
}

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
                
                // should think about making going into comment replies recursive
                // oh god what is this ungodly horror of a function!?
                for(var i=0;i<commentsLength;i++){
                    var workingCommentId = comments[i].data.id;
                    $('#masterComment').append('<li id="'+workingCommentId+'"><blockquote>'+comments[i].data.body+'<small>'+comments[i].data.author+' '+comments[i].data.ups+' points</small></blockquote></li>');
                    
                    var commentReplies = comments[i].data.replies.data.children;
                    var commentRepliesLength = commentReplies.length-1;
                    if(commentRepliesLength>0){
                        $('#'+workingCommentId).append('<ul></ul>');
                        var childReply = $('#'+workingCommentId +' ul');
                        for(var j=0;j<commentRepliesLength;j++){
                            var workingCommentReplyId = commentReplies[j].data.id;
                            childReply.append('<li id="'+workingCommentReplyId+'"><blockquote>'+commentReplies[j].data.body+'<small>'+commentReplies[j].data.author+' '+commentReplies[j].data.ups+' points</small></blockquote></li>');
                            
                            // please... kill me
                            // time to hand back my cs degree
                            var commentRepliesReplies = commentReplies[j].data.replies.data.children;
                            var commentRepliesRepliesLength = commentRepliesReplies.length-1;
                            if(commentRepliesRepliesLength>0){
                                $('#'+workingCommentReplyId).append('<ul></ul>');
                                var childReplyReply = $('#'+workingCommentReplyId +' ul');
                                for(var k=0;k<commentRepliesRepliesLength;k++){
                                    var workingCommentReplyId = commentReplies[j].data.id;
                                    childReplyReply.append('<li id="'+workingCommentReplyId+'"><blockquote>'+commentRepliesReplies[k].data.body+'<small>'+commentRepliesReplies[k].data.author+' '+commentRepliesReplies[k].data.ups+' points</small></blockquote></li>');
                                }
                            
                            }
                            
                        }
                    }
                }
            }
        }
    });
}
