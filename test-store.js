import { create } from 'zustand';

// Simulate the store locally
const initialAppointments = [
  {
    id: "APT-1001",
    status: "CONFIRMED",
    timeline: []
  },
  {
    id: "APT-1006",
    status: "CONFIRMED"
    // NO TIMELINE!
  }
];

const useStore = create((set) => ({
  appointments: initialAppointments,
  cancelAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.map(appt => {
        if (appt.id === id) {
          const updatedTimeline = [...(appt.timeline || [])];
          updatedTimeline.forEach(t => t.current = false);
          updatedTimeline.push({
            status: "Appointment Cancelled",
            isCancelled: true
          });
          return {
            ...appt,
            status: "CANCELLED",
            timeline: updatedTimeline
          };
        }
        return appt;
      })
    }));
  }
}));

try {
  const store = useStore.getState();
  store.cancelAppointment("APT-1001");
  console.log("After 1001:", useStore.getState().appointments[0].status);
  
  store.cancelAppointment("APT-1006");
  console.log("After 1006:", useStore.getState().appointments[1].status);
} catch (e) {
  console.error("ERROR:", e);
}
