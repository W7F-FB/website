squadup = {
  image: 'https://s3.amazonaws.com/checkout.squadup.com/squadup-logo.png',
  root: 'squadup-checkout',
  userId: [10114191],
  shoppingCartEnabled: true,
  confirmEmail: true,
  topics: ['wsf-live'],
  ticketGuardianEnabled: false,
  onDomReady: false,
  descriptionEnabled: true,
  reservedSeatingEnabled: true,
  braintreeCustomGatewayClientEnabled: true,
  confirmationUrl: 'https://worldsevensfootball.com/confirmation',
  orderQuestions: [
    { question: 'Address', type: 'text', required: true },
    { question: 'City', type: 'text', required: true },
    { question: 'State', type: 'text', required: true },
    { question: 'Zip Code', type: 'text', required: true },
    { question: 'Phone Number', type: 'text', required: true },
  ]
};

(function() {
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  var eventTopic = getUrlParameter("event-topic");
  if (eventTopic) { squadup.topics = [eventTopic]; }

  var eventId = getUrlParameter("event-id");
  if (eventId) { squadup.eventId = parseInt(eventId, 10); }
})();

(function() {
  if (window.__su_ab_listener_installed) return;
  window.__su_ab_listener_installed = true;
  window.dataLayer = window.dataLayer || [];

  function push(evt) { window.dataLayer.push(evt); }
  var hasItems = false;
  var purchased = false;
  var fired = false;

  document.addEventListener('shoppingCartUpdated', function(e) {
    var cart = (e && e.detail) || {};
    hasItems = !!cart && Object.keys(cart).length > 0;
  }, false);

  document.addEventListener('orderSuccessful', function() {
    purchased = true;
    hasItems = false;
  }, false);

  function fireAbandonOnce() {
    if (!fired && hasItems && !purchased) {
      fired = true;
      push({ event: 'cart_abandon' });
    }
  }

  window.addEventListener('pagehide', fireAbandonOnce);
  window.addEventListener('beforeunload', fireAbandonOnce);
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') fireAbandonOnce();
  });

  try {
    if (/^\/confirmation(?:\/|$)/.test(location.pathname)) {
      purchased = true;
    }
  } catch (e) {}
})();

(function() {
  try {
    var params = new URLSearchParams(window.location.search);
    var refId = params.get('ref_id');
    if (refId) {
      localStorage.setItem('sa_postback_id', refId);
    }
  } catch (err) {}
})();

