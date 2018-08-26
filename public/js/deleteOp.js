$(document).ready(function () {
  let returnOrig = function() {
    ($('#deleteOp').attr('id', 'deleteReq')).delay(2000);
  };
  $('#deleteReq').on('click', function() {
    $('#deleteReq').attr('id', 'deleteOp');
    setTimeout(returnOrig, 3000);
  });
  $('#deleteOp').on('click', function () {
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