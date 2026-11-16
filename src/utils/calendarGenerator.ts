/**
 * Calendar generation utility for Hasaranga & Roshini's Homecoming
 * Date: 02nd of January 2027
 * Time: 7:00 PM Asia/Colombo (UTC+05:30)
 * Duration: Configurable (default 5 hours)
 */

export interface WeddingCalendarEvent {
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  durationHours?: number;
}

export const WEDDING_EVENT_DETAILS = {
  title: 'Hasaranga & Roshini – Homecoming',
  description: `Homecoming Invitation:
Avenra Garden Hotel Negombo
ARENA ARTORIUM
Date: 02nd of January 2027
Time: 7:00 PM

We warmly invite you to join us in celebrating our special day!`,
  location: 'ARENA ARTORIUM, Avenra Garden Hotel Negombo, Sri Lanka',
  startDate: '2027-01-02T19:00:00+05:30',
  durationHours: 5,
};

/**
 * Generates and triggers the download of an RFC 5545 compliant .ics calendar file
 */
export function downloadWeddingIcsFile(): void {
  // Asia/Colombo is UTC+05:30.
  // 07:00 PM on 2027-01-02 in Asia/Colombo = 13:30 UTC on 2027-01-02.
  // 5 hours later = 12:00 AM (00:00) on 2027-01-03 Asia/Colombo = 18:30 UTC on 2027-01-02.
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hasaranga & Roshini Homecoming//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Colombo',
    'X-LIC-LOCATION:Asia/Colombo',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0530',
    'TZOFFSETTO:+0530',
    'TZNAME:+0530',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    'UID:hasaranga-roshini-homecoming-20270102@wedding',
    'DTSTAMP:20270102T190000Z',
    'DTSTART;TZID=Asia/Colombo:20270102T190000',
    'DTEND;TZID=Asia/Colombo:20270103T000000',
    'SUMMARY:Hasaranga & Roshini – Homecoming',
    'DESCRIPTION:Homecoming Invitation:\\nAvenra Garden Hotel Negombo\\nARENA ARTORIUM\\nDate: 02nd of January 2027\\nTime: 7:00 PM\\n\\nWe warmly invite you to join us in celebrating our special day!',
    'LOCATION:ARENA ARTORIUM\\, Avenra Garden Hotel Negombo\\, Sri Lanka',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Hasaranga_and_Roshini_Homecoming.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

/**
 * Returns a web link to create the event in Google Calendar
 */
export function getGoogleCalendarUrl(): string {
  // Start: 20270102T133000Z (7:00 PM Asia/Colombo)
  // End: 20270102T183000Z (12:00 AM Asia/Colombo)
  const text = encodeURIComponent('Hasaranga & Roshini – Homecoming');
  const details = encodeURIComponent(
    'Homecoming Invitation:\nAvenra Garden Hotel Negombo\nARENA ARTORIUM\nDate: 02nd of January 2027\nTime: 7:00 PM\n\nWe warmly invite you to join us in celebrating our special day!'
  );
  const location = encodeURIComponent(
    'ARENA ARTORIUM, Avenra Garden Hotel Negombo, Sri Lanka'
  );
  const dates = '20270102T133000Z/20270102T183000Z';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}
