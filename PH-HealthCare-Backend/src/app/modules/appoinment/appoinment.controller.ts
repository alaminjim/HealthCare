import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { StatusCodes } from "http-status-codes";
import { AppointmentService } from "./appionment.service";

const bookAppointment = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const appointment = await AppointmentService.bookAppointment(payload, user);
  res.json({
    success: true,
    httpStatusCode: StatusCodes.CREATED,
    message: "Appointment booked successfully",
    data: appointment,
  });
});

const getMyAppointments = catchFn(async (req: Request, res: Response) => {
  const user = req.user;
  const appointments = await AppointmentService.getMyAppointments(user);
  res.json({
    success: true,
    httpStatusCode: StatusCodes.CREATED,
    message: "Appointment retrieved successfully",
    data: appointments,
  });
});

const changeAppointmentStatus = catchFn(async (req: Request, res: Response) => {
  const appointmentId = req.params.id;
  const payload = req.body;
  const user = req.user;

  const updatedAppointment = await AppointmentService.changeAppointmentStatus(
    appointmentId as string,
    payload,
    user,
  );
  res.json({
    success: true,
    httpStatusCode: StatusCodes.CREATED,
    message: "Appointment booked successfully",
    data: updatedAppointment,
  });
});

const getMySingleAppointment = catchFn(async (req: Request, res: Response) => {
  const appointmentId = req.params.id;
  const user = req.user;

  const appointment = await AppointmentService.getMySingleAppointment(
    appointmentId as string,
    user,
  );
  res.json({
    success: true,
    httpStatusCode: StatusCodes.CREATED,
    message: "Appointment retrieved successfully",
    data: appointment,
  });
});

const getAllAppointments = catchFn(async (req: Request, res: Response) => {
  const appointments = await AppointmentService.getAllAppointments();
  res.json({
    success: true,
    httpStatusCode: StatusCodes.CREATED,
    message: "Appointment retrieved successfully",
    data: appointments,
  });
});

const bookAppointmentWithPayLater = catchFn(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user;
    const appointment = await AppointmentService.bookAppointmentWithPayLater(
      payload,
      user,
    );
    sendResponse(res, {
      success: true,
      httpStatusCode: StatusCodes.CREATED,
      message: "Appointment booked successfully with Pay Later option",
      data: appointment,
    });
  },
);

const initiatePayment = catchFn(async (req: Request, res: Response) => {
  const appointmentId = req.params.id;
  const user = req.user;
  const paymentInfo = await AppointmentService.initiatePayment(
    appointmentId as string,
    user,
  );

  sendResponse(res, {
    success: true,
    httpStatusCode: StatusCodes.OK,
    message: "Payment initiated successfully",
    data: paymentInfo,
  });
});

export const AppointmentController = {
  bookAppointment,
  getMyAppointments,
  changeAppointmentStatus,
  getMySingleAppointment,
  getAllAppointments,
  bookAppointmentWithPayLater,
  initiatePayment,
};
