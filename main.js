const level = {
    levelNumber: 1,
    levelRanges: [{
        start: 0,
        end: 720,
    }],
    events: []
}

const layedOutEvents = [] // array of levels

function willEventOverlap(event) {
    for (const layedOutEvent of layedOutEvents) {
        if((event.start > layedOutEvent.start && event.start < layedOutEvent.end) ||
        (event.end > layedOutEvent.start && event.start < layedOutEvent.start) ||
        (true)) {

        }
    }
    return false;
}

function layOutDay(events) {
    events.forEach(event => {
        
    });
}