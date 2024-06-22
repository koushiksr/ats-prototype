import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root"); // Ensure this line points to your app's root element

const CoordinatorComponent = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [recruiters, setRecruiters] = useState([]);
  const [r2Questions, setR2Questions] = useState([
    { question: "", correctAnswer: "yes" },
  ]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchJobPosts();
  }, []);

  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/api/jobs/notassigned");
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const response = await axios.get("/api/users/recuiters");
      setRecruiters(response.data);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setModalIsOpen(true);
    fetchRecruiters(); // Fetch recruiters when a job is selected
  };

  const handleRecruiterChange = (index, value) => {
    const newRecruiters = [...recruiters];
    newRecruiters[index] = value;
    setRecruiters(newRecruiters);
  };

  const addRecruiter = () => {
    setRecruiters([...recruiters, ""]);
  };

  const handleR2Change = (index, field, value) => {
    const newQuestions = [...r2Questions];
    newQuestions[index][field] = value;
    setR2Questions(newQuestions);
  };

  const addR2Question = () => {
    if (r2Questions.length < 5) {
      setR2Questions([...r2Questions, { question: "", correctAnswer: "yes" }]);
    }
  };

  const postJob = async () => {
    if (selectedJob && r2Questions.every((q) => q.question)) {
      try {
        await axios.post(`/api/jobs/${selectedJob._id}/recruiters`, {
          recruiters,
        });
        await axios.post(`/api/jobs/${selectedJob._id}/r2`, { r2Questions });
        setSelectedJob(null);
        fetchJobPosts(); // Refresh job posts after posting a job
        setRecruiters([]);
        setR2Questions([{ question: "", correctAnswer: "yes" }]);
        setModalIsOpen(false);
      } catch (error) {
        console.error("Error posting job:", error);
      }
    } else {
      alert("Please fill all R2 questions.");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white shadow-md rounded-md max-w-full md:max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Coordinator Dashboard
      </h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Job Posts</h2>
        {jobPosts.map((job) => (
          <div
            key={job._id}
            className="p-4 border mb-2 cursor-pointer"
            onClick={() => handleJobSelect(job)}
          >
            <h3 className="font-bold">{job.jobTitle}</h3>
            <p>{job.location}</p>
            <p>${job.salary.toLocaleString()}</p>
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Job Details"
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto my-10"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        {selectedJob && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Selected Job: {selectedJob.jobTitle}
            </h2>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Assign Recruiters</h3>
              {recruiters.map((recruiter, index) => (
                <select
                  key={index}
                  value={recruiter}
                  onChange={(e) => handleRecruiterChange(index, e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2"
                >
                  <option value="">Select Recruiter</option>
                  <option value={recruiter._id}>
                    {recruiter.username}
                  </option>{" "}
                  {/* Assuming recruiter has an _id and name field */}
                </select>
              ))}
              <button
                type="button"
                onClick={addRecruiter}
                className="text-blue-500 hover:underline"
              >
                Add Recruiter
              </button>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">R2 Check Questions</h3>
              {r2Questions.map((question, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      handleR2Change(index, "question", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg mb-2"
                    placeholder={`Question ${index + 1}`}
                  />
                  <div className="flex items-center mb-2">
                    <label className="mr-2">Correct Answer:</label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleR2Change(index, "correctAnswer", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              ))}
              {r2Questions.length < 5 && (
                <button
                  type="button"
                  onClick={addR2Question}
                  className="text-blue-500 hover:underline"
                >
                  Add R2 Question
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={postJob}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-150 mb-4"
            >
              Post Job
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CoordinatorComponent;
