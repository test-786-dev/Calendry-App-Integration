"use client";

import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { useState } from "react";
import axios from "axios";

export default function ContactUs() {
  const [bookingStatus, setBookingStatus] = useState(null);

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      setBookingStatus("Appointment booked successfully!");
      axios
        .post("/api/log-booking", {
          event: e.data.payload,
        })
        .catch((err) => console.error("Error logging booking:", err));
    },
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "896px",
          width: "100%",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "24px",
            color: "#1f2937",
          }}
        >
          Contact Us
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#4b5563",
            marginBottom: "32px",
            fontSize: "1rem",
          }}
        >
          Book an appointment with our team or reach out via email at{" "}
          <a
            href="mailto:team@testpoc.com"
            style={{ color: "#2563eb", textDecoration: "underline" }}
          >
            team@testpoc.com
          </a>
        </p>

        <div style={{ width: "100%" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "16px",
              textAlign: "center",
              color: "#1f2937",
            }}
          >
            Book an Appointment
          </h2>
          {bookingStatus && (
            <p
              style={{
                color: "#16a34a",
                textAlign: "center",
                marginBottom: "16px",
                fontSize: "1rem",
              }}
            >
              {bookingStatus}
            </p>
          )}
          <div
            style={{
              width: "100%",
              height: "700px",
              "@media (minWidth: 768px)": { height: "600px" },
            }}
          >
            <InlineWidget
              url="https://calendly.com/ahtisham-phantasm/30min"
              styles={{
                height: "100%",
                width: "100%",
                minWidth: "320px",
              }}
              pageSettings={{
                backgroundColor: "ffffff",
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: "00a2ff",
                textColor: "4d5055",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}