export const getDayName = (dateString) => {
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"
  ];

  const date = new Date(dateString);
  return days[date.getDay()];
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDateRange = (type: string) => {
  const now = new Date();

  if (type === "today") {
    const today = formatDate(new Date());
    return { start_date: today, end_date: today };
  }

  if (type === "week") {
    const first = new Date();
    first.setDate(first.getDate() - first.getDay());

    return {
      start_date: formatDate(first),
      end_date: formatDate(new Date())
    };
  }

  if (type === "month") {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      start_date: formatDate(first),
      end_date: formatDate(last)
    };
  }

  return { start_date: "", end_date: "" };
};