var R = {};
//NameSpace that we can use

R.init = function(){
  $(document).ready(function(){
      //Firing all the functions that we define from line 40
        R.sortBlockList();
      R.initRepository();
      $(".left-panel").resizable({
        resizeHeight: false
      });
       $(".top-panel").resizable({
        resizeWidth: false
      });

      //Make the activities sortable between them. Being able to drag them
      $( ".repository .container" ).sortable({
			  revert: true,
  			"axis":"y",
			  containment: "parent"
		  });


      $( ".block-list .container" ).sortable({
          revert: true,
          stop:function(event, ui){
              //Firing function line 64
            R.scheduleActivity(ui.item);
          },
  			"axis":"y",
			  containment: "parent"
		  });

		$( "ul, li" ).disableSelection();

  });
}; 

//after clicking "add" activity form, it takes the slot that contains this "add btn" and append the slot to the "chronolist" container in the html
R.initRepository = function(){
    $(".repository .slot .add").click(function(e){
        e.stopPropagation();
        //This variable return the closest slot that is next to where the user is clicking
        var currentActivity = $(this).closest(".slot");
        $(".block-list .container").append(currentActivity);
        R.scheduleActivity(currentActivity);
    });
};

R.sortBlockList = function(){
    $(".block-list .slot").each(function(e){
        var currentActivity = $(this);
        var nextActivityId = currentActivity.attr("data-next");
        //if there is no "next activity" that means that its the "last" slot in the chronolist
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