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
            $('#theTable').append('<tr><td>'+children[i].data.score+'</td><td>'+children[i].data.title+'</td></tr>');
        }
        $('#moarButton').button('reset');
      }
    });
}
