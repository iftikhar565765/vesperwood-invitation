/* ═══════════════════════════════════════════════════════════════
   Vesperwood · config.js
   ---------------------------------------------------------------
   Main personalisation data for the site and visual editor.
   Longer copy, palette, and theme are editable here. Values
   marked SAMPLE are tasteful placeholders — replace them with
   your own before sending the link to your guests.
   ═══════════════════════════════════════════════════════════════ */

window.HEIRLOOM = {
  templateId: "vesperwood",

  /* ── The couple — SAMPLE content, replace with your names ────── */
  couple: {
    partnerOne: "Wren",                        // SAMPLE
    partnerTwo: "Theodore",                    // SAMPLE
    initials:  "W · T",                        // SAMPLE — used on seals & monograms
    namesLine: "Wren & Theodore"               // SAMPLE — used across the site
  },

  /* ── The wedding date & time ─────────────────────────────────
     iso : ISO 8601 date-time WITH an explicit UTC offset, so the
           countdown and the calendar files are correct on every
           guest's device, wherever they are in the world.
           Format: "YYYY-MM-DDTHH:MM:SS±HH:MM"                    */
  wedding: {
    iso: "2027-06-19T18:30:00-04:00",                                        // EDIT
    endIso: "2027-06-20T01:00:00-04:00",                                     // EDIT — end of the celebration
    display: "Saturday, 19 June 2027 · the Holy Matrimony begins at half past six in the evening", // EDIT
    zoneLabel: "EDT",                                                        // EDIT — optional note for guests abroad
    words: "Saturday · The Nineteenth of June · Two Thousand Twenty-Seven",  // EDIT
    numerals: "19 · 06 · 2027",                                              // EDIT
    weekday: "Saturday",                                                     // EDIT — the ornamental date row
    month: "June",                                                           // EDIT
    day: "19",                                                               // EDIT — the large numeral
    year: "2027",                                                            // EDIT
    ceremonyLabel: "Holy Matrimony",                                         // EDIT
    ceremony: "half past six in the evening",                                // EDIT
    eventTitle: "Wren & Theodore — Wedding"                                  // EDIT (calendar entry)
  },

  /* ── The venue ──────────────────────────────────────────────── */
  venue: {
    name: "The Glasshouse at Aldergrove",                      // SAMPLE
    address: "Aldergrove Estate, Hudson Valley, New York",     // SAMPLE
    mapsQuery: "Glasshouse at Aldergrove, Hudson Valley, New York",
    /* A full URL here overrides the map link built above, e.g. an
       exact Google Maps place link or an Apple Maps URL.          */
    mapUrl: ""
  },

  /* ── Copy shown throughout the invitation ────────────────────
     The visual editor can change these values without editing HTML. */
  content: {
    pageTitle: "Wren & Theodore · 19 June 2027 — Wedding Invitation",
    pageDescription: "Wren and Theodore request the honour of your presence at the Holy Matrimony at the Glasshouse at Aldergrove — vespers, candlelight and one perfect evening, on Saturday the nineteenth of June 2027. Open your invitation.",
    socialTitle: "Wren & Theodore — An Invitation · 19.06.2027",
    socialDescription: "Candlelight, stained glass and a covenant of love — you are cordially invited.",
    navStory: "Story",
    navDetails: "The Day",
    navVenue: "Venue",
    navRsvp: "RSVP",
    menuInvitation: "The Invitation",
    menuStory: "Our Story",
    menuSaveDate: "Save the Date",
    menuDetails: "The Order of the Day",
    menuPalette: "The Palette",
    menuWeddingDay: "The Wedding Day",
    menuVenue: "Venue & Location",
    menuRsvp: "Kindly Respond",
    menuCountdown: "The Countdown",
    menuClosing: "A Closing Blessing",
    openingEyebrow: "With the grace of God and the blessing of their families, you are invited to the Holy Matrimony of",
    openingHint: "Touch the seal to break it",
    openButton: "Enter the Candlelight",
    skipButton: "Skip straight to the invitation",
    envelopeAddress: "their honoured guests",
    verseLine: "I have found the one whom my soul loves",
    invitationEyebrow: "With the blessings of our families",
    invitationLead: "We joyfully invite you to celebrate the Holy Matrimony of",
    invitationAnd: "and",
    invitationClosing: "Your presence is our greatest blessing",
    heroVenueLabel: "Venue",
    sceneSignboard: "Written in the vesperwood",
    invitationVenueSuffix: "· Hudson Valley",
    storyKicker: "The Chronicle",
    storyTitle: "Two prayers,",
    storyTitleScript: "one amen",
    storyParagraphOne: "Every good story begins quietly, and ours began in a glasshouse full of ferns — one shared umbrella, and a first conversation that outlasted the rain. We talked until the candles guttered, and somewhere between the last hymn and the first starlight, we each went home and prayed the same prayer.",
    storyParagraphTwo: "Four years and two cities later, our families gathered beneath one roof to give their blessing, and the date was written in pen and prayer. Nothing would mean more than to have you standing beside us as we exchange our vows before God, and begin a home built on faith, hope and love.",
    storyQuote: "I have found the one whom my soul loves.",
    storyQuoteLabel: "— Song of Songs 3:4 — the verse that carried us",
    storyNote: "chapter one, and every chapter after",
    storyNoteCredit: "— pencilled on the back of a wedding date card",
    storyCaptionOne: "the evening in the glasshouse",
    storyCaptionTwo: "one umbrella against the rain",
    storyCaptionFour: "the vows",
    storyAside: "and they lived",
    scriptureKicker: "The Word",
    scriptureVerse: "Your word is a lamp to my feet and a light to my path.",
    scriptureVerseLatin: "Lucerna pedibus meis verbum tuum, et lux semitae meae.",
    scriptureReference: "Psalm 119 · 105",
    saveDateTitle: "Save the Date",
    saveDateCrossing: "the vespers, the vows & the dancing",
    saveDateNote: "Add the date to your calendar and keep these particulars close.",
    calendarDownloadLabel: "Add to Calendar",
    calendarGoogleLabel: "Google Calendar",
    detailsKicker: "The Order of the Day",
    detailsTitleFirst: "The",
    detailsTitleSecond: "Wedding Day",
    detailsIntro: "One blessed day with our families — at a glance.",
    eventOneLabel: "The Rehearsal & Dinner",
    eventOneTime: "Friday, 18 June 2027 · six in the evening",
    eventOneNote: "Vespers by candlelight in the chapel, then supper in the old barn — for family and the wedding party.",
    eventTwoLabel: "The Ceremony",
    eventTwoTime: "Saturday, 19 June 2027 · half past six in the evening",
    eventTwoNote: "The Holy Matrimony in the glasshouse chapel — vows, rings, and a covenant before God.",
    eventThreeLabel: "The Reception",
    eventThreeTime: "Saturday, 19 June 2027 · eight in the evening",
    eventThreeNote: "A candlelit supper beneath the boughs — hymn-singing turned dancing, toasts and lilies on every table.",
    eventFourLabel: "The Farewell Brunch",
    eventFourTime: "Sunday, 20 June 2027 · ten in the morning",
    eventFourNote: "One last morning in the garden — coffee, croissants and farewells under the wisteria.",
    kindlyReplyLabel: "Kindly Reply",
    kindlyReplyNote: "Kindly send your response using the reply card further below.",
    particularsEyebrow: "The Particulars",
    particularsDateLabel: "The Date",
    particularsPlaceLabel: "The Place",
    particularsAttireLabel: "The Attire",
    particularsAttire: "Pine green, gold & ivory",
    particularsAttireNote: "Formal attire with a whisper of the forest — dress as though the candlelight could keep you warm.",
    particularsCarriagesLabel: "Kindly Reply",
    particularsCarriagesTime: "the nineteenth of May, 2027",
    particularsCarriagesNote: "So the supper count is right and every pew is saved.",
    paletteKicker: "The Colours of the Day",
    paletteTitleFirst: "The pine &",
    paletteTitleSecond: "candlelight",
    paletteIntro: "Deep pine and candle gold, ivory birch and stained-glass blue — the colours of the vesperwood, worn by our favourite people.",
    dressCodeLabel: "Attire · Pine & Gold",
    dressCodeTitle: "Colours of the vesperwood",
    dressCodeNote: "Pine silks, candle-gold accessories and ivory linen are most welcome — dress as splendidly as you feel.",
    weddingDayKicker: "The Celebration",
    weddingDayTitleFirst: "The wedding",
    weddingDayTitleSecond: "celebration",
    venueKicker: "The Place",
    venueDescription: "A glasshouse chapel among the boughs — candle lanterns at dusk, stained-glass light at golden hour, hymns and strings, and white lilies on every table.",
    venueCeremonyLabel: "Ceremony",
    venueCeremonyText: "in the glasshouse chapel, at half past six, before God and our families",
    venueReceptionLabel: "Reception",
    venueReceptionText: "a lantern-lit supper beneath the boughs",
    mapButton: "View Location",
    rsvpKicker: "Your Reply",
    rsvpTitle: "Kindly Respond",
    rsvpLead: "Kindly reply by",
    rsvpNameLabel: "Your name",
    rsvpNamePlaceholder: "e.g. Eleanor Whitmore",
    rsvpNameError: "May we have your name? Two letters or more will do.",
    rsvpAttendanceLabel: "Will you be joining us?",
    rsvpAcceptLabel: "Joyfully accepts",
    rsvpDeclineLabel: "Regretfully declines",
    rsvpAttendanceError: "Please let us know whether you can come.",
    rsvpGuestsLabel: "Seats in your party",
    rsvpGuestsError: "May we have a seat count between one and the party size allowed?",
    rsvpGuestSingular: "guest",
    rsvpGuestPlural: "guests",
    rsvpDietaryLabel: "Dietary requirements",
    rsvpDietaryPlaceholder: "Vegetarian, allergies…",
    rsvpMessageLabel: "A note for the couple",
    rsvpMessagePlaceholder: "Blessings, memories, wishes…",
    rsvpSubmitLabel: "Send Response",
    rsvpAmendLabel: "Amend the reply",
    countdownDaysLabel: "Days",
    countdownHoursLabel: "Hours",
    countdownMinutesLabel: "Minutes",
    countdownSecondsLabel: "Seconds",
    countdownKicker: "The Grand Countdown",
    countdownTitle: "counting the hours until",
    countdownPromise: "the vows are exchanged",
    closingScript: "with all our love",
    closingMessage: "Thank you, from the depths of our hearts, for being part of our story. May the Lord bless our home with faith, hope and love — and may every guest who walks through our door leave with a blessing. Your presence completes our celebration.",
    closingBlessing: "The Lord bless you and keep you; the Lord make His face to shine upon you, and be gracious unto you.",
    closingBlessingReference: "Numbers 6 · 24–26 — the Benediction",
    footerTagline: "Pine & candlelight — from the vesperwood, with love."
  },

  palette: [
    { name: "Deep Pine",        color: "#20554A" },
    { name: "Candle Gold",      color: "#C9A24B" },
    { name: "Ivory Birch",      color: "#F5F1E1" },
    { name: "Chancel Blue",     color: "#274D6D" },
    { name: "Deep Gold Ink",    color: "#6D5518" },
    { name: "Vesper Cream",     color: "#E4D8B8" }
  ],
  theme: "vesperwood",
  themeColors: {},
  fonts: {
    editorial: "cormorant",
    display: "italiana",
    script: "alexBrush",
    hand: "caveat",
    body: "ebGaramond"
  },

  /* ── Wedding moments — SAMPLE words for the string of lights.
     Use one short phrase per entry; an empty list hides the section. */
  moments: ["The Vespers", "The Processional", "The Vows", "The Rings", "The Reception", "The Dancing"],

  /* ── RSVP ─────────────────────────────────────────────────────
     endpoint : leave "" for the honest demonstration mode — the
                form validates and shows a preview of the reply and
                states clearly that nothing is sent or stored.
                Cloudflare's publishing service supplies the invitation-
                specific RSVP endpoint to public invitation pages.
     maxGuests: the number allowed by the invitation.
     deadline  : shown above the form.                                  */
  rsvp: {
    endpoint: "",
    maxGuests: 4,
    deadline: "the nineteenth of May, 2027"        // SAMPLE
  },

  /* ── Countdown wording (invalid or passed dates) ─────────────── */
  countdown: {
    invalidMessage: "The hour is still being finalised — see the order of the day below.",
    pastMessage: "The celebration has begun — thank you for being part of our story."
  },

  /* ── Optional ambient music ───────────────────────────────────
     Drop a small looping file at assets/audio/theme.mp3 and set
     src to enable the volume toggle in the navigation. Never
     autoplays; stays silent if the file is missing.                  */
  audio: {
    src: ""             // e.g. "assets/audio/theme.mp3"
  }
};
