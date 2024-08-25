import moment from 'moment';

export const getDate = (date) => {
  let timestamp = date; // Your epoch timestamp in seconds
  let startDate = new Date('2023-01-01'); // January 1, 2023
  // Convert the timestamp to milliseconds (JavaScript works with milliseconds)
  let milliseconds = timestamp * 1000;
  // Create a new Date object by adding the milliseconds to the start date
  let resultDate = new Date(startDate.getTime() + milliseconds);
  var a = moment(new Date());
  var b = moment(resultDate);

  const diffDays = a.diff(b, 'days');
  const diffHours = a.diff(b, 'hours');
  const diffMins = a.diff(b, 'minutes');

  if (diffDays < 1) {
    if (diffHours < 24) {
      if (diffMins < 60) {
        return diffMins + 'm';
      } else {
        return diffHours + 'h';
      }
    } else {
      return diffDays + 'd';
    }
  } else {
    return moment(b).format('MMM D');
  }
};

export const getDateForNoti = (date) => {
  var a = moment(new Date());
  var b = moment(new Date(date));

  const diffDays = a.diff(b, 'days');
  const diffHours = a.diff(b, 'hours');
  const diffMins = a.diff(b, 'minutes');

  if (diffDays < 1) {
    if (diffHours < 24) {
      if (diffMins < 60) {
        return diffMins + 'm';
      } else {
        return diffHours + 'h';
      }
    } else {
      return diffDays + 'd';
    }
  } else {
    return moment(b).format('MMM D');
  }
};

export const formatTimeChat = (date) => {
  if (!date) return '';

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  const strHours = hours.toString().padStart(2, '0'); // Ensure two digits

  return `${strHours}:${minutes} ${ampm}`;
};

export const formatTimestamp = (timestamp) => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  const timeDifference = now - messageDate;

  const oneDay = 24 * 60 * 60 * 1000;

  if (timeDifference < oneDay) {
    // If the message is within the last 24 hours, show the time
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return messageDate.toLocaleTimeString('en-US', options);
  } else if (timeDifference < 2 * oneDay) {
    // If the message is between 24 and 48 hours old, show "Yesterday"
    return 'Yesterday';
  } else {
    // If the message is older than 48 hours, show the date
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return messageDate.toLocaleDateString('en-US', options);
  }
};
