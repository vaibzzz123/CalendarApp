const insertedEvents = []
const insertedDomElements = [];

function getOverlappingEvents(newEvent) {
    const overlappingEvents = [];
    insertedEvents.forEach((insertedEvent, index) => {
        if((newEvent.end > insertedEvent.start && newEvent.end < insertedEvent.end)
        || (newEvent.start > insertedEvent.start && newEvent.start < insertedEvent.end)
        || (newEvent.start < insertedEvent.start && newEvent.end > insertedEvent.end)) {
            overlappingEvents.push(index);
        }
    });

    return overlappingEvents;
}

function layOutDay(events) {
    events.forEach(event => {
        insertEvent(event);
    });
}

function createEventDomElement(event) {
    const eventContainer = document.createElement("div");
    eventContainer.className = "calendarEvent";

    const eventLength = event.end - event.start;
    eventContainer.style.height = `${eventLength}px`;
    // eventContainer.style.width = `600px`;
    eventContainer.style.top = `${event.start}px`;

    const blueBar = document.createElement("div");
    blueBar.className = "blueBar";

    const eventTextContainer = document.createElement("div");
    eventTextContainer.className = "calendarEventTextContainer";
    const eventText = document.createElement("span");
    eventText.className = "eventText";
    eventText.innerText = "Sample Item";
    const eventLocation = document.createElement("span");
    eventLocation.className += "smallerLighter padding";
    eventLocation.innerText = "Sample Location";
    eventTextContainer.appendChild(eventText);
    eventTextContainer.appendChild(eventLocation)

    eventContainer.appendChild(blueBar);
    eventContainer.appendChild(eventTextContainer);

    return eventContainer;
}

function resizeEvents(toResize) { // given array of indices
    toResize.forEach((overlappingEventIndex) => {
        const overlappingEventElement = insertedDomElements[overlappingEventIndex];

        let widthProperty = overlappingEventElement.style.width;
        const textIndex = widthProperty.indexOf("px");
        let width = Number(widthProperty.slice(0, textIndex));
        width /= 2;
        
        overlappingEventElement.style.width = `${width}px`;
    });
}

function insertEvent(event) {
    const calendarContainer = document.getElementById("calendarContainer");

    // check for overlap
    const overlappingElements = getOverlappingEvents(event);
    const eventDomElement = createEventDomElement(event);

    if(overlappingElements.length !== 0) {
        resizeEvents(overlappingElements);

        widthProperty = eventDomElement.style.width;
        const textIndex = widthProperty.indexOf("px");
        let width = Number(widthProperty.slice(0, textIndex));
        width /= 2;
        
        eventDomElement.style.width = `${width}px`;
        eventDomElement.style.left = `386px`; // 72.48 + 3 + 10 + 300
    }

    insertedEvents.push(event);
    insertedDomElements.push(eventDomElement);
    calendarContainer.appendChild(eventDomElement);
}

// insertEvent({start: 30, end: 150});

// layOutDay([{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ]);

// layOutDay([{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}]);

// layOutDay([{start: 540, end: 600}]);

// layOutDay([{start: 500, end: 590}]);