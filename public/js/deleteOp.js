$(document).ready(function() {
  $('#deleteOp').on('click', function() {
    var id = $(this).attr('data-id');
    $.ajax('/api/opportunities/' + id, {
      type: 'DELETE'
    }).then(
      function() {
        location.reload();
      }
    );
  });
});