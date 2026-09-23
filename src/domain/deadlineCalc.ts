export default function deadlineCalc(
  startPage: number,
  currentPage: number,
  totalPages: number,
  startDay: string,
  today: string,
  endDay: string,
) {
  if (totalPages <= 0 || currentPage >= totalPages) return 0;
  const remainPages = totalPages - currentPage;
  const challengeDaysInMilliseconds =
    new Date(endDay).getTime() - new Date(startDay).getTime();

  const challengeDays = Math.ceil(challengeDaysInMilliseconds / 86400000);
  if (challengeDays <= 0) return 0;

  const pagesForEveryDay = remainPages / challengeDays;
  return Math.ceil(pagesForEveryDay);
}
