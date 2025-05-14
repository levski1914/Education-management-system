// ISO: Понеделник = 1, Петък = 5
export const dayOfWeekToIndex = (dayOfWeek: number) => dayOfWeek - 1;
// За JS getDay(): 0-6 -> 1-7 (ISO)
export const getTodayDayOfWeek = () => {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay; // JS Sunday (0) -> 7
};
