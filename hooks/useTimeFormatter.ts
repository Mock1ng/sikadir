const useTimeFormatter = ({
  hourStart,
  minuteStart,
  hourEnd,
  minuteEnd
}: {
  hourStart: number,
  minuteStart: number,
  hourEnd?: number,
  minuteEnd?: number,
}) => {
  const addZero = (time?: number) => {
    const numb = time?.toString();

    if (numb && numb.length >= 2) return numb;

    return "0" + time;
  };

  return {
    hourStart: addZero(hourStart),
    hourEnd: addZero(hourEnd),
    minuteStart: addZero(minuteStart),
    minuteEnd: addZero(minuteEnd)
  };
};

export default useTimeFormatter;
