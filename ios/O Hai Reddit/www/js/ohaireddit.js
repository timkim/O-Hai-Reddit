var self = this;
var nextPage = '';

$('#moarButton').on('click',function(){
    $('#moarButton').button('loading');
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
            $('#theTable').append('<tr><td id="'+children[i].data.id+'" data-url="'+children[i].data.url+'" class="redditLink"><a href="#">'+children[i].data.title+'</a></td><td rowspawn="2"><a href="" class="btn" style="font-size:50%"><i class="icon-comment"></i>'+children[i].data.num_comments+'</a></td></tr><tr><td><span class="label label-warning">'+children[i].data.ups+'</span><span class="label label-info">'+children[i].data.subreddit+'</span><span class="label label-success">'+children[i].data.author+'</span></td></tr>');
        }
       
        $('.redditLink').click(function(){
            
            window.plugins.childBrowser.showWebPage($(this).attr('data-url'));
        });
        $('#moarButton').button('reset');
      }
    });
}
