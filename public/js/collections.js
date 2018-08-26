$(document).ready(function () {
  $('#submit-collection-form').on('submit', function (event) {

    event.preventDefault();
    var newCol = {
      name: $('#collectionName').val().trim(),
      description: $('#collectionDescription').val().trim(),
      UserID: 1 // this can be anything.. we reset it server-side based on the session token.
    };

    $.ajax('/api/collections/', {
      type: 'POST',
      data: newCol
    }).then(
      function () {
        console.log('posted collection', newCol);
        location.reload();
      }
    );
  });

  $('#submit-item-form').on('submit', function (event) {

    event.preventDefault();
    var newItem = {
      name: $('#itemName').val().trim(),
      imageUrl: $('#imageUrl').val().trim(),
      description: $('#itemDescription').val().trim(),
      UserID: 1, // this can be anything.. we reset it server-side based on the session token.
      CollectionId: $('#collection-select').val()
    };

    if (!parseInt(newItem.CollectionId)) {
      $('#collection-select').addClass('invalid');
      return console.error('Collection not selected...');
    }

    $.ajax('/api/items/', {
      type: 'POST',
      data: newItem
    }).then(
      function () {
        location.reload();
      }
    );
  });
});