import { useState, useEffect } from "react";
import axios from "axios";

const EmployerComponent = () => {
  const [step, setStep] = useState(1);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [salary, setSalary] = useState<number | string>("");
  const [responsibilities, setResponsibilities] = useState<string>("");
  const [r1Questions, setR1Questions] = useState([
    { question: "", options: ["", "", "", ""], correctIndex: -1 },
  ]);
  const locations = ["Remote", "New York", "San Francisco", "Los Angeles"];
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (submissionStatus) {
      const timer = setTimeout(() => {
        setSubmissionStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submissionStatus]);

  const addR1Question = () => {
    if (r1Questions.length < 5) {
      setR1Questions([
        ...r1Questions,
        { question: "", options: ["", "", "", ""], correctIndex: -1 },
      ]);
    } else {
      setValidationErrors(["You can add a maximum of 5 questions."]);
    }
  };

  const handleR1Change = (
    index: number,
    field: string,
    value: string | number | string[]
  ) => {
    const newQuestions = [...r1Questions];
    if (field === "question") {
      newQuestions[index].question = value as string;
    } else if (field === "options") {
      newQuestions[index].options = value as string[];
    } else if (field === "correctIndex") {
      newQuestions[index].correctIndex = value as number;
    }
    setR1Questions(newQuestions);
  };

  const validateStep1 = () => {
    let errors: string[] = [];
    if (!jobTitle) errors.push("Job title is required.");
    if (!location) errors.push("Location is required.");
    if (!salary || isNaN(Number(salary)) || Number(salary) <= 0) {
      errors.push("Valid salary per year is required.");
    }
    if (!responsibilities) errors.push("Responsibilities are required.");
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const validateStep2 = () => {
    let errors: string[] = [];
    if (r1Questions.some((q) => !q.question)) {
      errors.push("All R1 questions must have a question.");
    }
    if (r1Questions.some((q) => q.options.some((opt) => !opt))) {
      errors.push("All R1 questions must have options filled.");
    }
    if (r1Questions.some((q) => q.correctIndex < 0)) {
      errors.push(
        "All R1 questions must have a valid correct answer selected."
      );
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      setValidationErrors([]);
    }
  };

  const handleBack = () => {
    setStep(1);
    setValidationErrors([]);
  };

  const handleSubmit = async () => {
    if (validateStep2()) {
      try {
        const payload = {
          jobTitle,
          location,
          salary,
          responsibilities,
          r1Questions,
        };

        const response = await axios.post("/api/jobs", payload); // Replace with your API endpoint

        console.log(response.data);

        // Reset form after submission
        setJobTitle("");
        setLocation("");
        setSalary("");
        setResponsibilities("");
        setR1Questions([
          { question: "", options: ["", "", "", ""], correctIndex: -1 },
        ]);
        setValidationErrors([]); // Clear errors on successful submission
        setStep(1);
        setSubmissionStatus("Job submitted successfully!");
      } catch (error) {
        console.error("Error submitting job:", error);
        setSubmissionStatus("Error submitting job. Please try again.");
      }
    }
  };

  return (
    <div className="p-8 bg-white shadow-md rounded-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Job Post</h1>

      {submissionStatus && (
        <div
          className={`p-4 mb-4 rounded-md ${
            submissionStatus.includes("successfully")
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {submissionStatus}
        </div>
      )}

      {step === 1 && (
        <>
          {/* Job Description */}
          <div className="mb-4">
            <label className="block text-gray-700">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Location</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Salary (per year)</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Responsibilities</label>
            <textarea
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={5}
            />
          </div>

          {/* Display Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-500 text-white p-2 rounded-md mb-4">
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-150"
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          {/* R1 Check */}
          <div className="mb-4">
            <label className="block text-gray-700">R1 Check Questions</label>
            {r1Questions.map((question, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  placeholder={`Question ${index + 1}`}
                  value={question.question}
                  onChange={(e) =>
                    handleR1Change(index, "question", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg mb-2"
                />
                {question.options.map((option, i) => (
                  <div key={i} className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[i] = e.target.value;
                        handleR1Change(index, "options", newOptions);
                      }}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                ))}
                <div className="flex items-center mb-2">
                  <label className="mr-2">Correct Answer Index:</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={question.correctIndex + 1}
                    onChange={(e) =>
                      handleR1Change(
                        index,
                        "correctIndex",
                        Number(e.target.value) - 1
                      )
                    }
                    className="w-12 p-2 border rounded-lg"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addR1Question}
              className="text-blue-500 hover:underline"
            >
              Add R1 Question
            </button>
          </div>

          {validationErrors.length > 0 && (
            <div className="bg-red-500 text-white p-2 rounded-md mb-4">
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-150"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-150"
            >
              Submit Job
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployerComponent;
