(function() {
  if (typeof window.CustomEvent === "function") return false;
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

function initEventList() {
  var container = document.getElementById('squadup-checkout');
  if (!container) return;
  
  container.style.opacity = '0';

  var observer = new MutationObserver(function(mutations) {
    var eventElement = document.querySelector('button[data-squadup-event-id="121232"]');
    if (eventElement) {
      observer.disconnect();

      var parent = eventElement.parentElement;
      if (!parent) return;

      var secondChild = parent.children[1];
      if (secondChild && secondChild !== eventElement) {
        eventElement.parentNode.insertBefore(eventElement, secondChild);
      }

      var dateDiv = eventElement.querySelector('.date');
      if (dateDiv && !dateDiv.querySelector('.three-day-pass-icon')) {
        dateDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="three-day-pass-icon"><path fill-rule="evenodd" d="m10.5036 0.334351 1.2074 0.323523 3.1392 0.841166 1.2074 0.32352 -0.3235 1.20741 -0.1941 0.72444c-0.1429 0.53347 0.1736 1.0818 0.7071 1.22475 0.5335 0.14294 1.0818 -0.17364 1.2248 -0.70711l0.1941 -0.72444 0.3235 -1.20741 1.2074 0.32352 3.1393 0.84116 1.2074 0.32353 -0.3236 1.2074 -4.3999 16.42079 -0.3235 1.2074 -1.2074 -0.3236 -3.4232 -0.9172 -8.36243 2.2407L0.456604 4.82833 6.01068 3.34012l0.51764 1.93186c0.14294 0.53346 0.69127 0.85004 1.22474 0.7071 0.53347 -0.14294 0.85005 -0.69128 0.70711 -1.22474l-0.51764 -1.93185 2.04087 -0.54686 0.1966 -0.73387 0.3236 -1.207409ZM18.834 11.7454l-1.2739 4.7542 0 -0.0001 -0.8313 3.1024 -8.2103 -2.1999 2.1052 -7.85673 1.4488 0.38822 0.6471 -2.41482 -1.4489 -0.38821 1.0006 -3.73425 0.7587 0.20329c-0.0128 0.10632 -0.0206 0.21239 -0.0236 0.31794 -0.0019 0.07035 -0.0018 0.14046 0.0005 0.21027 0.0485 1.50113 1.0674 2.85743 2.5932 3.26626 1.7031 0.45636 3.4496 -0.42552 4.1229 -2.00108l0.7587 0.20328 -1.0006 3.73437 -1.449 -0.38824 -0.647 2.4148 1.4489 0.3883Zm-2.8992 -0.7771 -2.4148 -0.6471 0.647 -2.41479 2.4148 0.64705 -0.647 2.41484Z" clip-rule="evenodd" /></svg>';
      }

      if (!eventElement.nextElementSibling || !eventElement.nextElementSibling.classList.contains('divider')) {
        var divider = document.createElement('div');
        divider.className = 'divider faint event-list';
        eventElement.parentNode.insertBefore(divider, eventElement.nextSibling);
      }

      var allEvents = parent.querySelectorAll('button[data-squadup-event-id]');
      for (var i = 0; i < allEvents.length; i++) {
        var event = allEvents[i];
        if (event === eventElement) continue;

        var evDateDiv = event.querySelector('.date');
        var startAt = event.querySelector('.start-at');

        if (!evDateDiv || !startAt) continue;
        if (evDateDiv.querySelector('.day-of-week')) continue;

        var timeSpans = startAt.querySelectorAll('span');
        var timeText = timeSpans.length > 0 ? timeSpans[timeSpans.length - 1].textContent : '';

        var numberEl = evDateDiv.querySelector('.number span');
        var monthEl = evDateDiv.querySelector('.month-abbr span');
        var dayNumber = numberEl ? numberEl.textContent : '';
        var monthAbbr = monthEl ? monthEl.textContent : '';

        if (!dayNumber || !monthAbbr) continue;

        var dayOfWeek = '';
        if (dayNumber === '5') dayOfWeek = 'Fri';
        else if (dayNumber === '6') dayOfWeek = 'Sat';
        else if (dayNumber === '7') dayOfWeek = 'Sun';

        var daySuffix = 'th';
        var dayNum = parseInt(dayNumber);
        if (dayNum === 1 || dayNum === 21 || dayNum === 31) daySuffix = 'st';
        else if (dayNum === 2 || dayNum === 22) daySuffix = 'nd';
        else if (dayNum === 3 || dayNum === 23) daySuffix = 'rd';

        var calDate = monthAbbr + ' ' + dayNumber + daySuffix;

        evDateDiv.innerHTML = '<span class="day-of-week">' + dayOfWeek + '</span>' +
          '<span class="cal-date">' + calDate + '</span>' +
          '<span class="cal-time">' + timeText + '</span>';
      }

      container.style.transition = 'opacity 0.3s ease';
      container.style.opacity = '1';
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  setTimeout(function() { observer.disconnect(); }, 10000);
}

window.initSquadUpEmbed = function() {
  var checkInterval = setInterval(function() {
    var container = document.getElementById('squadup-checkout');
    if (window.squadup && container) {
      clearInterval(checkInterval);
      setTimeout(function() {
        container.style.opacity = '0';
        document.dispatchEvent(new CustomEvent('createSquadupEmbed'));
      }, 100);
    }
  }, 50);
};

if (!window.__squadup_viewchanged_listener) {
  window.__squadup_viewchanged_listener = true;
  document.addEventListener('viewChanged', function(e) {
    if (e.detail && e.detail.currentView === 'eventList') {
      initEventList();
    }
  });
}
