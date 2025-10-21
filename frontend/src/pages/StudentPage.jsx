import StudentScanner from "../compontents/StudentScanner";

export default function StudentPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Scanner</h1>
      <p className="mb-4 text-sm">Use this page to scan book QR codes to borrow books.</p>
      <StudentScanner onClose={() => {}} />
    </div>
  );
}
