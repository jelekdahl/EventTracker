const events = [
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

function buildDropdown() {

  // get all the events that we know about
  let currentEvents = getEvents();

  // get a list of unique city names from those events
  let eventCities = currentEvents.map(event => event.city);
  let uniqueCities = new Set(eventCities);
  let dropdownChoices = ['All', ...uniqueCities];

  const dropdownTemplate = document.getElementById('dropdown-item-template');
  const dropdownMenu = document.getElementById('city-dropdown');
  dropdownMenu.innerHTML = '';

  // for each of those city names:
  for (let i = 0; i < dropdownChoices.length; i++) {
    let cityName = dropdownChoices[i];

    // - make a dropdown item HTML element
    let dropdownItem = dropdownTemplate.content.cloneNode(true);

    dropdownItem.querySelector('a').innerText = cityName;

    // - add that element to the dropdown menu
    dropdownMenu.appendChild(dropdownItem);
  }

  // to be continued...?
  displayEvents(currentEvents);
  displayStats(currentEvents);
  document.getElementById('stats-location').innerHTML = 'All';
}

function getEvents() {
  //TODO: get events from local storage
  let eventsJson = localStorage.getItem('jele-events');

  let storedEvents = events;

  if (eventsJson == null) {
    saveEvents(events);
  } else {
    storedEvents = JSON.parse(eventsJson);
  }

  return storedEvents;
}

function saveEvents(events) {
  let eventsJson = JSON.stringify(events);
  localStorage.setItem('jele-events', eventsJson);
}

function displayEvents(events) {

  // get the table to put the events in
  const eventTable = document.getElementById('events-table');

  // clear the table
  eventTable.innerHTML = '';

  // loop through events
  for (let i = 0; i < events.length; i++) {
    let event = events[i];

    // loop through events
    // - fill the table with rows
    //      - make a <tr></tr>
    let eventRow = document.createElement('tr');

    //      - make a <td> for each property
    //      - put the data into each <td>
    let eventName = document.createElement('td');
    eventName.innerText = event.event;
    eventRow.appendChild(eventName);

    let eventCity = document.createElement('td');
    eventCity.innerText = event.city;
    eventRow.appendChild(eventCity);

    let eventState = document.createElement('td');
    eventState.innerText = event.state;
    eventRow.appendChild(eventState);

    let eventAttendance = document.createElement('td');
    eventAttendance.innerText = event.attendance.toLocaleString();
    eventRow.appendChild(eventAttendance);

    let eventDate = document.createElement('td');
    let date = new Date(event.date);
    eventDate.innerText = date.toLocaleDateString();
    eventRow.appendChild(eventDate);

    //      - append the row to the <tbody>
    eventTable.appendChild(eventRow);
  }
}

function sumAttendance(events) {
  return events.length ?
    events.reduce((a, b) => a + b.attendance, 0) : 0;
}

function avgAttendance(events) {
  return events.length ?
    events.reduce((a, b) => a + b.attendance, 0) / events.length : 0;
}

function maxAttendance(events) {
  return Math.max(0, ...events.map(event => event.attendance));
}

function minAttendance(events) {
  return events.length ? Math.min(...events.map(event => event.attendance)) : 0;
}

function calculateStats(events) {
  let stats = {
    sum: 0,
    avg: 0,
    max: 0,
    min: 0
  };

  if (events.length > 0) {
    stats.min = events[0].attendance;

    for (let i = 0; i < events.length; i++) {
      stats.sum += events[i].attendance;
      if (events[i].attendance > stats.max) stats.max = events[i].attendance;
      else if (events[i].attendance < stats.min) stats.min = events[i].attendance;
    }

    stats.avg = stats.sum / events.length;
  }

  return stats;
}

function displayStats(events) {
  let stats = calculateStats(events);
  document.getElementById('total-attendance').innerHTML = stats.sum.toLocaleString();
  document.getElementById('avg-attendance').innerHTML = Math.round(stats.avg).toLocaleString();
  document.getElementById('max-attended').innerHTML = stats.max.toLocaleString();
  document.getElementById('min-attended').innerHTML = stats.min.toLocaleString();
}

function filterByCity(element) {
  // figure out which city we want
  let cityName = element.textContent;

  document.getElementById('stats-location').innerHTML = cityName;

  // get all the events
  let allEvents = getEvents();

  // filter those events to just one city

  let filteredEvents = cityName == 'All' ?
    allEvents : allEvents.filter(e => e.city == cityName);

  // call displayStats with the events for that city
  displayStats(filteredEvents);

  // call displayEvents with the events for that city
  displayEvents(filteredEvents);
}

function saveNewEvent() {
  // get the HTML Form element
  let newEventForm = document.getElementById('newEventForm');

  // create an object from the <input>s
  let formData = new FormData(newEventForm);
  let newEvent = Object.fromEntries(formData.entries());

  // fix the formats of the data
  newEvent.attendance = parseInt(newEvent.attendance);
  newEvent.date = new Date(newEvent.date).toLocaleDateString();

  // get all current events
  let allEvents = getEvents();
  // add our new event
  allEvents.push(newEvent);
  // save all events with the new event
  saveEvents(allEvents);

  // reset the form inputs
  newEventForm.reset();

  // hide the bootstrap modal
  let modalElement = document.getElementById('newEventModal');
  let bsModal = bootstrap.Modal.getInstance(modalElement);
  bsModal.hide();

  // display all events again
  buildDropdown();
}