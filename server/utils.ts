import QueryString from 'qs';
import { RequestModel } from './types/RequestModel';

export function getOrdinalSuffix(i: number) {
  const j = i % 10;
  const k = i % 100;

  if (j === 1 && k !== 11) {
    return `${i}st`;
  }

  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }

  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }

  return `${i}th`;
}

const RANDOM_LEAP_YEAR = 2020;
const daysInMonth = (month: number) =>
  new Date(RANDOM_LEAP_YEAR, month, 0).getDate();

export function getDateForRequest(query: QueryString.ParsedQs): RequestModel {
  let { month, day } = query;

  if (!month || !day) {
    return { date: new Date() };
  }

  const m = Number(month);
  const lastDay = daysInMonth(m);

  let d = Number(day);
  let message = '';

  if (d > lastDay) {
    const dWithOrd = getOrdinalSuffix(d);
    message = `${dWithOrd} is beyond the bounds of the month.\r\n Defaulting to the last day of the month instead.`;
    d = lastDay;
  }

  return { date: new Date(RANDOM_LEAP_YEAR, m - 1, d), message };
}
