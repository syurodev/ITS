const timeElapsed = (time) => {
  const questionCreationTime = new Date(time).getTime();
  const currentTime = new Date().getTime();
  const timeElapsed = currentTime - questionCreationTime;

  // Chuyển từ mili giây sang phút
  const minutesElapsed = Math.floor(timeElapsed / (1000 * 60));

  // Chuyển từ mili giây sang giờ
  const hoursElapsed = Math.floor(timeElapsed / (1000 * 60 * 60));

  // Chuyển từ mili giây sang ngày
  const daysElapsed = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));

  let QuestionTime;

  const handelQuestionTime = () => {
    if (minutesElapsed <= 60) {
      QuestionTime = `${minutesElapsed} minute ago`;
    } else if (hoursElapsed <= 24) {
      QuestionTime = `${hoursElapsed} hours ago`;
    } else QuestionTime = `${daysElapsed} days ago`;
  };

  handelQuestionTime();

  return QuestionTime;
};

export default timeElapsed;
