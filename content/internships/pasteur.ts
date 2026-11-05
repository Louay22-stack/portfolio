import type { Project } from "@/lib/types";

const REPORT = "Rapport stage pasteur.pdf";
const fig = "/internships/pasteur";

export const pasteur: Project = {
  slug: "institut-pasteur-rna-seq",
  order: 1,
  title: "Exploring Breast Cancer Gene Activity with RNA-Seq",
  shortTitle: "Institut Pasteur de Tunis",
  kicker: "Bioinformatics · Transcriptomics",
  tagline: "An exploratory analysis of public RNA-Seq data comparing healthy breast tissue with breast cancer samples before and after chemotherapy.",
  summary:
    "A four-week bioinformatics internship at the Institut Pasteur de Tunis: a complete RNA-Seq workflow in Galaxy, from raw sequencing files to a gene count matrix, followed by exploratory analysis in Python and functional enrichment with STRING.",
  plain: {
    goal: "Read gene activity in breast cancer",
    type: "Research internship · Tunisia",
    oneLine: "Analysing public genetic data to explore how gene activity differs between healthy breast tissue and breast cancer, before and after chemotherapy.",
    problem:
      "Cancer changes which genes are active, and chemotherapy may change them again. Sequencing can reveal this, but it produces millions of raw fragments that mean nothing until they are cleaned, mapped and counted.",
    did: "I took three public samples (healthy, before chemotherapy and after chemotherapy) through a full analysis pipeline, compared their gene activity in Python, and looked at what the genes that stood out do in the cell.",
    result:
      "Between 94% and 98% of the fragments matched the human genome, and 70,468 genes were kept for analysis. The two cancer samples were very alike (correlation 0.99) and differed from the healthy one (about 0.59). With one sample per group, these are leads rather than conclusions.",
    resultSource: `${REPORT} p. 17, 21, 23`,
    why: "I learned a complete bioinformatics workflow, from raw data to biological interpretation, and how much the design of a study limits what it can prove.",
    glossary: [
      { term: "RNA-Seq", meaning: "A technique that reads which genes are active in a sample, and how active they are." },
      { term: "Read", meaning: "One short fragment of sequence produced by the sequencing machine." },
      { term: "Mapping", meaning: "Finding where each read belongs on the human genome." },
      { term: "Galaxy", meaning: "A web platform for running bioinformatics tools as a workflow." },
      { term: "Biological replicate", meaning: "A repeat of the same condition on another sample, needed for reliable statistics." },
      { term: "Correlation", meaning: "How similar two samples are, where 1.0 means identical patterns." },
      { term: "Enrichment analysis", meaning: "Checking whether a list of genes shares a biological function more often than chance." },
    ],
    guide: {
      context: "Why gene activity matters in breast cancer research.",
      objectives: "What this internship set out to do.",
      method: "What data was used and the steps that turned it into gene counts.",
      results: "How good the data was, and the patterns that appeared.",
      limitations: "What this work cannot claim, and why.",
      significance: "What this experience brought to my engineering profile.",
    },
  },
  categories: ["Bioinformatics"],
  period: "1 Aug – 1 Sep 2025",
  role: "Bioinformatics intern",
  context: "Bioinformatics, Biostatistics and Biomathematics laboratory (BIMS), Institut Pasteur de Tunis",
  tools: ["Galaxy", "FastQC", "MultiQC", "Trim Galore", "HISAT2", "Samtools", "featureCounts", "Python", "STRING"],
  headline: [
    { value: "3", label: "Samples analysed", detail: "Healthy · before chemotherapy · after chemotherapy", source: `${REPORT} p. 10` },
    { value: "94–98%", label: "Reads mapped to the genome", detail: "Reference genome GRCh38 (hg38)", source: `${REPORT} p. 17` },
    { value: "70,468", label: "Genes kept for analysis", detail: "Of 78,686, after removing genes with zero counts", source: `${REPORT} p. 20–21` },
    { value: "0.99", label: "Correlation, cancer samples", detail: "About 0.59 with the healthy sample", source: `${REPORT} p. 23` },
  ],
  sections: [
    {
      id: "context",
      title: "Context & problem",
      blocks: [
        {
          kind: "lead",
          text: "RNA-Seq measures gene activity across the whole genome, which makes it a key tool for studying how tumours behave and how they respond to treatment.",
        },
        {
          kind: "p",
          text: "This internship used public data to ask an exploratory question: how do global gene activity patterns compare between healthy breast tissue and breast cancer samples taken before and after chemotherapy?",
        },
      ],
    },
    {
      id: "objectives",
      title: "Objectives",
      blocks: [
        {
          kind: "list",
          items: [
            "Build a complete analysis pipeline, from raw sequencing data to a gene count matrix.",
            "Check data quality at each step before trusting the results.",
            "Explore gene activity patterns across the three conditions.",
            "Connect the genes that stand out to biological functions.",
          ],
        },
      ],
    },
    {
      id: "method",
      title: "Data & pipeline",
      blocks: [
        {
          kind: "p",
          text: "Three paired-end RNA-Seq samples were imported into Galaxy from the European Nucleotide Archive. Reads were checked with FastQC and MultiQC, trimmed with Trim Galore, aligned to GRCh38 with HISAT2, sorted with Samtools and counted per gene with featureCounts, using the GENCODE v48 annotation.",
        },
        {
          kind: "figures",
          items: [
            { src: `${fig}/analysis-pipeline.png`, width: 1017, height: 398, alt: "Six-step workflow: quality control, trimming, quality control after trimming, alignment, BAM file processing and gene quantification", caption: "The six steps of the Galaxy workflow", source: `${REPORT} p. 12` },
          ],
        },
        {
          kind: "p",
          text: "The count matrix was then explored in Python with pandas, matplotlib, seaborn and scikit-learn: filtering, log transformation, sample correlations, PCA, heatmaps and fold changes. Genes higher in the cancer samples were analysed in STRING for enrichment and protein interactions.",
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          kind: "table",
          caption: "Alignment to the human genome",
          head: ["Sample", "Reads mapped", "Reads unmapped"],
          rows: [
            ["Healthy", "94.05%", "5.95%"],
            ["Before chemotherapy", "98.39%", "1.61%"],
            ["After chemotherapy", "97.97%", "2.03%"],
          ],
          source: `${REPORT} p. 17`,
        },
        {
          kind: "figures",
          items: [
            { src: `${fig}/sample-correlations.png`, width: 636, height: 561, alt: "Heatmap showing a correlation of 0.992 between the two cancer samples and about 0.59 between each of them and the healthy sample", caption: "Correlation between the three samples", source: `${REPORT} p. 23` },
          ],
        },
        {
          kind: "p",
          text: "The samples taken before and after chemotherapy were almost identical overall (r = 0.992), and both differed from the healthy sample (r ≈ 0.59). PCA showed the same split, with the first component explaining 99.8% of the variance.",
        },
        {
          kind: "p",
          text: "Enrichment analysis pointed to cytoskeleton organisation and actin regulation. In the protein network, β-actin (ACTB) was the central hub, connected to 7 of the 10 proteins analysed.",
        },
      ],
    },
    {
      id: "limitations",
      title: "Limitations",
      blocks: [
        {
          kind: "list",
          items: [
            "Each condition has a single sample. Without biological replicates, statistical differential expression was not possible, so the fold changes describe individual samples only.",
            "The healthy sample had far fewer counts (3.8 million, against 90.7 and 77.2 million), which may contribute to the gap between it and the cancer samples.",
            "DESeq2 normalisation failed, so a manual log transformation was used for visualisation.",
            "The work was entirely computational, with no laboratory validation of the candidate genes.",
          ],
        },
      ],
    },
    {
      id: "significance",
      title: "What I took from it",
      blocks: [
        {
          kind: "p",
          text: "This internship added a different kind of data to my profile: large biological datasets, processed step by step, with a quality check at each stage. It also reinforced the habit I apply across my projects, which is to state clearly what the data can and cannot support.",
        },
      ],
    },
  ],
};
