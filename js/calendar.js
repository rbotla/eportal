function editEvent(event) {
    console.log(event.startDate, event.endDate);
    getCommsForDate(event.startDate, event.endDate);
    // $('#event-modal input[name="event-index"]').val(event ? event.id : '');
    // $('#event-modal input[name="event-name"]').val(event ? event.name : '');
    // $('#event-modal input[name="event-location"]').val(event ? event.location : '');
    // $('#event-modal input[name="event-start-date"]').datepicker('update', event ? event.startDate : '');
    // $('#event-modal input[name="event-end-date"]').datepicker('update', event ? event.endDate : '');
    $('#event-modal').modal();
}


function getCommsForDate(sDate, eDate) {
    $.ajax({
        url: "https://my-json-server.typicode.com/rbotla/eportal/comms"
    }).then(function(data) {
        console.log(data);
        let fComms = data.filter( x => sDate.getTime() === new Date(x.date).getTime() ) // Filter comms for the date that the user clicked on
        fComms = fComms.map( (x, i) => {
                return {
                    id: i,
                    name: x.title,
                    location: '',
                    startDate: new Date(x.date),
                    color: 'red',
                    endDate: new Date(x.date)
                }
            })
        $('#calendar').data('calendar').setDataSource(fComms);
    });

}

function deleteEvent(event) {
    var dataSource = $('#calendar').data('calendar').getDataSource();

    for(var i in dataSource) {
        if(dataSource[i].id == event.id) {
            dataSource.splice(i, 1);
            break;
        }
    }
    
    $('#calendar').data('calendar').setDataSource(dataSource);
}

function saveEvent() {
    var event = {
        id: $('#event-modal input[name="event-index"]').val(),
        name: $('#event-modal input[name="event-name"]').val(),
        location: $('#event-modal input[name="event-location"]').val(),
        startDate: $('#event-modal input[name="event-start-date"]').datepicker('getDate'),
        endDate: $('#event-modal input[name="event-end-date"]').datepicker('getDate')
    }
    
    var dataSource = $('#calendar').data('calendar').getDataSource();

    if(event.id) {
        for(var i in dataSource) {
            if(dataSource[i].id == event.id) {
                dataSource[i].name = event.name;
                dataSource[i].location = event.location;
                dataSource[i].startDate = event.startDate;
                dataSource[i].endDate = event.endDate;
            }
        }
    }
    else
    {
        var newId = 0;
        for(var i in dataSource) {
            if(dataSource[i].id > newId) {
                newId = dataSource[i].id;
            }
        }
        
        newId++;
        event.id = newId;
    
        dataSource.push(event);
    }
    
    $('#calendar').data('calendar').setDataSource(dataSource);
    $('#event-modal').modal('hide');
}

$(function() {
    var currentYear = new Date().getFullYear();

    $('#calendar').calendar({ 
        enableContextMenu: true,
        enableRangeSelection: true,
        contextMenuItems:[
            {
                text: 'Update',
                click: editEvent
            },
            {
                text: 'Delete',
                click: deleteEvent
            }
        ],
        selectRange: function(e) {
            editEvent({ startDate: e.startDate, endDate: e.endDate });
        },
        mouseOnDay: function(e) {
            if(e.events.length > 0) {
                var content = '';
                
                for(var i in e.events) {
                    content += '<div class="event-tooltip-content">'
                                    + '<div class="event-name" style="color:' + e.events[i].color + '">' + e.events[i].name + '</div>'
                                    + '<div class="event-location">' + e.events[i].location + '</div>'
                                + '</div>';
                }
            
                $(e.element).popover({ 
                    trigger: 'manual',
                    container: 'body',
                    html:true,
                    content: content
                });
                
                $(e.element).popover('show');
            }
        },
        mouseOutDay: function(e) {
            if(e.events.length > 0) {
                $(e.element).popover('hide');
            }
        },
        dayContextMenu: function(e) {
            $(e.element).popover('hide');
        },
        dataSource: [
            {
                id: 0,
                name: 'Google I/O',
                location: 'San Francisco, CA',
                startDate: new Date(currentYear, 4, 28),
                endDate: new Date(currentYear, 4, 29)
            },
            {
                id: 1,
                name: 'Microsoft Convergence',
                location: 'New Orleans, LA',
                startDate: new Date(currentYear, 2, 16),
                endDate: new Date(currentYear, 2, 19)
            },
            {
                id: 2,
                name: 'Microsoft Build Developer Conference',
                location: 'San Francisco, CA',
                startDate: new Date(currentYear, 3, 29),
                endDate: new Date(currentYear, 4, 1)
            },
            {
                id: 3,
                name: 'Apple Special Event',
                location: 'San Francisco, CA',
                startDate: new Date(currentYear, 8, 1),
                endDate: new Date(currentYear, 8, 1)
            },
            {
                id: 4,
                name: 'Apple Keynote',
                location: 'San Francisco, CA',
                startDate: new Date(currentYear, 8, 9),
                endDate: new Date(currentYear, 8, 9)
            },
            {
                id: 5,
                name: 'Chrome Developer Summit',
                location: 'Mountain View, CA',
                startDate: new Date(currentYear, 10, 17),
                endDate: new Date(currentYear, 10, 18)
            },
            {
                id: 6,
                name: 'F8 2015',
                location: 'San Francisco, CA',
                startDate: new Date(currentYear, 2, 25),
                endDate: new Date(currentYear, 2, 26)
            },
            {
                id: 7,
                name: 'Yahoo Mobile Developer Conference',
                location: 'New York',
                startDate: new Date(currentYear, 7, 25),
                endDate: new Date(currentYear, 7, 26)
            },
            {
                id: 8,
                name: 'Android Developer Conference',
                location: 'Santa Clara, CA',
                startDate: new Date(currentYear, 11, 1),
                endDate: new Date(currentYear, 11, 4)
            },
            {
                id: 9,
                name: 'LA Tech Summit',
                location: 'Los Angeles, CA',
                startDate: new Date(currentYear, 10, 17),
                endDate: new Date(currentYear, 10, 17)
            }
        ]
    });
    
    $('#save-event').click(function() {
        saveEvent();
    });
});


const comms = [
    {"date": "10/03/2018", "title": "Watch David Eckert’s Interview on ERP TSA Exits", "details": "Check out this brief video – the third in the IT Transition Service Agreement (TSA) series -- as David Eckert, SVP, Global Applications Architecture and Implementation, explains where we are and what we’re trying to accomplish with the Enterprise Resource Planning (ERP) TSA exits."},
    {"date": "10/03/2018", "title": "Excellence Happens Here! Customer Service Week 2018", "details": "We’re halfway through Customer Service Week 2018! We’ve had office and remote team member challenges, competitions, and prizes, the chance to step into virtual reality, themed costume days, and tons of great food. What’s your favorite activity so far? Join the fun and see what’s next for CSW, and how you can get involved."},
    {"date": "10/03/2018", "title": "October is National Cybersecurity Awareness Month!", "details": "Cyber security threats to our business and our customers increase every day. You can help protect our data by being vigilant and aware. Learn more on staying safe at work and at home from the Department of Homeland Security and the National Cyber Security Alliance, including 2018 Themes."},
    {"date": "10/03/2018", "title": "SHARE THE EXCITEMENT", "details": "Help us reach more payers, providers, and other healthcare influencers by sharing Inspire customer conference news on social media! CASH BONUS: Don’t miss out on your opportunity to win some cold, hard cash! We’ll be active on social media throughout Inspire, and we need you to help us spread the word. Share our posts on Twitter, Facebook, and LinkedIn, and if your posts rise to the top, we’ll pay YOU $100! "},
    {"date": "10/11/2018", "title": "IX update", "details": "WE’RE MOVING TO MICROSOFT SWAY! Keep a look out for the new look and feel of Information Xchange in the coming weeks."},
    {"date": "10/11/2018", "title": "What’s Going on at Change Healthcare?", "details": "Meet the Leader – Thomas Laur <br>What: Discussion with Thomas Laur, EVP & President, Technology Enabled Services<br>When: Wednesday, October 31, 2018, 10:00 a.m. – 11:00 a.m. CT<br>Where: WebEx, click here to register. You will receive an email confirmation that includes the WebEx details following enrollment."},
    {"date": "10/11/2018", "title": "New Expense Reimbursement Policy and Tool", "details": "Change Healthcare has introduced a new Expense Reimbursement Policy, effective October 1, giving all team members consistent guidelines for making travel arrangements related to Company business, incurring related travel expenses, and claiming reimbursement for related-travel expenses. Click here to learn more."},
    {"date": "10/11/2018", "title": "Did you Know We’re Migrating More than 350 Business Unit Applications?", "details": "Watch this video – part of the IT Transition Service Agreement (TSA) series – as Guy Sereff, VP, Enterprise Architecture, explains the BU App migrations and how they will let us manage our computer and operating resources across the globe."},
    {"date": "10/11/2018", "title": "Did you Miss It? Tom Dean Talks about B2B Payment Solutions", "details": "Learn more about Network Solutions’ B2B Payment Solutions in our fourth session! <br>View the informative 25-minute WebEx, featuring SVP, Tom Dean. <br> Watch previous sessions: Visit the “Get-to-Know” Network Solutions Channel on Microsoft Stream!"},
    {"date": "10/11/2018", "title": "Chatter Matters", "details": "DOUBLE DOWN ON SECURITY: It’s National Cyber Security Awareness month, and the PERFECT time to join the Cyber Threat Response Center on Chatter!  This group monitors a multitude of sources for digital threats identified (i.e. phishing emails) to ensure that our company remains protected every day."},
    {"date": "10/11/2018", "title": "Are you Hiring?", "details": "Learn what's new about onboarding."},
]