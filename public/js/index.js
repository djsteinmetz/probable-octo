$(document).ready(function () {
  let $applicantsDivs = $('.opportunity-applicants');
  for (let div of $applicantsDivs) {
    let opId = $(div).attr('data-id');
    $.ajax({
      method: 'GET',
      url: `/api/opportunities/${opId}/applicants`
    }).then(data => {
      let applicants = [];
      for(var i=0; i<data.length; i++) {
        applicants.push(`<a href='/opportunities/${opId}/applicants/${data[i].id}'>${data[i].name} </a>`);
      }
      let $a = applicants.join(',');
      $(div).append($a);
    });
  }
});