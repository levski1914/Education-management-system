"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  Views,
  Event as CalendarEvent,
} from "react-big-calendar";
import moment from "moment";
import "moment/locale/bg";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import { api } from "@/app/utils/api";

const localizer = momentLocalizer(moment);
moment.locale("bg");

type Slot = {
  id: string;
  date: string;
  durationMin: number;
  status: "AVAILABLE" | "BOOKED" | "CANCELLED";
  bookedBy?: { firstName: string; lastName: string };
};

export default function TeacherCalendar() {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
     const token = localStorage.getItem("token");
const res = await api.get("/consultations/mine", {
  headers: { Authorization: `Bearer ${token}` },
});
      setSlots(res.data);
    } catch (err) {
      toast.error("Неуспешно зареждане на календара");
    }
  };

  const events: CalendarEvent[] = slots.map((slot) => {
    const start = new Date(slot.date);
    const end = new Date(start.getTime() + slot.durationMin * 60000);

    return {
      id: slot.id,
      title:
        slot.status === "BOOKED"
          ? `📌 Записан: ${slot.bookedBy?.firstName || "Ученик"}`
          : slot.status === "CANCELLED"
          ? "❌ Отменен"
          : "🟢 Свободен",
      start,
      end,
      resource: slot,
    };
  });

  const handleSlotSelect = async ({ start }: { start: Date }) => {
    const token = localStorage.getItem("token");
    const durationMin = 30;
    const confirm = window.confirm(
      `Създаване на слот на ${start.toLocaleString()} за ${durationMin} мин.?`
    );
    if (!confirm) return;

    try {
    await api.post(
  "/consultations/create",
  { date: start, durationMin },
  { headers: { Authorization: `Bearer ${token}` } }
);
      toast.success("Добавен нов слот за консултация.");
      fetchSlots();
    } catch(error) {
        console.log(error)
      toast.error("Грешка при създаване на слот.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">📅 Моите консултации</h2>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        defaultView={Views.WEEK}
        onSelectSlot={handleSlotSelect}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        messages={{
          today: "Днес",
          previous: "Назад",
          next: "Напред",
          month: "Месец",
          week: "Седмица",
          day: "Ден",
          agenda: "Списък",
          date: "Дата",
          time: "Час",
          event: "Събитие",
          noEventsInRange: "Няма консултации",
        }}
      />
    </div>
  );
}
