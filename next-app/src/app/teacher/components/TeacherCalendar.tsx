"use client";

import { useEffect, useRef, useState } from "react";
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
  notes: string;
  durationMin: number;
  status: "AVAILABLE" | "BOOKED" | "CANCELLED";
  bookedBy?: { firstName: string; lastName: string };
};

export default function TeacherCalendar() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "AVAILABLE" | "BOOKED" | "CANCELLED"
  >("ALL");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<Views>(Views.WEEK);
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false); // затваря модала
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleEventClick = (event: CalendarEvent) => {
    const slot = event.resource as Slot;

    if (slot.status === "BOOKED") {
      toast.info("⛔ Слотът вече е запазен и не може да бъде редактиран.");
      return;
    }

    setSelectedSlot(slot);
    setShowModal(true);
  };

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

  const handleSlotSelect = async ({
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }) => {
    const durationMin = Math.round((end.getTime() - start.getTime()) / 60000);
    if (durationMin < 15) {
      toast.warning("Минималната продължителност е 15 минути.");
      return;
    }
    const token = localStorage.getItem("token");

    const confirm = window.confirm(
      `Създаване на слот от ${start.toLocaleTimeString()} до ${end.toLocaleTimeString()} за ${durationMin} минути?`
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
    } catch (error) {
      console.log(error);
      toast.error("Грешка при създаване на слот.");
    }
  };
  const filteredEvents = events.filter((e) =>
    filterStatus === "ALL" ? true : e.resource.status === filterStatus
  );

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">📅 Моите консултации</h2>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as any)}
        className="mb-4 p-2 border rounded"
      >
        <option value="ALL">Всички</option>
        <option value="AVAILABLE">Свободни</option>
        <option value="BOOKED">Записани</option>
        <option value="CANCELLED">Отменени</option>
      </select>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        selectable
        defaultView={Views.WEEK}
        view={view}
        onView={(v) => setView(v)}
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        onSelectSlot={handleSlotSelect}
        onSelectEvent={handleEventClick}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        min={new Date(1970, 1, 1, 8, 0)} // 08:00 ч.
        max={new Date(1970, 1, 1, 17, 0)} // 17:00 ч.
        eventPropGetter={(event) => {
          const slot = event.resource as Slot;
          const baseStyle = { style: {} as React.CSSProperties };

          if (slot.status === "BOOKED") {
            baseStyle.style.backgroundColor = "#1e40af"; // синьо
          } else if (slot.status === "AVAILABLE") {
            baseStyle.style.backgroundColor = "#16a34a"; // зелено
          } else {
            baseStyle.style.backgroundColor = "#9ca3af"; // сиво
          }

          baseStyle.style.color = "white";
          return baseStyle;
        }}
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
      {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
          >
            <h3 className="text-lg font-bold mb-4">Редакция на слот</h3>

            <label className="block text-sm font-medium mb-1">Дата и час</label>
            <input
              type="datetime-local"
              value={new Date(selectedSlot.date).toISOString().slice(0, 16)}
              onChange={(e) =>
                setSelectedSlot({
                  ...selectedSlot,
                  date: new Date(e.target.value).toISOString(),
                })
              }
              className="border rounded p-2 w-full mb-4"
            />

            <label className="block text-sm font-medium mb-1">
              Продължителност (мин)
            </label>
            <input
              type="number"
              value={selectedSlot.durationMin}
              onChange={(e) =>
                setSelectedSlot({
                  ...selectedSlot,
                  durationMin: parseInt(e.target.value),
                })
              }
              className="border rounded p-2 w-full mb-4"
            />
            <label>Бележка</label>
            <textarea
              value={selectedSlot.notes}
              onChange={(e) =>
                setSelectedSlot({ ...selectedSlot, notes: e.target.value })
              }
              className="border rounded p-2 w-full mb-4"
            />
            <label className="block text-sm font-medium mb-1">Статус</label>
            <select
              value={selectedSlot.status}
              onChange={(e) =>
                setSelectedSlot({
                  ...selectedSlot,
                  status: e.target.value as Slot["status"],
                })
              }
              className="border rounded p-2 w-full mb-4"
            >
              <option value="AVAILABLE">Свободен</option>
              <option value="CANCELLED">Отменен</option>
            </select>

            <div className="flex justify-between gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Затвори
              </button>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  try {
                    await api.put(
                      `/consultations/${selectedSlot.id}`,
                      {
                        date: selectedSlot.date,
                        durationMin: selectedSlot.durationMin,
                        notes: selectedSlot.notes,
                        status: selectedSlot.status,
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    toast.success("✅ Слотът е обновен.");
                    setShowModal(false);
                    fetchSlots();
                  } catch {
                    toast.error("❌ Грешка при обновяване.");
                  }
                }}
              >
                Запази
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  try {
                    await api.delete(`/consultations/hard/${selectedSlot.id}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    toast.success("🗑️ Слотът е изтрит.");
                    setShowModal(false);
                    fetchSlots();
                  } catch {
                    toast.error("❌ Неуспешно изтриване.");
                  }
                }}
              >
                Изтрий
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
