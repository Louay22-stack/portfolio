// Sources: CV "Technical Skills" + tools evidenced in the project folders
// (AnaeroVision/*.py, BioPredict/*.py|ipynb, pfd/README.md) and the internship reports.

export const expertise = [
  {
    group: "Bioprocess engineering",
    items: [
      { name: "Anaerobic digestion & biogas", evidence: "AnaeroVision · Mitacs internship" },
      { name: "Inhibition diagnosis (TAN, VFA, LCFA, salinity)", evidence: "AnaeroVision" },
      { name: "Fermentation & SCP production", evidence: "BioPredict · coursework" },
      { name: "Microalgae cultivation", evidence: "Microalgae project" },
      { name: "Reactor-performance assessment", evidence: "CV" },
      { name: "Good Manufacturing Practice (GMP)", evidence: "ADWYA internship" },
    ],
  },
  {
    group: "Process engineering",
    items: [
      { name: "DWSIM steady-state simulation", evidence: "Biogas process simulation" },
      { name: "Mass & energy balances", evidence: "Biogas process simulation" },
      { name: "PFD & stream tables (draw.io)", evidence: "Biogas process simulation" },
      { name: "Sensitivity analysis", evidence: "Biogas · BioPredict" },
      { name: "Process & operating-condition optimisation", evidence: "CV · ADWYA internship" },
      { name: "Time studies & continuous improvement", evidence: "ADWYA internship" },
    ],
  },
  {
    group: "Machine learning & data science",
    items: [
      { name: "Regression & classification", evidence: "AnaeroVision · BioPredict" },
      { name: "Model validation (group split, CV, LOO)", evidence: "AnaeroVision · BioPredict" },
      { name: "Hyperparameter & threshold tuning", evidence: "AnaeroVision" },
      { name: "ANN/MLP, Random Forest, XGBoost, SVM", evidence: "AnaeroVision" },
      { name: "Statistical analysis & EDA", evidence: "CV · all projects" },
      { name: "RNA-Seq analysis", evidence: "Institut Pasteur internship" },
    ],
  },
  {
    group: "Software & tools",
    items: [
      { name: "Python, pandas, scikit-learn", evidence: "All projects" },
      { name: "Streamlit decision-support apps", evidence: "AnaeroVision · BioPredict" },
      { name: "R", evidence: "CV" },
      { name: "Galaxy (bioinformatics), Linux", evidence: "Institut Pasteur internship · CV" },
      { name: "Excel, Word, PowerPoint", evidence: "CV" },
    ],
  },
] as const;

export const credentials = [
  {
    title: "Intermediate Machine Learning",
    issuer: "Kaggle Learn",
    date: "February 22, 2026",
    image: "/credentials/kaggle-intermediate-ml.jpg",
    imageAlt: "Kaggle certificate of completion: Louay Ouhibi, Intermediate Machine Learning, February 22, 2026",
    source: "machine learning certif.jpeg",
  },
  {
    title: "Duolingo English Test: 130 / 160 (CEFR C1)",
    issuer: "Duolingo",
    date: "March 25, 2026",
    href: "https://certs.duolingo.com/8jmzep6720th5xs6",
    linkLabel: "Verify certificate",
    source: "Duolingo English Test.pdf",
  },
  {
    title: "Mitacs Globalink Research Internship",
    issuer: "Mitacs · Memorial University of Newfoundland",
    date: "May – August 2026",
    source: "cv_Louay Ouhibi.pdf",
  },
] as const;
