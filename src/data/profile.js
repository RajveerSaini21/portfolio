// Every fact rendered anywhere in this site comes from this file.
// Sourced from Rajveer_Saini_Resume_ATS.docx, with two corrections confirmed
// directly by Rajveer: HerCycles uses Random Forest + TF-IDF (not an RNN), and
// Chitkara runs Aug 2023 to 2027 (final year).

export const profile = {
  name: 'Rajveer Saini',
  role: 'Full Stack Developer & Data Scientist',
  tagline:
    'I build real-time MERN applications and end-to-end machine learning pipelines.',
  location: 'Rajpura, Punjab, India',
  status: 'Final-year B.E. CSE at Chitkara University · Graduating 2027',
  summary:
    'Full Stack Developer and Data Science practitioner with hands-on experience building real-time web applications and end-to-end ML pipelines. I work across the MERN stack, Python, Java and SQL, and I have shipped production analytics work as an intern at Amdox Technologies. Comfortable owning a feature from REST API design through model evaluation and deployment.',

  contact: {
    email: 'sainiveer2005@gmail.com',
    collegeEmail: 'rajveer1024.be23@chitkara.edu.in',
    phone: '+91 9799661076',
    github: 'https://github.com/RajveerSaini21',
    githubHandle: 'RajveerSaini21',
    linkedin: 'https://www.linkedin.com/in/rajveer-saini-5930452b5/',
    linkedinHandle: 'rajveer-saini-5930452b5',
    resume: '/Rajveer_Saini_Resume.pdf',
  },

  stats: [
    { value: '8.71', unit: '/10', label: 'CGPA' },
    { value: '2', label: 'Internships' },
    { value: '92', unit: '%', label: 'Model accuracy' },
    { value: '3', label: 'Hackathons placed' },
  ],

  // `color` drives both the HTML chip and the matching orbiting sphere in 3D.
  skillGroups: [
    {
      name: 'Languages',
      color: '#38bdf8',
      items: ['Java', 'Python', 'JavaScript', 'SQL', 'HTML', 'CSS'],
    },
    {
      name: 'Frameworks',
      color: '#a78bfa',
      items: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'REST API'],
    },
    {
      name: 'Data Science & ML',
      color: '#34d399',
      items: [
        'Pandas',
        'NumPy',
        'Scikit-learn',
        'TensorFlow',
        'Keras',
        'Matplotlib',
        'Seaborn',
      ],
    },
    {
      name: 'Tools',
      color: '#fbbf24',
      items: ['Git', 'GitHub', 'VS Code', 'Postman', 'Linux', 'Vercel', 'Render'],
    },
    {
      name: 'Concepts',
      color: '#f472b6',
      items: [
        'Data Structures',
        'Algorithms',
        'OOP',
        'DBMS',
        'Operating Systems',
        'System Design',
        'Agile/Scrum',
      ],
    },
  ],
  experience: [
    {
      company: 'Amdox Technologies',
      title: 'Data Science and Analytics Intern',
      mode: 'Remote',
      period: 'Nov 2025 – Feb 2026',
      accent: '#34d399',
      points: [
        'Built an end-to-end ML pipeline in Python, Pandas and Scikit-learn across 5+ datasets covering preparation, EDA, predictive modeling and executive reporting, cutting analysis time by 40%.',
        'Developed regression models reaching 85% accuracy through feature engineering and hyperparameter tuning, and visualized findings with Matplotlib and Seaborn, informing 3 key business decisions.',
        'Delivered business reports by preprocessing raw datasets, running statistical analysis and presenting actionable insights to stakeholders.',
      ],
    },
    {
      company: 'My AI Store',
      title: 'Software Developer Intern',
      mode: 'Remote',
      period: 'Sep 2025 – Oct 2025',
      accent: '#38bdf8',
      points: [
        'Engineered customizable AI agents with Python and ML libraries to detect pain points and segment markets across 1,000+ leads, improving targeting efficiency by 35%.',
        'Automated sales outreach with Python scripting and REST API integrations, shortening the pipeline cycle by 20% and improving conversion tracking accuracy.',
        'Worked in an Agile team, contributing to sprint planning, code reviews and iterative feature deployment.',
      ],
    },
  ],

  projects: [
    {
      name: 'HerCycles',
      period: 'Jul 2025 – Dec 2025',
      blurb:
        'Full-stack women’s health platform for real-time menstrual cycle tracking and symptom analysis, serving 500+ users.',
      stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB Atlas', 'Scikit-learn'],
      points: [
        'Built a MERN platform for 500+ users with real-time cycle tracking, backed by MongoDB Atlas for scalable cloud data handling.',
        'Trained a Random Forest classifier over TF-IDF text embeddings for multi-input symptom analysis, hitting 92% accuracy and cutting false positives by 40% through tuned alert thresholds.',
        'Designed RESTful APIs in Node.js and Express.js with JWT authentication and role-based access control.',
      ],
      repo: 'https://github.com/sakshibansal05/Her_Cycles',
      demo: null,
      accent: '#f472b6',
      shape: 'knot',
    },
    {
      name: 'Echoes of Realms',
      period: 'Jan 2025 – May 2025',
      blurb:
        'MERN travel platform surfacing 50+ offbeat Indian destinations with curated local food, market and heritage guides.',
      stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
      points: [
        'Developed a full-stack travel platform covering 50+ offbeat destinations with a dynamic React.js UI, doubling average user session time.',
        'Implemented a content management system on MongoDB and Node.js REST APIs for local experiences, lifting engagement metrics by 28%.',
        'Added responsive layouts and optimized API performance to reduce page load time.',
      ],
      repo: 'https://github.com/RajveerSaini21/TravelBlog',
      demo: null,
      accent: '#38bdf8',
      shape: 'octa',
    },
    {
      name: 'Echo Vision',
      period: 'Research',
      blurb:
        'IoT smart cap for the visually impaired with ultrasonic obstacle detection, haptic feedback and an SOS trigger. Co-authored paper submitted to Microsoft CMT.',
      stack: ['IoT', 'Embedded Systems', 'Research'],
      points: [
        'Co-authored the paper “Echo Vision: Smart Cap for Blind with Obstacle Detection, Haptic Feedback, SOS”, submitted through Microsoft CMT.',
        'Designed a wearable assistive prototype pairing obstacle detection with haptic cues and an emergency SOS path.',
      ],
      repo: null,
      demo: null,
      accent: '#a78bfa',
      shape: 'ico',
    },
  ],

  education: [
    {
      school: 'Chitkara University, Punjab',
      credential: 'B.E. in Computer Science and Engineering',
      period: 'Aug 2023 – 2027 (final year)',
      detail: 'CGPA 8.71/10 · Rajpura, Punjab',
    },
    {
      school: 'Subodh Public School, Jaipur',
      credential: 'Class XII — Science (PCM), CBSE',
      period: 'Feb 2022 – Apr 2023',
      detail: null,
    },
    {
      school: 'Modern School, Jaipur',
      credential: 'Class X, CBSE',
      period: 'Feb 2020 – Mar 2021',
      detail: null,
    },
  ],

  achievements: [
    {
      title: 'Build with India Hackathon',
      detail: 'Top 5,000 of 25,000 teams — built an AI prototype with Python and ML libraries in 48 hours.',
    },
    {
      title: 'Hack With Her',
      detail: 'Top 70 of 350 teams — shipped a full-stack women’s health app on the MERN stack.',
    },
    {
      title: 'Somnium Hackathon',
      detail: 'Built a prototype under the “Imagine, Build, Innovate” theme.',
    },
    {
      title: 'Nutanix Certified Associate (NCA 6)',
      detail: 'Certification, Nutanix.',
    },
  ],
}

