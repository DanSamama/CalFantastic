var R = {};

R.init = function(){
  $(document).ready(function(){
      $(".left-panel").resizable({
        resizeHeight: false
      });
       $(".top-panel").resizable({
        resizeWidth: false
      });

      $( "#slots-container" ).sortable({
			  revert: true,
  			"axis":"y",
			  containment: "parent"
		  });
		$( "ul, li" ).disableSelection();

  });
}; 


R.init();