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
                //todo add logic udpate linked list
                R.scheduleActivity(ui.item);
            },
            "axis":"y",
            containment: "parent"
        });

        $( "ul, li" ).disableSelection();

    });
};
//
// function calendar(week, days, hours)
// {
//     this.week = week;
//     this.days = days;
//     this.hours = hours;
//
//
// }
//
// calendar.prototype.init = function(activity)
// {
//
// }
// calendar.prototype.injectActivity= function(activity)
// {
//
// }
//
//
// var ItcCalendar = new calendar(20, 5 , 9);
//
// ItcCalendar.injectActivity()




//print on every activity its date and calendar hours based on its index position
$("#generateCalendar").click(function () {
    var nextActivityId =  "nextActivityId";
    var currentWeek = 1;
    var totalPrevDailyActivities = 0;
    var dayStartingHour = 9;
    var dayEndingHour = 17;
    var dailyLength = 8;

    R.getFirstActivity = function () {

        //get all the activity slots in the chronolist and loop through to find the first slot (the only one that has no "previous" activity.
        $(".block-list" > li).each(function (e) {
            activity = $(this);
            if( activity.prev() === -1){
                firstAct = $(this);
                var length = activity.time_slots;
                var activityId = activity.id;
                var nextActivityId = get.request("next");

                var firstActDate = get.request("project_starting_day");
                var activityStart = dayStartingHour;
                var activityEnd = dayStartingHour + length;
                var dailyLength = (dayEndingHour) - (dayStartingHour);
                dailyLength -= length;
                totalPrevDailyActivities += length;

                return ({firstActDate:"firstActDate", dayStartingHour: "dayStartingHour", dayEndingHour:"dayEndingHour"})
            }
        });

        R.getRestActivities = function () {

            $(".block-list" > li).each(function (e) {
                activity = $(this);

                if(( activity.prev() !== -1) && (activity.id == nextActivityId) ){
                    var length = get.request("time_slots");
                    var nextActivityId = get.request("next");

                    //check if there's enough time to schedule this activity in the current day, else- schedule to next day
                    dailyLength -= length;
                    totalPrevDailyActivities += length;
                    if (dailyLength > 0) {
                        var actDate = currentWeek;
                        dailyLength -= length;
                    }
                    else {
                        //increment the calendar by one day, and reset the daily length hours.
                        dailyLength =  int(dayEndingHour) - int(dayStartingHour);
                    }

                    var dayStartHour = get.request("day_starting_hour");
                    var activityStart = dayStartHour + totalPrevDailyActivities;
                    var activityEnd = activityStart + length;

                    return ({actDate: "actDate", activityStart:"activityStart", activityEnd:"activityEnd"})
                }
            })
        }
    };
});


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
    var counter = 0;
    if ($(".block-list .slot:not(.sorted)").length > 1){
        while ($(".block-list .slot:not(.sorted)").length > 0){
            var unsortedBlock = $(".block-list .slot:not(.sorted)").first();

            var nextActivityId = unsortedBlock.attr("data-next");
            var unsortedBlockAndPrevSorted = unsortedBlock.add(unsortedBlock.prevUntil(".slot:not(.sorted)"));

            console.log(counter +".before")
            console.log($(".block-list .slot"))
            console.log(counter +". found " + unsortedBlock.attr("id") + " ---> " + nextActivityId);
            console.log("grabbing")
            console.log(unsortedBlockAndPrevSorted)
            if (nextActivityId != "None") {
                console.log("putting before .block-list .slot#" + nextActivityId)
                var nextBlock = $(".block-list .slot#" + nextActivityId);
                console.log(nextBlock)
                nextBlock.before(unsortedBlockAndPrevSorted);
            }else{
                    console.log("putting last")
                  $(".block-list .container").append(unsortedBlockAndPrevSorted)
            }
            unsortedBlock.addClass("sorted");
            console.log(counter +".after")
            console.log($(".block-list .slot"))
            console.log(counter +". end");
            counter++;

        }
    }
};

R.scheduleActivity = function(activity){
    var originalPrev = $(".block-list .slot[data-next='"+ activity.attr("id") +"']");
    var originalNext = $(".block-list .slot#" + activity.attr("data-next"));
    var prevActivity = activity.prev();
    var nextActivity = activity.next();
    var originalPrevId, originalNextId, currentPrevId, currentNextId

    if (originalPrev.length == 0){
        originalPrevId ="None";
        console.log("i was first");
    }else{
        originalPrevId = originalPrev.attr("id");
        console.log("i was not first");
    }

    if (nextActivity.length == 0){
        currentNextId = "None"
        console.log("i am now last");
    }else{
         currentNextId = nextActivity.attr("id");
         console.log("i am not last now");
    }


    if (originalNext.length == 0){
        originalNextId = "None"
        console.log("i was last");
    }else{
        originalNextId = originalNext.attr("id");
        console.log("i was not last");
    }

    if (prevActivity.length == 0){
        currentPrevId = "None"
        console.log("i am now first");
    }else{
        currentPrevId = prevActivity.attr("id");
        console.log("i am not first now ");
    }


    $.get("/schedule_activity",{"activity_id":activity.attr("id"),"current_next_id":currentNextId,"current_prev_id":currentPrevId,"original_next_id":originalNextId,"original_prev_id":originalPrevId},function(){
        //TODO: update client side (like we update server side)
    });









    // if (activity.attr("data-next") == "None" && $(".block-list .slot").length > 1){
    //     var lastActivity = $(".block-list .slot").last();
    //     $.get("/mark_as_last",{"activity_id":lastActivity.attr("id")},function(){
    //         lastActivity.attr("data-next","None");
    //     });
    // }
    // //todo add extra prop
    // $.get("/schedule_activity",{"activity_id":activity.attr("id"),"next_activity_id":nextActivity.attr("id"),"prev_activity_id":prevActivity.attr("id")},function(){
    //     //We are last now
    //     if (!nextActivity){
    //         activity.attr("data-next","None");
    //     }else{
    //          activity.attr("data-next",nextActivity.attr("id"));
    //     }
    //     //Our new prev should point to us
    //     if (prevActivity){
    //         prevActivity.attr("data-next",activity.attr("id"));
    //     }
    // });
};


 // activityId = self.request.get("activity_id")
 //        prevActivityId = self.request.get("prev_activity_id")
 //        nextActivityId = self.request.get("next_activity_id")
 //        #todo add extra prop
 //        activity = db.getActivityById(activityId)
 //        if activity:
 //            activity.status = "IN_CHRONOLIST"
 //            if nextActivityId:
 //                activity.next = nextActivityId
 //            else:
 //                activity.next = None
 //            activity.put()
 //        prevActivity = db.getActivityById(prevActivityId)
 //        if prevActivity:
 //            prevActivity.next = activityId
 //            prevActivity.put()

R.init();