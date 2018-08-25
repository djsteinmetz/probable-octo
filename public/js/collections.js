$(document).ready(function() {
  $('#submitCollection').on('click', function (event) {
    event.preventDefault();
    console.log('here');
    var newCol = {
      name: $('#collectionName').val().trim(),
      description: $('#collectionDescription').val().trim(),
      UserID: 1 // this can be anything.. we reset it server-side based on the session token.
    };
    console.log(newCol);
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

  $('#submitItem').on('click', function (event) {
    event.preventDefault();
    console.log('here');
    var newItem = {
      name: $('#itemName').val().trim(),
      imageUrl: $('#imageUrl').val().trim(),
      description: $('#itemDescription').val().trim(),
      UserID: 1, // this can be anything.. we reset it server-side based on the session token.
      CollectionId: $('#collection-select').val()
    };
    console.log(newItem);
    $.ajax('/api/items/', {
      type: 'POST',
      data: newItem
    }).then(
      function () {
        console.log('posted item', newItem);
        location.reload();
      }
    );
  });
});