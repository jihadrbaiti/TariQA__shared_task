/* ==========================================================================
   TariQA site configuration
   --------------------------------------------------------------------------
   Central place for every external link and contact detail shown on the
   site (index.html, guidelines.html, paper.html).  Leave a value empty ("")
   and the corresponding button/link shows a small "soon" badge instead of a
   broken link.  Values starting with http open in a new tab.
   ========================================================================== */
window.SITE_CONFIG = {
  taskName: "TariQA",

  links: {
    register:   "",   // Registration form (e.g. a Google Form)
    github:     "",   // Official GitHub repository: data, baselines, scorer
    codabench:  "",   // Codabench competition page
    slack:      "",   // Slack workspace invite link
    mailing:    "",   // Mailing list / Google Group
    openreview: "",   // OpenReview venue for system-description papers
    sample:     "data/sample_train.csv",        // Public sample of the data format
    sampleSubmission: "data/sample_submission.csv", // Sample predictions file

    workshop:       "https://wp.lancs.ac.uk/abjad/",
    aclStyle:       "https://github.com/acl-org/acl-style-files",
    antiHarassment: "https://www.aclweb.org/adminwiki/index.php?title=Anti-Harassment_Policy"
  },

  organizersCsv: "assets/organizers.csv",   // Source of the organizer cards

  contactEmail: ""   // e.g. "tariqqa.organizers@example.org"
};
