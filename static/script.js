function copyToClipboard(elem) {
    var target_text = elem.val();

    navigator.clipboard.writeText(target_text);

    $(".copied").animate({ top: -25, opacity: 1 }, 700, function() {
      $(this).css({ top: 0, opacity: 0 });
    });
  }

  $("#copyButton, #copyTarget").on("click", function() {
    copyToClipboard($("#edit_box"));
  });
  
$("#physician_edit").click(function() {
  var physician_text = $("#description").text().replaceAll("Loading... ", "").replaceAll("Explain this Sentence More >  ", "").replaceAll("     ", " ")
  $("#edit_box").val(physician_text);
  $("#description").addClass("d-none")
  $("#edit_box").removeClass("d-none")
  $("#copyButton").removeClass("d-none")
});

function sentence_analyze(element, sentence) {
     var full_blurb = $("#full_blurb").val();

      $.ajax({
        type:'POST',
        url:'/dictionary_lookup',
        data:{
          topic: sentence,
          full_blurb: full_blurb
        }, 
        beforeSend: function() {
            $(element).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading... </button>')
          },
        success: function(response) {
            $(element).after( "<p>"+response+"</p>" );
            $(element).hide();
        }
    });
}

$(document).on('submit','#form',function(e) {
  e.preventDefault();
  $.ajax({
    type:'POST',
    url:'/analyze',
    data:{
      medical_problem:$("#medical_problem").val(),
      exam_type:$("#radiology_exam").val()
    },
    beforeSend: function() {
        $("#loading-button").show();
        $("#submit-button").hide();
      },
    success: function(result) {

        $("#description").empty();

        const sentences = result.result.split(". ");
        $("#full_blurb").val(result.result)

        for (let i = 0; i < sentences.length; i++) {
            var end = ".";
            if (i==sentences.length - 1) var end = "";

            $("#description").append(' <a class="sentence collapsed" data-bs-toggle="collapse" href="#collapse'+i+'" role="button" aria-expanded="false" aria-controls="collapse'+i+'"> ' + sentences[i] + end + '</a> <div class="collapse multi-collapse" id="collapse'+i+'"> <div class="card card-body"> <button type="button" class="btn btn-success" onclick="sentence_analyze(this, \''+(sentences[i]).replace(/(\r\n|\n|\r)/gm, "").replace(/'/g, "&apos;").replace(/"/g, "&quot;")+'\')">Explain this Sentence More ></button> </div> </div>')

        
            $('.sentence').click(function() {
                if ($(this).hasClass('highlighted')) {
                    $(this).removeClass('highlighted')
                  } else {
                    $(this).addClass('highlighted')
                  }
            });
        }

        $("#loading-button").hide();
        $("#submit-button").show();
      } 
  })
});