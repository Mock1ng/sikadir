const useDate = (isoDate: string | undefined) => {
  const day = new Date(isoDate ?? "").getDay();
  const date = new Date(isoDate ?? "").getDate();
  const month = new Date(isoDate ?? "").getMonth();
  const year = new Date(isoDate ?? "").getFullYear();
  const hours = new Date(isoDate ?? "").getHours();
  const minutes = new Date(isoDate ?? "").getMinutes();

  let dayFull = "";
  let monthFull = "";

  switch (day) {
    case 0:
      dayFull = "Minggu";
      break;
    case 1:
      dayFull = "Senin";
      break;
    case 2:
      dayFull = "Selasa";
      break;
    case 3:
      dayFull = "Rabu";
      break;
    case 4:
      dayFull = "Kamis";
      break;
    case 5:
      dayFull = "Jumat";
      break;
    case 6:
      dayFull = "Sabtu";
      break;

    default:
      break;
  }

  switch (month) {
    case 0:
      monthFull = "Januari";
      break;
    case 1:
      monthFull = "Februari";
      break;
    case 2:
      monthFull = "Maret";
      break;
    case 3:
      monthFull = "April";
      break;
    case 4:
      monthFull = "Mei";
      break;
    case 5:
      monthFull = "Juni";
      break;
    case 6:
      monthFull = "Juli";
      break;
    case 7:
      monthFull = "Agustus";
      break;
    case 8:
      monthFull = "September";
      break;
    case 9:
      monthFull = "Oktober";
      break;
    case 10:
      monthFull = "November";
      break;
    case 11:
      monthFull = "Desember";
      break;

    default:
      break;
  }

  const dateZero = date.toString().length == 2 ? `${date}` : `0${date}`;
  const monthZero =
    month.toString().length == 2 ? `${month + 1}` : `0${month + 1}`;

  return {
    dayFull,
    date,
    monthFull,
    year,
    month: month + 1,
    hours,
    minutes,
    monthZero,
    dateZero
  };
};

export default useDate;
