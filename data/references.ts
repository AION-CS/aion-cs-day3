/**
 * Day 3 reference list. Cards cite by key; each `References` accordion shows the union of what its own cards
 * cite. `chip` is the short "Author Year" label a Source chip prints. Every entry is a published work or a statute
 * cited by its usual reference; the bracketed note says what the card takes from it.
 */

export type RefKey =
  | "dick1994"
  | "oliver1999"
  | "gustafsson2005"
  | "morgan1994"
  | "mayer1995"
  | "kahneman2011"
  | "zajonc1980"
  | "webster1972"
  | "bauer1960"
  | "kahneman1979"
  | "tversky1992"
  | "cialdini2021"
  | "gouldner1960"
  | "samuelson1988"
  | "gartner2017"
  | "iyengar2000"
  | "nisbett1977"
  | "brehm1966"
  | "uwg5"
  | "thaler2008"
  | "meadows1999"
  | "knight1921"
  | "klein2007"
  | "loomes1982"
  | "kaplan1992"
  | "doran1981"
  | "deming1986";

export type Reference = { key: RefKey; chip: string; full: string };

export const REFERENCES: Record<RefKey, Reference> = {
  dick1994: {
    key: "dick1994",
    chip: "Dick & Basu 1994",
    full: "Dick, A. S., & Basu, K. (1994). Customer loyalty: Toward an integrated conceptual framework. Journal of the Academy of Marketing Science, 22(2), 99–113. (Loyalty needs both a favourable attitude and repeat behaviour.)",
  },
  oliver1999: {
    key: "oliver1999",
    chip: "Oliver 1999",
    full: "Oliver, R. L. (1999). Whence consumer loyalty? Journal of Marketing, 63(Special Issue), 33–44. (Loyalty as a commitment to rebuy that survives situational pressure and competing offers.)",
  },
  gustafsson2005: {
    key: "gustafsson2005",
    chip: "Gustafsson, Johnson & Roos 2005",
    full: "Gustafsson, A., Johnson, M. D., & Roos, I. (2005). The effects of customer satisfaction, relationship commitment dimensions, and triggers on customer retention. Journal of Marketing, 69(4), 210–218. (Separates affective from calculative commitment.)",
  },
  morgan1994: {
    key: "morgan1994",
    chip: "Morgan & Hunt 1994",
    full: "Morgan, R. M., & Hunt, S. D. (1994). The commitment-trust theory of relationship marketing. Journal of Marketing, 58(3), 20–38. (Trust and commitment as the two roots of a lasting exchange relationship.)",
  },
  mayer1995: {
    key: "mayer1995",
    chip: "Mayer, Davis & Schoorman 1995",
    full: "Mayer, R. C., Davis, J. H., & Schoorman, F. D. (1995). An integrative model of organizational trust. Academy of Management Review, 20(3), 709–734. (Trust rests on ability, benevolence and integrity.)",
  },
  kahneman2011: {
    key: "kahneman2011",
    chip: "Kahneman 2011",
    full: "Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux. (A fast, automatic, feeling-led way of judging and a slow, deliberate one.)",
  },
  zajonc1980: {
    key: "zajonc1980",
    chip: "Zajonc 1980",
    full: "Zajonc, R. B. (1980). Feeling and thinking: Preferences need no inferences. American Psychologist, 35(2), 151–175. (Affective reactions can come first and do not need a reasoned basis.)",
  },
  webster1972: {
    key: "webster1972",
    chip: "Webster & Wind 1972",
    full: "Webster, F. E., & Wind, Y. (1972). A general model for understanding organizational buying behavior. Journal of Marketing, 36(2), 12–19. (Organisational buying is made by people in a buying centre, with individual as well as organisational motives.)",
  },
  bauer1960: {
    key: "bauer1960",
    chip: "Bauer 1960",
    full: "Bauer, R. A. (1960). Consumer behavior as risk taking. In R. S. Hancock (Ed.), Dynamic Marketing for a Changing World (pp. 389–398). American Marketing Association. (Perceived risk.)",
  },
  kahneman1979: {
    key: "kahneman1979",
    chip: "Kahneman & Tversky 1979",
    full: "Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. Econometrica, 47(2), 263–291. (Loss aversion.)",
  },
  tversky1992: {
    key: "tversky1992",
    chip: "Tversky & Kahneman 1992",
    full: "Tversky, A., & Kahneman, D. (1992). Advances in prospect theory: Cumulative representation of uncertainty. Journal of Risk and Uncertainty, 5(4), 297–323. (A loss weight of about 2.25 estimated in experiments; the case uses 2.)",
  },
  cialdini2021: {
    key: "cialdini2021",
    chip: "Cialdini 2021",
    full: "Cialdini, R. B. (2021). Influence, New and Expanded: The Psychology of Persuasion. Harper Business. (Reciprocity and social proof among the principles of influence.)",
  },
  gouldner1960: {
    key: "gouldner1960",
    chip: "Gouldner 1960",
    full: "Gouldner, A. W. (1960). The norm of reciprocity: A preliminary statement. American Sociological Review, 25(2), 161–178.",
  },
  samuelson1988: {
    key: "samuelson1988",
    chip: "Samuelson & Zeckhauser 1988",
    full: "Samuelson, W., & Zeckhauser, R. (1988). Status quo bias in decision making. Journal of Risk and Uncertainty, 1(1), 7–59.",
  },
  gartner2017: {
    key: "gartner2017",
    chip: "Gartner 2017",
    full: "Gartner (2017). Digital B2B Buyer Survey (n = 750), as reported in Gartner buyer-enablement materials. (The median buying group for a complex solution has 6–10 decision makers.)",
  },
  iyengar2000: {
    key: "iyengar2000",
    chip: "Iyengar & Lepper 2000",
    full: "Iyengar, S. S., & Lepper, M. R. (2000). When choice is demotivating: Can one desire too much of a good thing? Journal of Personality and Social Psychology, 79(6), 995–1006. (More options lowered the chance that people chose at all.)",
  },
  nisbett1977: {
    key: "nisbett1977",
    chip: "Nisbett & Wilson 1977",
    full: "Nisbett, R. E., & Wilson, T. D. (1977). Telling more than we can know: Verbal reports on mental processes. Psychological Review, 84(3), 231–259. (People's stated reasons often do not match what moved them.)",
  },
  brehm1966: {
    key: "brehm1966",
    chip: "Brehm 1966",
    full: "Brehm, J. W. (1966). A Theory of Psychological Reactance. Academic Press. (A pressure to choose can lead people to resist it.)",
  },
  uwg5: {
    key: "uwg5",
    chip: "§ 5 UWG",
    full: "§ 5 UWG (Gesetz gegen den unlauteren Wettbewerb): a commercial practice is misleading if it contains untrue statements or other information that is likely to mislead a market participant into a decision it would not otherwise take.",
  },
  thaler2008: {
    key: "thaler2008",
    chip: "Thaler & Sunstein 2008",
    full: "Thaler, R. H., & Sunstein, C. R. (2008). Nudge: Improving Decisions About Health, Wealth, and Happiness. Yale University Press. (Choice architecture: how the way options are presented shapes what people choose; defaults and simplification.)",
  },
  meadows1999: {
    key: "meadows1999",
    chip: "Meadows 1999",
    full: "Meadows, D. (1999). Leverage Points: Places to Intervene in a System. The Sustainability Institute. (Changing rules and structures moves a system more than changing a single parameter.)",
  },
  knight1921: {
    key: "knight1921",
    chip: "Knight 1921",
    full: "Knight, F. H. (1921). Risk, Uncertainty and Profit. Houghton Mifflin. (Risk is measurable odds; uncertainty is not.)",
  },
  klein2007: {
    key: "klein2007",
    chip: "Klein 2007",
    full: "Klein, G. (2007). Performing a project premortem. Harvard Business Review, 85(9), 18–19. (Imagine the plan has failed and write down why, before it starts.)",
  },
  loomes1982: {
    key: "loomes1982",
    chip: "Loomes & Sugden 1982",
    full: "Loomes, G., & Sugden, R. (1982). Regret theory: An alternative theory of rational choice under uncertainty. Economic Journal, 92(368), 805–824. (Choosing to keep the largest regret small.)",
  },
  kaplan1992: {
    key: "kaplan1992",
    chip: "Kaplan & Norton 1992",
    full: "Kaplan, R. S., & Norton, D. P. (1992). The balanced scorecard: Measures that drive performance. Harvard Business Review, 70(1), 71–79. (Objectives, measures, targets and initiatives kept in one line of sight.)",
  },
  doran1981: {
    key: "doran1981",
    chip: "Doran 1981",
    full: "Doran, G. T. (1981). There's a S.M.A.R.T. way to write management's goals and objectives. Management Review, 70(11), 35–36. (Specific, measurable, assignable, realistic, time-related.)",
  },
  deming1986: {
    key: "deming1986",
    chip: "Deming 1986",
    full: "Deming, W. E. (1986). Out of the Crisis. MIT Center for Advanced Engineering Study. (Plan, do, study, act: a measured cycle instead of a one-off fix.)",
  },
};

export const refFull = (key: RefKey) => REFERENCES[key].full;

/** Print order of the accordion. */
export const REFERENCE_ORDER: RefKey[] = Object.keys(REFERENCES) as RefKey[];
