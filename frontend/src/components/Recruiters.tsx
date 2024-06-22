import React, { useState, useEffect } from "react";
import axios from "axios";

const RecruiterComponent = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(null);
  const [coordinatorQuestions, setCoordinatorQuestions] = useState([]);
  const [candidateAnswers, setCandidateAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [loadingCandidateDetails, setLoadingCandidateDetails] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [modalCandidateData, setModalCandidateData] = useState({});
  const [applicationDetails, setApplicationDetails] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/applications/recruiter");
        setJobs(response.data);
        setLoadingJobs(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  const fetchCandidates = async (jobId) => {
    setLoadingCandidates(true);
    try {
      const response = await axios.get(`/api/jobs/candidates/${jobId}`);
      setCandidates(response.data);
      setLoadingCandidates(false);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setLoadingCandidates(false);
    }
  };

  const fetchCandidateDetails = async (candidateId, jobId) => {
    setLoadingCandidateDetails(true);
    try {
      const [candidateResponse, applicationResponse] = await Promise.all([
        axios.get(`/api/users/candidate/${candidateId}`),
        axios.get(`/api/applications/${jobId}/${candidateId}`),
      ]);

      const {
        name,
        email,
        username,
        coordinatorQuestions = [],
      } = candidateResponse.data;
      const { questions, resume } = applicationResponse.data;

      setCoordinatorQuestions(coordinatorQuestions);
      setCandidateAnswers(Array(coordinatorQuestions.length).fill(""));
      setCorrectAnswers(coordinatorQuestions.map((q) => q.correctAnswer));
      setModalCandidateData({ name, email, username, resume });

      setApplicationDetails(applicationResponse.data);
      setLoadingCandidateDetails(false);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      setLoadingCandidateDetails(false);
    }
  };

  const handleJobClick = async (index) => {
    setSelectedJobIndex(index);
    const jobId = jobs[index]._id;
    await fetchCandidates(jobId);
    setSelectedCandidateIndex(null);
  };

  const handleCandidateClick = async (index) => {
    setSelectedCandidateIndex(index);
    const candidateId = candidates[index]._id;
    const jobId = jobs[selectedJobIndex]._id;
    await fetchCandidateDetails(candidateId, jobId);
    setShowCandidateModal(true);
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...candidateAnswers];
    newAnswers[index] = value;
    setCandidateAnswers(newAnswers);
  };

  const downloadPdf = (pdfBuffer, fileName) => {
    // Check if pdfBuffer or fileName is missing
    if (!pdfBuffer || !fileName) {
      console.error("pdfBuffer or fileName is missing");
      return;
    }

    // Create a Blob from the PDF buffer
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create an <a> element to trigger download
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName; // Ensure fileName has '.pdf' extension

    // Append the <a> element to the body and trigger click
    document.body.appendChild(a);
    a.click();

    // Clean up: Revoke the URL and remove the <a> element
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const submitAnswers = async () => {
    try {
      const { _id: candidateId } = candidates[selectedCandidateIndex];
      const { _id: jobId } = jobs[selectedJobIndex];

      const response = await axios.post(`/api/answers/submit`, {
        candidateId,
        jobId,
        answers: candidateAnswers,
      });

      alert("Answers submitted successfully!");
      setShowCandidateModal(false);
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Failed to submit answers. Please try again.");
    }
  };

  const closeModal = () => {
    setShowCandidateModal(false);
  };

  if (loadingJobs) {
    return <div>Loading jobs...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white shadow-md rounded-md max-w-full md:max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Recruiter Dashboard
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Jobs</h2>
        <div className="overflow-auto max-h-80">
          {jobs.map((job, index) => (
            <div
              key={job._id}
              className={`p-4 border mb-2 cursor-pointer ${
                selectedJobIndex === index ? "bg-gray-200" : ""
              }`}
              onClick={() => handleJobClick(index)}
            >
              <h3 className="font-bold">{job.jobTitle}</h3>
              <p>Location: {job.location}</p>
              <p>Salary: {job.salary}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedJobIndex !== null && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Candidates for {jobs[selectedJobIndex].jobTitle}
          </h2>
          <div className="overflow-auto max-h-80">
            {loadingCandidates ? (
              <div>Loading candidates...</div>
            ) : (
              candidates.map((candidate, index) => (
                <div
                  key={candidate._id}
                  className={`p-4 border mb-2 cursor-pointer ${
                    selectedCandidateIndex === index ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleCandidateClick(index)}
                >
                  <h3 className="font-bold">{candidate.name}</h3>
                  <p>Email: {candidate.email}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showCandidateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Candidate Details
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Name: {modalCandidateData.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Username: {modalCandidateData.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        Email: {modalCandidateData.email}
                      </p>
                      {modalCandidateData.resume && (
                        <div className="mt-2">
                          <button
                            onClick={() =>
                              downloadPdf(
                                modalCandidateData.resume.data,
                                "resume.pdf"
                              )
                            }
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Download Resume PDF
                          </button>
                        </div>
                      )}

                      {coordinatorQuestions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-lg font-medium mb-2">
                            Coordinator Questions
                          </h4>
                          {coordinatorQuestions.map((question, index) => (
                            <div key={index} className="mb-2">
                              <p className="text-sm font-semibold">
                                {index + 1}. {question.text}
                              </p>
                              <textarea
                                className="w-full h-20 px-3 py-2 border rounded-md"
                                value={candidateAnswers[index]}
                                onChange={(e) =>
                                  handleAnswerChange(index, e.target.value)
                                }
                                placeholder="Enter your answer here..."
                              ></textarea>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={submitAnswers}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Submit Answers
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        // </div>
      )}
    </div>
  );
};

export default RecruiterComponent;
