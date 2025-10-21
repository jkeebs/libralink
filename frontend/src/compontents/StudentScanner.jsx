import { useEffect, useRef, useState } from "react";

const API_URL = "http://localhost:5000/api/books";

export default function StudentScanner({ onClose }) {
  const qrRegionRef = useRef(null);
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
  let html5QrCode;
    const startScanner = async () => {
      if (!window.Html5Qrcode) {
        setMessage("Scanner library not loaded");
        return;
      }

  html5QrCode = new window.Html5Qrcode("qr-reader");
  scannerRef.current = html5QrCode;
      setScanning(true);

      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: 250,
          },
          async (decodedText) => {
            // Stop scanning while handling
            await html5QrCode.stop();
            setScanning(false);
            setMessage(`Scanned: ${decodedText}`);

            try {
              const res = await fetch(`${API_URL}/borrow/${encodeURIComponent(decodedText)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail: "student@example.com" }),
              });
              const result = await res.json();
              if (result.success) {
                setMessage("Book borrowed successfully");
              } else {
                setMessage(`Error: ${result.message}`);
              }
            } catch (err) {
              setMessage("Network error while borrowing book");
            }
          },
          (errorMessage) => {
            // ignore decode failures
          }
        );
      } catch (err) {
        setMessage("Unable to start camera. Check permissions.");
        setScanning(false);
      }
    };

    startScanner();

    return () => {
      const inst = scannerRef.current || html5QrCode;
      if (inst && inst.getState && inst.getState() !== "NOT_STARTED") {
        inst.stop().catch(() => {});
        try {
          inst.clear();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="p-4 border rounded">
      <div id="qr-reader" ref={qrRegionRef} style={{ width: "100%" }} />
      <div className="mt-2">
        {message && <p className="text-sm">{message}</p>}
        <div className="flex gap-2 mt-2">
          <button
            className="btn btn-sm"
            onClick={async () => {
              const inst = scannerRef.current;
              if (inst) {
                try {
                  await inst.stop();
                } catch (e) {}
                try {
                  inst.clear();
                } catch (e) {}
                scannerRef.current = null;
              }
              onClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
