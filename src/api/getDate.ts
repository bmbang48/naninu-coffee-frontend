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
