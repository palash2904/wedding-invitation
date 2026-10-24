export type InviteType = 'both' | 'dec1' | 'reception';
export type InvitedBySide = 'groom' | 'bride' | 'both';

export interface WeddingEvent {
  id: string;
  time: string;
  timeHi?: string;
  title: string;
  titleHi: string;
  description?: string;
  descriptionHi?: string;
  venueName?: string;
  venueNameHi?: string;
  venueAddress?: string;
  venueAddressHi?: string;
  venueMapUrl?: string;
  venueMapEmbedUrl?: string;
  iconType: 'diya' | 'gift' | 'music' | 'ring' | 'haldi' | 'horse' | 'dining';
  sideTag?: 'groom' | 'bride';
  sideTagEn?: string;
  sideTagHi?: string;
}

export interface WeddingDay {
  date: string;
  dateKey: string;
  dateFormattedEn: string;
  dateFormattedHi: string;
  dayNameEn: string;
  dayNameHi: string;
  events: WeddingEvent[];
}

export interface InviteConfig {
  type: InviteType;
  titleEn: string;
  titleHi: string;
  weddingDatesEn: string;
  weddingDatesHi: string;
  targetCountdownDate: string;
  eventsSubheadingEn: string;
  eventsSubheadingHi: string;
  highlightDate1Num?: string;
  highlightDate1Month?: string;
  highlightDate2Num: string;
  highlightDate2Month: string;
  highlightYear: string;
  highlightTaglineEn: string;
  highlightTaglineHi: string;
  days: WeddingDay[];
}

export interface WeddingCoupleInfo {
  groom: string;
  groomHi: string;
  bride: string;
  brideHi: string;
  weddingDatesEn: string;
  weddingDatesHi: string;
  targetCountdownDate: string; // ISO string '2026-11-30T10:00:00'
  venueName: string;
  venueNameHi: string;
  venueAddress: string;
  venueAddressHi: string;
  venueCity: string;
  venueCityHi: string;
  venueMapUrl?: string;
  venueCoordinates?: string;
  venueMapEmbedUrl?: string;
}

export interface WeddingTranslations {
  hero: {
    togetherWithFamilies: string;
    areGettingMarried: string;
    dates: string;
    viewInvitationBtn: string;
    scrollHint: string;
  };
  welcome: {
    heading: string;
    subheading: string;
    message: string;
    blessing: string;
  };
  countdown: {
    heading: string;
    subheading: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    celebrationStarted: string;
  };
  events: {
    heading: string;
    subheading: string;
    scheduleNote: string;
  };
  story: {
    heading: string;
    subheading: string;
    captions: {
      twoHearts: string;
      oneJourney: string;
      foreverBegins: string;
    };
    description1: string;
    description2: string;
  };
  highlight: {
    heading: string;
    subheading: string;
    date1: string;
    date2: string;
    year: string;
    tagline: string;
  };
  closing: {
    heading: string;
    subheading: string;
    dates: string;
    withLove: string;
    saveTheDate: string;
  };
  footer: {
    madeWithLove: string;
    year: string;
  };
  controls: {
    musicOn: string;
    musicOff: string;
    playMusic: string;
    pauseMusic: string;
    language: string;
  };
}
