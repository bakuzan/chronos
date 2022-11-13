const YEAR_WITH_LEAP_DAY = 2020;

export default function getNextDateValues(month: number, day: number) {
  const currentDateValue = new Date(YEAR_WITH_LEAP_DAY, month - 1, day);

  currentDateValue.setDate(currentDateValue.getDate() + 1);

  return [currentDateValue.getMonth() + 1, currentDateValue.getDate()];
}
