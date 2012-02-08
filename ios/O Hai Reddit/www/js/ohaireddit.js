var self = this;

$.ajax({
  url: 'http://reddit.com/.json',
  dataType: 'json',
  success: function(data){
    var children = data.data.children;
    var j = children.length;
    for(var i=0;i<j;++i){
        $('#theTable').append('<tr><td>'+children[i].data.score+'</td><td>'+children[i].data.title+'</td></tr>');
    }
  }
});

