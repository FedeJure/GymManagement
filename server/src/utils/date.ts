var nextDate: Date | null = null;

export var mockNextDate = (date: Date) => {
  nextDate = date;
};

export var resetMockDate = () => {
    nextDate = null
}

export const getNowDate = () => {
  if (nextDate) {
    return nextDate;
  }
  return new Date();
};
