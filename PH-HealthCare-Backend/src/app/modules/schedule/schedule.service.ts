import { ICreateSchedulePayload } from "./schedule.interface";
import { addHours, addMinutes, format } from "date-fns";
import { convertDateTime } from "./schedule.utils";
import { prisma } from "../../lib/prisma";

const createSchedule = async (payload: ICreateSchedulePayload) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const interval = 30;

  const currentDate = new Date(startDate);
  const lastData = new Date(endDate);

  const schedule = [];

  while (currentDate <= lastData) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(".")[0]),
        ),
        Number(startTime.split(":")[1]),
      ),
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0]),
        ),
        Number(endTime.split(":")[1]),
      ),
    );

    while (startDateTime < endDateTime) {
      const s = await convertDateTime(startDateTime);
      const e = await convertDateTime(addMinutes(startDateTime, interval));

      const scheduleData = {
        startDateTime: s,
        endDateTime: e,
      };

      const isExists = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!isExists) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });

        schedule.push(result);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + interval);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedule;
};

export const scheduleService = {
  createSchedule,
};
