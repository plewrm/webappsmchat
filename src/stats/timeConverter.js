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

// export const formatTimeChat = (date) => {
//   if (!date) return '';

//   const hours = date.getHours().toString().padStart(2, '0'); // Ensure two digits
//   const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits
//   return `${hours}:${minutes}`;
// }

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
