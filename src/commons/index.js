import cronstrue from "cronstrue/i18n";
import cron from "cron-validate";
const cronExpressionToText = (cronExpression) => {
  const presetCronValidate = {
    override: {
      useYears: true,
      useSeconds: true,
      allowOnlyOneBlankDayField: true,
      mustHaveBlankDayField: false,
      useBlankDay: true,
      useLastDayOfMonth: true,
      useLastDayOfWeek: true,
      useNearestWeekday: true,
      useNthWeekdayOfMonth: true
    }
  };
  const cronResult = cron(cronExpression, presetCronValidate);
  if (cronResult.isValid()) {
    let expresionData = {
      value: cronExpression,
      description: cronstrue.toString(cronExpression, {
        locale: "es",
        dayOfWeekStartIndexZero: false
      })
    };
    return expresionData;
  } else {
    const errorValue = cronResult.getError();
    let expresionData = {
      error: errorValue
    };
    return expresionData;
  }
};
export default { cronExpressionToText}
