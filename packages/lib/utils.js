import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function dateTime(datetimeString) {
  let day = dayjs.utc(datetimeString).local().format(`hh:mm a`);
  return day;
}

function dateDifference(date1, date2) {
  date1 = dayjs(date1);
  date2 = dayjs(date2);

  let diff = date1.diff(date2, "s");

  let format = "seconds";

  diff = Math.abs(diff);

  // if seconds is significant
  if (diff > 120) {
    diff = date1.diff(date2, "m");
    format = "minutes";
  }

  diff = Math.abs(diff);

  return {
    diff,
    format
  };
}

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

export default {
  dateTime,
  dateDifference,
  slugify
};
