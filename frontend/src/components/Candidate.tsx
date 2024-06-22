import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

const CandidateComponent = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({
    fullName: "",
    email: "",
    resume: null,
  });
  const [r1Answers, setR1Answers] = useState([]);
  const [r2Answers, setR2Answers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, seteMail] = useState(localStorage.getItem("email") || "");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/jobs/assigned"
      );
      if (!response.data) {
        throw new Error("Failed to fetch jobs");
      }
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setErrorMessage("Failed to fetch jobs. Please try again later.");
      setLoading(false);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setStep(1); // Start at step 1 when a new job is selected
  };

  const handleDetailsChange = (field, value) => {
    if (field === "resume") {
      // Handling file upload for resume
      setDetails((prevDetails) => ({
        ...prevDetails,
        resume: value, // This assumes value is the File object from the input
      }));
    } else {
      setDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
      }));
    }
  };

  const handleR1AnswerChange = (index, value) => {
    const newAnswers = [...r1Answers];
    newAnswers[index] = value;
    setR1Answers(newAnswers);
  };

  const handleR2AnswerChange = (index, value) => {
    const newAnswers = [...r2Answers];
    newAnswers[index] = value;
    setR2Answers(newAnswers);
  };

  const handleNextStep = () => {
    if (step === 1 && details.fullName && details.email && details.resume) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleApply = async () => {
    try {
      const formData = new FormData();
      formData.append("jobTitle", selectedJob.jobTitle);
      formData.append("fullName", details.fullName);
      formData.append("email", details.email);
      formData.append("resume", details.resume);
      formData.append("r1Answers", JSON.stringify(r1Answers));
      formData.append("r2Answers", JSON.stringify(r2Answers));
      formData.append("id", email);

      const response = await axios.post(
        "http://localhost:5000/api/applications",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Application submitted:", response.data);

      // Reset state after successful submission
      setSelectedJob(null);
      setStep(0);
      setDetails({
        fullName: "",
        email: "",
        resume: null,
      });
      setR1Answers([]);
      setR2Answers([]);
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      console.error("Error submitting application:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message); // Set the error message from server response
      } else {
        setErrorMessage(
          "Failed to submit application. Please try again later."
        ); // Default error message
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white shadow-md rounded-md max-w-full md:max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Candidate Application
      </h1>

      <Modal
        isOpen={selectedJob !== null}
        onRequestClose={() => setSelectedJob(null)}
        contentLabel="Apply for Job"
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto my-10 overflow-y-auto max-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div>
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
              <input
                type="text"
                placeholder="Full Name"
                value={details.fullName}
                onChange={(e) =>
                  handleDetailsChange("fullName", e.target.value)
                }
                className="w-full p-2 border rounded-lg mb-4"
              />
              <input
                type="email"
                placeholder="Email"
                value={details.email}
                onChange={(e) => handleDetailsChange("email", e.target.value)}
                className="w-full p-2 border rounded-lg mb-4"
              />
              <input
                type="file"
                onChange={(e) =>
                  handleDetailsChange("resume", e.target.files?.[0])
                }
                className="w-full p-2 border rounded-lg mb-4"
              />
              {errorMessage && (
                <div className="bg-red-500 text-white p-3 rounded-md mb-4">
                  {errorMessage}
                </div>
              )}
              <button
                onClick={handleNextStep}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Answer Questions</h2>
              <h3 className="text-lg font-semibold mb-2">
                {selectedJob.jobTitle} Questions
              </h3>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {selectedJob.r1Questions.map((question, index) => (
                  <div key={question._id} className="mb-4">
                    <h4 className="text-lg font-semibold mb-2">
                      Question {index + 1}: {question.question}
                    </h4>
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="cursor-pointer block mb-2"
                      >
                        <input
                          type="radio"
                          name={`r1-question-${index}`}
                          value={option}
                          onChange={() => handleR1AnswerChange(index, option)}
                          checked={r1Answers[index] === option}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePreviousStep}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                >
                  Previous
                </button>
                <button
                  onClick={handleApply}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Apply
                </button>
              </div>
              {errorMessage && (
                <div className="bg-red-500 text-white p-3 rounded-md mt-4">
                  {errorMessage}
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Job Posts</h2>
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-4 border mb-2 cursor-pointer"
              onClick={() => handleJobSelect(job)}
            >
              <h3 className="font-bold">{job.jobTitle}</h3>
              <p className="text-sm">{job.location}</p>
              <p className="text-sm">${job.salary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateComponent;
