//Calendar Directive start
directiveModule.directive("calendar", function() {
    return {
        restrict: "E",
        template: '<div class="header"><span>{{month.format("MMMM, YYYY")}}</span></div><div class="week names"><span class="day">Sun</span><span class="day">Mon</span><span class="day">Tue</span><span class="day">Wed</span><span class="day">Thu</span><span class="day">Fri</span><span class="day">Sat</span></div><div class="week" ng-repeat="week in weeks"><span class="day" ng-class="{ today: day.isToday, \'different-month\': !day.isCurrentMonth, selected: day.date.isSame(selected) }" ng-click="select(day)" ng-repeat="day in week.days">{{day.number}}</span></div>',
        scope: {
            selected: "=",
            previous:"=",
            next:"=",
            selectMonth:"="
        },
        link: function(scope) {
            scope.selected = _removeTime(scope.selected || moment());
            scope.month = scope.selected.clone();
            var start = scope.selected.clone();
            //start.date(1);
            
            _removeTime(start.day(0).date(1));

            _buildMonth(scope, start, scope.month);
            var currentMonthInfo=matchCurrentMonth(scope.month.month());
            scope.selected.date(currentMonthInfo.isCurrent?currentMonthInfo.date:1);
            scope.select = function(day) {
                scope.selected = day.date; 
                scope.$parent.updated.day=day.date;
              
            };

            scope.next = function() {
                var next = scope.month.clone();
                _removeTime(next.month(next.month()+1).date(1));
                var isLastMonth=(scope.month.month()===11);
                var newYear=isLastMonth?(scope.month.year()+1):scope.month.year();
                scope.month.month(isLastMonth?0:scope.month.month()+1);
                scope.month.year(newYear);
                _buildMonth(scope, next, scope.month);
                var currentMonthInfo=matchCurrentMonth(scope.month.month());
                next.date(currentMonthInfo.isCurrent?currentMonthInfo.date:1);
                next.month(scope.month.month());
                next.year(newYear);
                scope.selected=next;
                scope.$parent.updated.day=next;
            };
            scope.selectMonth=function(selectedMonth){
                var next = scope.month.clone();
                var selectedMonthVal=selectedMonth.getMonth();
                var selectedYear=selectedMonth.getFullYear();
                _removeTime(next.month(selectedMonthVal).date(1).year(selectedYear));
                scope.month.month(selectedMonthVal).year(selectedYear);
                _buildMonth(scope, next, scope.month); 
                var currentMonthInfo=matchCurrentMonth(selectedMonthVal);
                next.date(currentMonthInfo.isCurrent?currentMonthInfo.date:1);
                next.month(selectedMonthVal);
                scope.selected=next;
                scope.$parent.updated.day=next;
            };

            scope.previous = function() {
                var previous = scope.month.clone();
                _removeTime(previous.month(previous.month()-1).date(1));
                var isFirstMonth=(scope.month.month()===0);
                var newYear=isFirstMonth?(scope.month.year()-1):scope.month.year();
                scope.month.month(isFirstMonth?11:scope.month.month()-1);
                scope.month.year(newYear);
                _buildMonth(scope, previous, scope.month);
                var currentMonthInfo=matchCurrentMonth(scope.month.month());
                previous.date(currentMonthInfo.isCurrent?currentMonthInfo.date:1);
                previous.month(scope.month.month());
                previous.year(newYear);
                scope.selected=previous;
                scope.$parent.updated.day=previous;
            };
            function matchCurrentMonth(selectedMonth){
                var currentDate=new Date();
                console.log('selectedMonth '+selectedMonth+' current '+currentDate.getMonth());
                return {isCurrent:(selectedMonth===currentDate.getMonth()),date:currentDate.getDate()};
            }
        }
    };

    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
});
//Calendar Directive end