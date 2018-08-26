$(document).ready(function () {
  let returnOrig = function() {
    ($('.deleteOp').removeClass('deleteOp').addClass('deleteReq')).delay(2000);
  };

  $(document).on('click', '.deleteReq', function(ev) {
    ev.stopPropagation();
    $(this).removeClass('deleteReq').addClass('deleteOp');
    setTimeout(returnOrig, 3000);
  });

  $(document).on('click', '.deleteOp', function () {
    var id = $(this).attr('data-id');
    $.ajax('/api/opportunities/' + id, {
      type: 'DELETE'
    }).then(
      function () {
        location.reload();
      }
    );
  });
});