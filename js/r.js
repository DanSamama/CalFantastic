var R = {};

R.init = function(){
  $(document).ready(function(){
        R.sortBlockList();
      R.initRepository();
      $(".left-panel").resizable({
        resizeHeight: false
      });
       $(".top-panel").resizable({
        resizeWidth: false
      });

      $( ".repository .container" ).sortable({
			  revert: true,
  			"axis":"y",
			  containment: "parent"
		  });


      $( ".block-list .container" ).sortable({
          revert: true,
          stop:function(event, ui){
            R.scheduleActivity(ui.item);
          },
  			"axis":"y",
			  containment: "parent"
		  });



		$( "ul, li" ).disableSelection();

  });
}; 


R.initRepository = function(){
    $(".repository .slot .add").click(function(e){
        e.stopPropagation();
        var currentActivity = $(this).closest(".slot");
        $(".block-list .container").append(activity);
        R.scheduleActivity(currentActivity);
    });
};

R.sortBlockList = function(){
    $(".block-list .slot").each(function(e){
        var currentActivity = $(this);
        var nextActivityId = currentActivity.attr("data-next");
        if (nextActivityId){
            $(".slot#" + nextActivityId).before(currentActivity)
        }else{
           $(".block-list .container").append(currentActivity)
        }
    });
};

R.scheduleActivity = function(activity){

    var prevActivity = activity.prev();
    var nextActivity = activity.next();
    $.get("/schedule_activity",{"activity_id":activity.attr("id"),"next_activity_id":nextActivity.attr("id"),"prev_activity_id":prevActivity.attr("id")},function(){

    });
};

R.init();