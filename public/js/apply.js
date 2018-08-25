$(document).ready(function () {
  $('#apply-btn').on('click', function () {
    let collectionId = $('#collection-select').val();
    let opportunityId = $('#apply-btn').attr('data-id');

    $.ajax({
      method: 'PUT',
      url: `/api/collections/${collectionId}/apply/${opportunityId}`
    }).then(() => location.assign('/'));
  });
});