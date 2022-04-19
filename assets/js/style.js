/* bootstrap form validation */
(function() {
	'use strict';
	window.addEventListener('load', function() {
		/* Fetch all the forms we want to apply custom Bootstrap validation styles to */
		var forms = document.getElementsByClassName('needs-validation');
		/* Loop over them and prevent submission */
		var validation = Array.prototype.filter.call(forms, function(form) {
			form.addEventListener('submit', function(event) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}
				form.classList.add('was-validated');
			}, false);
		});
	}, false);
})();


$(document).ready(function(){

	var currentPageURL = $('input#currentPageUrl').val();

	/* Notiflix config */
	Notiflix.Notify.Init({position:"right-bottom",});
	Notiflix.Loading.Init({svgColor:"#ff2801",});
	Notiflix.Report.Init({plainText:false});
	Notiflix.Confirm.Init({titleColor:"#ff2801",okButtonBackground:"#ff2801",});

	/* ACE EDITOR CONFIG */
	try {
		var codeText = "echo 'Hello World!';";
		var editor = ace.edit("editor");
	  editor.setTheme("ace/theme/monokai");
	  editor.setValue(codeText);
	  editor.session.setUseWrapMode(true);
	  editor.session.setTabSize(2);
	  editor.session.setMode({
	    path: "ace/mode/php",
	    inline: true
		});
		editor.setOptions({
	    enableBasicAutocompletion: true,
	    enableSnippets: true,
	    enableLiveAutocompletion: true,
	    fontFamily: "monospace",
	    fontSize: '0.88rem',
	  });
	  editor.container.style.lineHeight = 1.5;
	  editor.focus();
	  editor.execCommand("gotolineend");
	 } catch (e) {
	 	alert('ACE Editor Error');
	 }


	$(document).on('click','button#formSubmitButton',function(){
		var data = new FormData();
		data.append('data',editor.getValue());
		var url = currentPageURL;
		var error_box = $('#error-box');
	  var code_output_box = $('#codeOutputBody');
	  error_box.html('');
	  code_output_box.html('');
	  submit_form_data_ajax( url, data, function( output ){
	    var res = JSON.parse( output );
	    if( res.status ) {
				error_box.html('<div class="alert alert-success" role="alert">'+res.msg+'</div>');
	      Notiflix.Notify.Success( res.msg );
	      $('#codeOutputBody').html(res.data);
	    } else if(res.status == 0) {
	      error_box.html('<div class="alert alert-danger" role="alert">'+res.error+'</div>');
	      Notiflix.Notify.Failure( res.error );
	    } else {
	    	error_box.html('<div class="alert alert-danger" role="alert">SOME ERROR</div>');
	      Notiflix.Notify.Failure( 'SOME ERROR' );
	    }
	  });
	});

});


function submit_form_data_ajax( url, data, onComplete )
{
	/* ajax function */
	$.ajax({
		type: "POST",
		enctype: 'multipart/form-data',
		url:url,
		data:data,
		processData: false,
		contentType: false,
		cache: false,
		beforeSend:function(){ Notiflix.Loading.Hourglass('Loading...');},
		success:function(data) {onComplete( data );},
		error:function(err) {console.log(err);},
		complete: function() {Notiflix.Loading.Remove();}
	});
}