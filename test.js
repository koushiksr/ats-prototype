function test(prompt) {
  const url = "http://localhost:11434/api/generate";
  const data = {
    model: "llama3",
    prompt: prompt,
    format: "json",
    stream: false,
    // options: { num_thread: 8 },
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => console.log(data.response))
    .catch((error) => console.error("Error:", error));
}

const prompt =
  "{ KOUSHIK S R koushiksr1999@gmail.com | +91 7899277206 | Bengaluru KA INDIA LinkedIn: koushiksr | GitHub: koushiksr | Personal Website: Portfolios EDUCATION • Bachelor of Engineering in Electronics & communication Visvesvaraya Technological University, Belagavi, KA, INDIA Relevant Coursework - Web Development using HTML CSS and JavaScript. 2017– 2022 Overall CGPA: 6.8/10 TECHNICAL SKILLS Languages JavaScript, TypeScript, JAVA, HTML, CSS. Databases MongoDB, SQL. Technologies and Tools Node, Tailwind. Platforms GitHub, Postman Frameworks React, Angular, Express. Application software VSCode, MongoDB Compass, MySQL Workbench. EXPERIENCE • Student Intern – Embedded Fr U Pvt. Ltd Oct – Nov 21 • Wrote clear, clean code for various projects. • Worked with developers to identify and remove software bugs Adro Apps LLP – MEAN Stack Developer (Intern) Aug – Oct 23 • Designing and writing back-end APIs, Code review. • Analyzed existing software implementations to identify areas requiring improvement. • Skills: NodeJS, MongoDB, ExpressJS, AngularJS, TypeScript, JavaScript, Git, GitHub. Brainwaves Learning Library – React Developer & UI design (Intern) Jan 24 – Current • UI Design and development of React-based UI components for both web and mobile App. • Creating and enhancing the user interface to improve the overall user experience. • Skills: Figma, React, Node, JavaScript, TypeScript, Git, GitHub, GitHub desktop. PROJECTS & LEADERSHIP • Eazy op: Comprehensive solution encompassing doctor consultations and seamless medicine delivery services. Jun – Jul 23 (Express, Node, Angular, MongoDB) Click Here • Developed a customer-centric Analytics Web App with a friendly UI design for doctor clinics and patients. • Integrated platform providing end-to-end solutions for doctor consultations and efficient medicine delivery services. • Schools Assessment Management (Ongoing). Sep – Nov 21 (Express, Node, Angular, MongoDB) • Developed a real-time solution for ongoing school activity and health management tracking. • Focused on creating a comprehensive and user-friendly solution to meet the specific needs of school activity and health management. ACHIEVEMENTS & CERTIFICATES • Certified from Epic React Dev On “React JS” • Certified from J spiders & TNS on “Java full stack” • National level Paper presentation Certificate DIDES and AICTE (2022) } i need a emailfrom this data ";
test(prompt);
