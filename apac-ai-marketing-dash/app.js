/* =============================================================================
 * Marketing & AI in APAC: how marketing teams use Claude
 * Anthropic Economic Index (Apr–May 2026). Data: CC-BY.
 *
 * Readable source, reconstructed from the deployed esbuild bundle.
 * Stack: React 18.3.1 + ReactDOM + Recharts, all vendored (no CDN at runtime).
 * No JSX: uses an h() alias for React.createElement (same convention as the
 * EU dashboard) so both dashboards are maintained the same way.
 * ========================================================================== */
(function () {
  "use strict";

  var React = window.React;
  var ReactDOM = window.ReactDOM;
  var Recharts = window.Recharts;
  var h = React.createElement;

  /* --- Small viewport hook: drives the mobile scatter -> dot-plot swap ------ */
  function useIsNarrow(maxWidth) {
    var mq = "(max-width: " + (maxWidth || 640) + "px)";
    var get = function () {
      return (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia(mq).matches
      );
    };
    var pair = React.useState(get());
    var narrow = pair[0],
      setNarrow = pair[1];
    React.useEffect(
      function () {
        if (!window.matchMedia) return;
        var m = window.matchMedia(mq);
        var on = function () {
          setNarrow(m.matches);
        };
        on();
        if (m.addEventListener) m.addEventListener("change", on);
        else m.addListener(on);
        return function () {
          if (m.removeEventListener) m.removeEventListener("change", on);
          else m.removeListener(on);
        };
      },
      [mq],
    );
    return narrow;
  }

  var DATA = {
    countries: [
      {
        id: "GLOBAL",
        name: "Global",
        usageIdx: 1,
        usageIdxApr: 1,
        usagePct: 100,
        contentMay: 22.72,
        contentApr: 21.59,
        salesOps: 1.1,
        mktgArtifact: 2.6,
        emailArtifact: 4.61,
        work: 43.36,
        coursework: 16.45,
        automation: 48.62,
        promoWriting: 4.09,
        mktgOccSum: 2.4,
      },
      {
        id: "AUS",
        name: "Australia",
        usageIdx: 6.4,
        usageIdxApr: 5.83,
        usagePct: 2.65,
        contentMay: 23.53,
        contentApr: 22.25,
        salesOps: 1.12,
        mktgArtifact: 2.56,
        emailArtifact: 6.09,
        work: 42.67,
        coursework: 20.69,
        automation: 45.5,
        promoWriting: 4.36,
        mktgOccSum: 2.39,
      },
      {
        id: "NZL",
        name: "New Zealand",
        usageIdx: 4.84,
        usageIdxApr: 4.37,
        usagePct: 0.39,
        contentMay: 23.26,
        contentApr: 21.5,
        salesOps: 0.97,
        mktgArtifact: 2.43,
        emailArtifact: 5.94,
        work: 43.16,
        coursework: 19.57,
        automation: 46.33,
        promoWriting: 4.28,
        mktgOccSum: 2.35,
      },
      {
        id: "JPN",
        name: "Japan",
        usageIdx: 1.91,
        usageIdxApr: 1.97,
        usagePct: 3.28,
        contentMay: 22.07,
        contentApr: 21.74,
        salesOps: 0.71,
        mktgArtifact: 2.69,
        emailArtifact: 4.42,
        work: 47,
        coursework: 5.85,
        automation: 47.45,
        promoWriting: 5.04,
        mktgOccSum: 2.26,
      },
      {
        id: "KOR",
        name: "South Korea",
        usageIdx: 3.78,
        usageIdxApr: 3.92,
        usagePct: 3.24,
        contentMay: 27.3,
        contentApr: 26.04,
        salesOps: 0.25,
        mktgArtifact: 1.76,
        emailArtifact: 3,
        work: 47.24,
        coursework: 14.9,
        automation: 43.76,
        promoWriting: 3.48,
        mktgOccSum: 2.02,
      },
      {
        id: "TWN",
        name: "Taiwan",
        usageIdx: 2.08,
        usageIdxApr: 2.12,
        usagePct: 0.79,
        contentMay: 19.78,
        contentApr: 19.61,
        salesOps: 0.46,
        mktgArtifact: 1.95,
        emailArtifact: 2.6,
        work: 47.06,
        coursework: 12.04,
        automation: 49.66,
        promoWriting: 2.97,
        mktgOccSum: 1.89,
      },
      {
        id: "SGP",
        name: "Singapore",
        usageIdx: 5.81,
        usageIdxApr: 6.44,
        usagePct: 0.62,
        contentMay: 20.56,
        contentApr: 20.05,
        salesOps: 1.17,
        mktgArtifact: 2.03,
        emailArtifact: 5.36,
        work: 46.75,
        coursework: 10.97,
        automation: 46.3,
        promoWriting: 3.37,
        mktgOccSum: 2.25,
      },
      {
        id: "MYS",
        name: "Malaysia",
        usageIdx: 0.87,
        usageIdxApr: 0.8,
        usagePct: 0.51,
        contentMay: 24.3,
        contentApr: 22.97,
        salesOps: 0.85,
        mktgArtifact: 3.18,
        emailArtifact: 4.27,
        work: 46.28,
        coursework: 19.82,
        automation: 47.2,
        promoWriting: 4.36,
        mktgOccSum: 3.04,
      },
      {
        id: "THA",
        name: "Thailand",
        usageIdx: 0.73,
        usageIdxApr: 0.59,
        usagePct: 0.86,
        contentMay: 20.15,
        contentApr: 20.38,
        salesOps: 0.76,
        mktgArtifact: 2.6,
        emailArtifact: 2.94,
        work: 53.12,
        coursework: 9.84,
        automation: 52.54,
        promoWriting: 3.88,
        mktgOccSum: 2.72,
      },
      {
        id: "VNM",
        name: "Vietnam",
        usageIdx: 0.53,
        usageIdxApr: 0.43,
        usagePct: 0.85,
        contentMay: 24.91,
        contentApr: 24.13,
        salesOps: 0.68,
        mktgArtifact: 3.02,
        emailArtifact: 2.37,
        work: 53.13,
        coursework: 20.38,
        automation: 51.38,
        promoWriting: 4.82,
        mktgOccSum: 2.67,
      },
      {
        id: "IDN",
        name: "Indonesia",
        usageIdx: 0.46,
        usageIdxApr: 0.37,
        usagePct: 2.08,
        contentMay: 32.06,
        contentApr: 28.78,
        salesOps: 0.34,
        mktgArtifact: 2.19,
        emailArtifact: 1.75,
        work: 29.41,
        coursework: 45.88,
        automation: 47.51,
        promoWriting: 2.93,
        mktgOccSum: 2.28,
      },
      {
        id: "PHL",
        name: "Philippines",
        usageIdx: 0.44,
        usageIdxApr: 0.41,
        usagePct: 0.8,
        contentMay: 28.82,
        contentApr: 27.43,
        salesOps: 1.04,
        mktgArtifact: 4.37,
        emailArtifact: 6.34,
        work: 45.01,
        coursework: 23.09,
        automation: 49.17,
        promoWriting: 6.38,
        mktgOccSum: 2.98,
      },
      {
        id: "IND",
        name: "India",
        usageIdx: 0.3,
        usageIdxApr: 0.31,
        usagePct: 7.12,
        contentMay: 22.11,
        contentApr: 22.15,
        salesOps: 0.98,
        mktgArtifact: 3.08,
        emailArtifact: 3.19,
        work: 44.14,
        coursework: 19.95,
        automation: 51.87,
        promoWriting: 4.56,
        mktgOccSum: 2.75,
      },
      {
        id: "PAK",
        name: "Pakistan",
        usageIdx: 0.31,
        usageIdxApr: 0.29,
        usagePct: 1.08,
        contentMay: 28.75,
        contentApr: 27.49,
        salesOps: 1.4,
        mktgArtifact: 4.89,
        emailArtifact: 3.68,
        work: 40.32,
        coursework: 29.74,
        automation: 50.69,
        promoWriting: 7.49,
        mktgOccSum: 3.28,
      },
      {
        id: "BGD",
        name: "Bangladesh",
        usageIdx: 0.11,
        usageIdxApr: 0.11,
        usagePct: 0.31,
        contentMay: 24.65,
        contentApr: 24.42,
        salesOps: 0.78,
        mktgArtifact: 4.07,
        emailArtifact: 2.53,
        work: 36.45,
        coursework: 27.07,
        automation: 50.75,
        promoWriting: 5.67,
        mktgOccSum: 2.76,
      },
      {
        id: "LKA",
        name: "Sri Lanka",
        usageIdx: 0.56,
        usageIdxApr: 0.48,
        usagePct: 0.19,
        contentMay: 24.48,
        contentApr: 25.23,
        salesOps: 0.52,
        mktgArtifact: 2.78,
        emailArtifact: 3.03,
        work: 38.98,
        coursework: 34.98,
        automation: 52.19,
        promoWriting: 3.92,
        mktgOccSum: 2,
      },
      {
        id: "KHM",
        name: "Cambodia",
        usageIdx: 0.21,
        usageIdxApr: 0.18,
        usagePct: 0.06,
        contentMay: 19.7,
        contentApr: 19.1,
        salesOps: null,
        mktgArtifact: 2.56,
        emailArtifact: 3.26,
        work: 45.64,
        coursework: 19.67,
        automation: 52.29,
        promoWriting: 3.63,
        mktgOccSum: 1.47,
      },
      {
        id: "NPL",
        name: "Nepal",
        usageIdx: 0.41,
        usageIdxApr: 0.37,
        usagePct: 0.19,
        contentMay: 23.37,
        contentApr: 20.01,
        salesOps: null,
        mktgArtifact: 2.54,
        emailArtifact: 1.81,
        work: 34.07,
        coursework: 31.95,
        automation: 51.27,
        promoWriting: 3.51,
        mktgOccSum: 2.12,
      },
      {
        id: "MNG",
        name: "Mongolia",
        usageIdx: 1.37,
        usageIdxApr: 0.93,
        usagePct: 0.07,
        contentMay: 21.34,
        contentApr: 23.31,
        salesOps: null,
        mktgArtifact: 1.44,
        emailArtifact: 1.85,
        work: 32.84,
        coursework: 34.11,
        automation: 57.44,
        promoWriting: 1.68,
        mktgOccSum: 1.02,
      },
    ],
    occupations: [
      {
        name: "Search / SEM",
        full: "Search Marketing Strategists",
        pct: 0.36,
        automation: 54.68,
        autonomy: 3.01,
        humanHrs: 9.85,
        aiMin: 38.98,
        directive: 35.21,
        iteration: 37.73,
        feedback: 15.78,
        learning: 3.87,
        validation: 0.66,
      },
      {
        name: "Market Research",
        full: "Market Research Analysts & Marketing Specialists",
        pct: 0.21,
        automation: 45.63,
        autonomy: 3.01,
        humanHrs: 9.4,
        aiMin: 40.27,
        directive: 38.05,
        iteration: 36.85,
        feedback: 6.95,
        learning: 13.52,
        validation: 3.24,
      },
      {
        name: "PR Specialists",
        full: "Public Relations Specialists",
        pct: 0.33,
        automation: 38.85,
        autonomy: 2.87,
        humanHrs: 5.37,
        aiMin: 41.43,
        directive: 31.09,
        iteration: 54.93,
        feedback: 7.33,
        learning: 4.04,
        validation: 1.52,
      },
      {
        name: "Marketing Managers",
        full: "Marketing Managers",
        pct: 0.53,
        automation: 38.42,
        autonomy: 2.94,
        humanHrs: 9.38,
        aiMin: 58.02,
        directive: 27.78,
        iteration: 48,
        feedback: 10.2,
        learning: 10.68,
        validation: 2.18,
      },
      {
        name: "PR Managers",
        full: "Public Relations Managers",
        pct: 0.17,
        automation: 32.26,
        autonomy: 3.05,
        humanHrs: 8.84,
        aiMin: 53.85,
        directive: 24.8,
        iteration: 64.1,
        feedback: 7.22,
        learning: 2.03,
        validation: 1.11,
      },
      {
        name: "Ad Sales",
        full: "Advertising Sales Agents",
        pct: 0.13,
        automation: 31.72,
        autonomy: 2.73,
        humanHrs: 6.12,
        aiMin: 56.09,
        directive: 23.51,
        iteration: 64.25,
        feedback: 7.95,
        learning: 2.49,
        validation: 0.97,
      },
      {
        name: "Advertising & Promotions",
        full: "Advertising & Promotions Managers",
        pct: 0.67,
        automation: 32.7,
        autonomy: 2.85,
        humanHrs: 6.88,
        aiMin: 49.82,
        directive: 25.7,
        iteration: 64.93,
        feedback: 6.84,
        learning: 1.22,
        validation: 0.82,
      },
      {
        name: "Graphic Designers",
        full: "Graphic Designers",
        pct: 1.07,
        automation: 29.63,
        autonomy: 2.6,
        humanHrs: 3.68,
        aiMin: 36.55,
        directive: 26.04,
        iteration: 66.14,
        feedback: 3.39,
        learning: 1.98,
        validation: 1.79,
      },
      {
        name: "Writers & Authors",
        full: "Writers & Authors",
        pct: 2.22,
        automation: 28.54,
        autonomy: 2.62,
        humanHrs: 5.17,
        aiMin: 46.04,
        directive: 25.97,
        iteration: 67.66,
        feedback: 2.41,
        learning: 1.01,
        validation: 2.39,
      },
    ],
    topics: [
      { name: "Post copywriting", may: 1.5, apr: 1.4 },
      { name: "Marketing copy", may: 1.22, apr: 1.22 },
      { name: "SEO copywriting", may: 0.43, apr: 0.42 },
      { name: "Market research reports", may: 0.4, apr: 0.4 },
      { name: "Social media graphics", may: 0.23, apr: 0.2 },
      { name: "Go-to-market", may: 0.18, apr: 0.18 },
      { name: "Marketing technology", may: 0.17, apr: 0.2 },
      { name: "Marketing intelligence", may: 0.15, apr: 0.15 },
      { name: "Lead list building", may: 0.15, apr: 0.16 },
      { name: "Campaign briefs", may: 0.13, apr: 0.14 },
      { name: "SEO strategy", may: 0.07, apr: 0.07 },
      { name: "Social media analytics", may: 0.07, apr: 0.07 },
      { name: "Ad campaign optimization", may: 0.05, apr: 0.04 },
      { name: "Real estate marketing", may: 0.07, apr: 0.06 },
      { name: "Event promotion", may: 0.05, apr: 0.05 },
      { name: "Lead qualification", may: 0.06, apr: 0.07 },
    ],
    auStates: [
      {
        id: "AU-NSW",
        name: "New South Wales",
        usage: 37.98,
        content: 23.37,
        promo: 4.28,
      },
      {
        id: "AU-VIC",
        name: "Victoria",
        usage: 30.9,
        content: 23.4,
        promo: 4.1,
      },
      {
        id: "AU-QLD",
        name: "Queensland",
        usage: 16.61,
        content: 24.57,
        promo: 5.38,
      },
      {
        id: "AU-WA",
        name: "Western Australia",
        usage: 7.76,
        content: 22.7,
        promo: 4.41,
      },
      {
        id: "AU-SA",
        name: "South Australia",
        usage: 4.63,
        content: 23.96,
        promo: 3.81,
      },
      { id: "AU-ACT", name: "ACT", usage: 1.51, content: 21.28, promo: 2.32 },
      {
        id: "AU-TAS",
        name: "Tasmania",
        usage: 0.5,
        content: 23.49,
        promo: 3.85,
      },
    ],
  };

  /* --- Palette (semantic colour tokens) ------------------------------------ */
  var C = {
    paper: "#F2F4F8",
    panel: "#FFFFFF",
    ink: "#0F1D30",
    muted: "#5C6A7D",
    line: "#E1E6EE",
    faint: "#EDF0F5",
    ultra: "#3D5BF5",
    magenta: "#E23D7B",
    amber: "#EFA028",
    teal: "#17A88B",
    ultraSoft: "#EBEFFE",
    magentaSoft: "#FCEBF2",
    ambSoft: "#FDF3E3",
    tealSoft: "#E4F5F1",
  };

  /* --- Cluster classification ---------------------------------------------- */
  var clusterOf = function (d) {
    return d.usageIdx >= 1.5
      ? "Established"
      : d.usageIdx >= 0.5
        ? "Rising"
        : "Emerging";
  };
  var CLUSTER_COLOR = {
    Established: C.ultra,
    Rising: C.amber,
    Emerging: C.magenta,
  };
  var CLUSTER_SOFT = {
    Established: C.ultraSoft,
    Rising: C.ambSoft,
    Emerging: C.magentaSoft,
  };

  /* --- star(): builds SVG star/burst points (used by the flag drawings) ---- */
  var star = function (cx, cy, outer, inner, points, rot) {
    if (rot == null) rot = -Math.PI / 2;
    var pts = [];
    for (var i = 0; i < points * 2; i++) {
      var r = i % 2 === 0 ? outer : inner;
      var a = rot + (Math.PI * i) / points;
      pts.push(
        (cx + r * Math.cos(a)).toFixed(2) +
          "," +
          (cy + r * Math.sin(a)).toFixed(2),
      );
    }
    return pts.join(" ");
  };

  /* --- Flag colour tokens -------------------------------------------------- */
  var FC = {
    red: "#D80027",
    blue: "#0052B4",
    white: "#F0F0F0",
    yellow: "#FFDA44",
    green: "#6DA544",
    dgreen: "#496E2D",
    orange: "#FF9811",
    maroon: "#A2001D",
    ink: "#333333",
  };

  /* --- UnionJack: shared canton used by AUS & NZL flags ------------------- */
  var UnionJack = function () {
    return h(
      "g",
      null,
      h("rect", { width: "20", height: "20", fill: FC.blue }),
      h("path", {
        d: "M0,0 L20,20 M20,0 L0,20",
        stroke: FC.white,
        strokeWidth: "5",
      }),
      h("path", {
        d: "M0,0 L20,20 M20,0 L0,20",
        stroke: FC.red,
        strokeWidth: "2",
      }),
      h("path", {
        d: "M10,0 V20 M0,10 H20",
        stroke: FC.white,
        strokeWidth: "6",
      }),
      h("path", { d: "M10,0 V20 M0,10 H20", stroke: FC.red, strokeWidth: "3" }),
    );
  };

  /* --- FLAGS: hand-drawn 40x40 SVG flag for each market ------------------- */
  var FLAGS = {
    AUS: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.blue,
      }),
      h(UnionJack, null),
      h("polygon", {
        points: star(10, 30, 4, 1.7, 7),
        fill: FC.white,
      }),
      h("polygon", {
        points: star(28, 7.5, 2.4, 1, 7),
        fill: FC.white,
      }),
      h("polygon", {
        points: star(34.5, 15, 2.4, 1, 7),
        fill: FC.white,
      }),
      h("polygon", {
        points: star(25.5, 17, 1.5, 0.7, 5),
        fill: FC.white,
      }),
      h("polygon", {
        points: star(30, 24, 2.4, 1, 7),
        fill: FC.white,
      }),
      h("polygon", {
        points: star(33, 31, 2.4, 1, 7),
        fill: FC.white,
      }),
    ),
    NZL: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.blue,
      }),
      h(UnionJack, null),
      [
        [29, 8],
        [25, 16],
        [34, 17],
        [29.5, 27],
      ].map(([n, r], o) =>
        h("polygon", {
          key: o,
          points: star(n, r, 2.7, 1.1, 5),
          fill: FC.red,
          stroke: FC.white,
          strokeWidth: "0.9",
        }),
      ),
    ),
    JPN: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.white,
      }),
      h("circle", {
        cx: "20",
        cy: "20",
        r: "8.5",
        fill: FC.red,
      }),
    ),
    KOR: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.white,
      }),
      h(
        "g",
        { transform: "rotate(-30 20 20)" },
        h("path", {
          d: "M13,20 a7,7 0 0 1 14,0 z",
          fill: FC.red,
        }),
        h("path", {
          d: "M13,20 a7,7 0 0 0 14,0 z",
          fill: FC.blue,
        }),
        h("circle", {
          cx: "16.5",
          cy: "20",
          r: "3.5",
          fill: FC.red,
        }),
        h("circle", {
          cx: "23.5",
          cy: "20",
          r: "3.5",
          fill: FC.blue,
        }),
      ),
      h(
        "g",
        { fill: FC.ink },
        [
          [8, 8, -45],
          [32, 8, 45],
          [8, 32, 45],
          [32, 32, -45],
        ].map(([n, r, o], d) =>
          h(
            "g",
            { key: d, transform: `translate(${n} ${r}) rotate(${o})` },
            h("rect", {
              x: "-3.6",
              y: "-3.4",
              width: "7.2",
              height: "1.5",
            }),
            h("rect", {
              x: "-3.6",
              y: "-0.75",
              width: "7.2",
              height: "1.5",
            }),
            h("rect", {
              x: "-3.6",
              y: "1.9",
              width: "7.2",
              height: "1.5",
            }),
          ),
        ),
      ),
    ),
    TWN: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.red,
      }),
      h("rect", {
        width: "20",
        height: "20",
        fill: FC.blue,
      }),
      h("polygon", {
        points: star(10, 10, 7, 5, 12),
        fill: FC.white,
      }),
      h("circle", {
        cx: "10",
        cy: "10",
        r: "3.8",
        fill: FC.white,
      }),
      h("circle", {
        cx: "10",
        cy: "10",
        r: "3",
        fill: FC.blue,
      }),
      h("circle", {
        cx: "10",
        cy: "10",
        r: "2.3",
        fill: FC.white,
      }),
    ),
    SGP: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.white,
      }),
      h("rect", {
        width: "40",
        height: "20",
        fill: FC.red,
      }),
      h("circle", {
        cx: "12.5",
        cy: "10",
        r: "6",
        fill: FC.white,
      }),
      h("circle", {
        cx: "15",
        cy: "10",
        r: "5",
        fill: FC.red,
      }),
      [
        [21.5, 6],
        [25.6, 9.1],
        [24, 14.1],
        [19, 14.1],
        [17.4, 9.1],
      ].map(([n, r], o) =>
        h("polygon", {
          key: o,
          points: star(n, r, 1.4, 0.6, 5),
          fill: FC.white,
        }),
      ),
    ),
    MYS: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.white,
      }),
      [0, 2, 4, 6, 8, 10, 12].map((n) =>
        h("rect", {
          key: n,
          y: n * 2.857,
          width: "40",
          height: "2.857",
          fill: FC.red,
        }),
      ),
      h("rect", {
        width: "22",
        height: "22.9",
        fill: FC.blue,
      }),
      h("circle", {
        cx: "9.5",
        cy: "11.4",
        r: "6",
        fill: FC.yellow,
      }),
      h("circle", {
        cx: "11.8",
        cy: "11.4",
        r: "5",
        fill: FC.blue,
      }),
      h("polygon", {
        points: star(16.2, 11.4, 4.4, 1.8, 9),
        fill: FC.yellow,
      }),
    ),
    THA: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.red,
      }),
      h("rect", {
        y: "6.7",
        width: "40",
        height: "26.6",
        fill: FC.white,
      }),
      h("rect", {
        y: "13.3",
        width: "40",
        height: "13.4",
        fill: FC.blue,
      }),
    ),
    VNM: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.red,
      }),
      h("polygon", {
        points: star(20, 20, 9, 3.6, 5),
        fill: FC.yellow,
      }),
    ),
    IDN: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.white,
      }),
      h("rect", {
        width: "40",
        height: "20",
        fill: FC.red,
      }),
    ),
    PHL: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "20",
        fill: FC.blue,
      }),
      h("rect", {
        y: "20",
        width: "40",
        height: "20",
        fill: FC.red,
      }),
      h("polygon", {
        points: "0,0 18,20 0,40",
        fill: FC.white,
      }),
      h("polygon", {
        points: star(6.5, 20, 3.4, 1.4, 8),
        fill: FC.yellow,
      }),
      [
        [3, 4.5],
        [3, 35.5],
        [13.5, 20],
      ].map(([n, r], o) =>
        h("polygon", {
          key: o,
          points: star(n, r, 1.4, 0.6, 5),
          fill: FC.yellow,
        }),
      ),
    ),
    IND: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.green,
      }),
      h("rect", {
        width: "40",
        height: "26.6",
        fill: FC.white,
      }),
      h("rect", {
        width: "40",
        height: "13.3",
        fill: FC.orange,
      }),
      h("circle", {
        cx: "20",
        cy: "20",
        r: "4.4",
        fill: "none",
        stroke: FC.blue,
        strokeWidth: "1.1",
      }),
      h("circle", {
        cx: "20",
        cy: "20",
        r: "0.9",
        fill: FC.blue,
      }),
      [0, 30, 60, 90, 120, 150].map((n) =>
        h("line", {
          key: n,
          x1: "20",
          y1: "15.6",
          x2: "20",
          y2: "24.4",
          stroke: FC.blue,
          strokeWidth: "0.5",
          transform: `rotate(${n} 20 20)`,
        }),
      ),
    ),
    PAK: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.dgreen,
      }),
      h("rect", {
        width: "10",
        height: "40",
        fill: FC.white,
      }),
      h("circle", {
        cx: "24",
        cy: "21",
        r: "7.5",
        fill: FC.white,
      }),
      h("circle", {
        cx: "26.6",
        cy: "18.4",
        r: "6.4",
        fill: FC.dgreen,
      }),
      h("polygon", {
        points: star(29.5, 12.5, 2.7, 1.1, 5, -1),
        fill: FC.white,
      }),
    ),
    BGD: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.dgreen,
      }),
      h("circle", {
        cx: "17",
        cy: "20",
        r: "9",
        fill: FC.red,
      }),
    ),
    LKA: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.yellow,
      }),
      h("rect", {
        x: "3.5",
        y: "7",
        width: "6",
        height: "26",
        fill: FC.green,
      }),
      h("rect", {
        x: "9.5",
        y: "7",
        width: "6",
        height: "26",
        fill: FC.orange,
      }),
      h("rect", {
        x: "18",
        y: "7",
        width: "19",
        height: "26",
        fill: FC.maroon,
      }),
      h("path", {
        d: "M23,26 q2.5,-8 7.5,-8 q4,0.5 3.5,5 l-0.5,5 q-6,2.5 -10.5,-2z",
        fill: FC.yellow,
      }),
      [
        [20.8, 9.8],
        [34.2, 9.8],
        [20.8, 30.2],
        [34.2, 30.2],
      ].map(([n, r], o) =>
        h("circle", {
          key: o,
          cx: n,
          cy: r,
          r: "1.3",
          fill: FC.yellow,
        }),
      ),
    ),
    KHM: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.blue,
      }),
      h("rect", {
        y: "10",
        width: "40",
        height: "20",
        fill: FC.red,
      }),
      h(
        "g",
        { fill: FC.white },
        h("polygon", {
          points: "20,12.5 23,16.5 17,16.5",
        }),
        h("rect", {
          x: "18.3",
          y: "15.5",
          width: "3.4",
          height: "7",
        }),
        h("polygon", {
          points: "14.6,15 16.6,18 12.6,18",
        }),
        h("rect", {
          x: "13.2",
          y: "17.5",
          width: "2.8",
          height: "5",
        }),
        h("polygon", {
          points: "25.4,15 27.4,18 23.4,18",
        }),
        h("rect", {
          x: "24",
          y: "17.5",
          width: "2.8",
          height: "5",
        }),
        h("rect", {
          x: "11.5",
          y: "22.5",
          width: "17",
          height: "1.8",
        }),
      ),
    ),
    NPL: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.white,
      }),
      h("polygon", {
        points: "12,4.5 28.5,15 17.6,15 32,26.5 12,26.5",
        fill: FC.maroon,
        stroke: FC.blue,
        strokeWidth: "1.7",
        strokeLinejoin: "round",
      }),
      h("circle", {
        cx: "17",
        cy: "11",
        r: "1.9",
        fill: FC.white,
      }),
      h("circle", {
        cx: "17",
        cy: "9.7",
        r: "1.9",
        fill: FC.maroon,
      }),
      h("polygon", {
        points: star(18.5, 21.5, 2.5, 1.3, 12),
        fill: FC.white,
      }),
    ),
    MNG: h(
      "g",
      null,
      h("rect", {
        width: "40",
        height: "40",
        fill: FC.red,
      }),
      h("rect", {
        x: "13.3",
        width: "13.4",
        height: "40",
        fill: FC.blue,
      }),
      h(
        "g",
        { fill: FC.yellow },
        h("polygon", { points: "6.7,9.5 8.4,13 5,13" }),
        h("circle", {
          cx: "6.7",
          cy: "14.8",
          r: "1.6",
        }),
        h("rect", {
          x: "3.9",
          y: "17.2",
          width: "5.6",
          height: "1.2",
        }),
        h("polygon", {
          points: "4.4,19.2 9,19.2 6.7,22",
        }),
        h("rect", {
          x: "3.9",
          y: "22.8",
          width: "5.6",
          height: "4.6",
        }),
        h("rect", {
          x: "3.9",
          y: "28.2",
          width: "5.6",
          height: "1.2",
        }),
        h("rect", {
          x: "1.9",
          y: "9.5",
          width: "1.2",
          height: "20",
        }),
        h("rect", {
          x: "10.3",
          y: "9.5",
          width: "1.2",
          height: "20",
        }),
      ),
    ),
  };

  /* --- CircleFlag: clips a flag into a circle at any size ----------------- */
  function CircleFlag(props) {
    var id = props.id,
      size = props.size || 16;
    var clip = "fc" + React.useId().replace(/[:]/g, "");
    return h(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 40 40",
        "aria-hidden": true,
        style: { flexShrink: 0 },
      },
      h(
        "defs",
        null,
        h(
          "clipPath",
          { id: clip },
          h("circle", { cx: "20", cy: "20", r: "20" }),
        ),
      ),
      h(
        "g",
        { clipPath: "url(#" + clip + ")" },
        FLAGS[id] || h("rect", { width: "40", height: "40", fill: "#C9D1DC" }),
      ),
    );
  }

  /* --- Derived data + formatters ------------------------------------------- */
  var fmt = function (n, dp) {
    return n == null ? "n/a" : n.toFixed(dp == null ? 1 : dp);
  };
  var GLOBAL = DATA.countries.find(function (d) {
    return d.id === "GLOBAL";
  });
  var MARKETS = DATA.countries.filter(function (d) {
    return d.id !== "GLOBAL";
  });

  /* --- Eyebrow: small mono uppercase kicker -------------------------------- */
  var Eyebrow = function (props) {
    return h(
      "div",
      {
        style: {
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: props.color || C.muted,
          fontWeight: 500,
        },
      },
      props.children,
    );
  };

  /* --- Card: white panel --------------------------------------------------- */
  var Card = function (props) {
    var style = {
      background: C.panel,
      border: "1px solid " + C.line,
      borderRadius: 14,
      padding: "20px 22px",
      boxShadow:
        "0 1px 2px rgba(15,29,48,0.04), 0 8px 24px rgba(15,29,48,0.05)",
    };
    if (props.style) for (var k in props.style) style[k] = props.style[k];
    return h("div", { style: style }, props.children);
  };

  /* --- DeltaPill: green up / magenta down change indicator ----------------- */
  var DeltaPill = function (props) {
    var v = props.v;
    if (v == null || Math.abs(v) < 0.05) return null;
    var up = v > 0;
    return h(
      "span",
      {
        style: {
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: up ? C.teal : C.magenta,
          background: up ? C.tealSoft : C.magentaSoft,
          borderRadius: 6,
          padding: "2px 6px",
          whiteSpace: "nowrap",
        },
      },
      up ? "\u25B2" : "\u25BC",
      " ",
      Math.abs(v).toFixed(1),
      "pt",
    );
  };

  /* --- Callout: coloured left-border note ---------------------------------- */
  var Callout = function (props) {
    return h(
      "div",
      { style: { borderLeft: "3px solid " + props.color, paddingLeft: 12 } },
      h(
        "div",
        {
          style: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 13.5,
            color: C.ink,
          },
        },
        props.title,
      ),
      h(
        "div",
        {
          style: {
            fontSize: 12.5,
            color: C.muted,
            lineHeight: 1.5,
            marginTop: 3,
          },
        },
        props.body,
      ),
    );
  };

  /* --- TimeBar: horizontal proportion bar (time-on-task) ------------------- */
  var TimeBar = function (props) {
    return h(
      "div",
      { style: { marginTop: 8 } },
      h(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: C.muted,
            marginBottom: 3,
          },
        },
        h("span", null, props.label),
        h(
          "span",
          { style: { fontFamily: "'IBM Plex Mono', monospace", color: C.ink } },
          props.text,
        ),
      ),
      h(
        "div",
        { style: { height: 8, borderRadius: 5, background: C.faint } },
        h("div", {
          style: {
            width: Math.min(100, (props.mins / props.max) * 100) + "%",
            height: "100%",
            borderRadius: 5,
            background: props.color,
          },
        }),
      ),
    );
  };

  /* --- MiniStat: small labelled stat card ---------------------------------- */
  var MiniStat = function (props) {
    return h(
      Card,
      { style: { padding: "14px 16px" } },
      h(Eyebrow, null, props.label),
      h(
        "div",
        {
          style: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 26,
            fontVariantNumeric: "tabular-nums",
            color: C.ink,
            margin: "4px 0 2px",
          },
        },
        props.value,
      ),
      h("div", { style: { fontSize: 11.5, color: C.muted } }, props.note),
    );
  };

  /* =========================================================================
   * OverviewSection: adoption × content scatter (the flagship chart)
   * Fixes applied here:
   *   (2) Log x-axis now explicitly signalled: "LOG SCALE" tag on the axis +
   *       a mono note, so the non-linear tick spacing isn't misread as linear.
   *   (3) The global-content reference label moved clear of the dot field
   *       (was "global 22.7%" sitting among the clustered markers).
   *   (4) On narrow screens the 2D scatter (which collapses into an illegible
   *       flag pile at ~375px) is replaced by a sorted dot-plot: one row per
   *       market, flag + value always legible, tap still opens the profile.
   * ======================================================================== */
  function OverviewSection(props) {
    var goToMarket = props.goToMarket;
    var isNarrow = useIsNarrow(640);
    var rows = MARKETS.map(function (d) {
      var copy = {};
      for (var k in d) copy[k] = d[k];
      copy.cluster = clusterOf(d);
      copy.contentVis = d.contentMay; /* visual y; tooltip keeps the true value */
      return copy;
    });
    /* Collision relaxation (visual y only). Approximates the plot's pixel
     * geometry (conservative 900x330 plot), derives each flag's rendered
     * radius from its marketing-artifact share (mirrors the ZAxis mapping),
     * then iteratively pushes any overlapping pair apart vertically until no
     * two flags overlap. Handles chains (e.g. VNM-LKA-NPL), not just pairs.
     * X positions and all tooltip values stay truthful. */
    var PW = 900,
      PH = 330,
      LOGSPAN = Math.log(8 / 0.09);
    var mMin = Infinity,
      mMax = -Infinity;
    rows.forEach(function (r) {
      if (r.mktgArtifact < mMin) mMin = r.mktgArtifact;
      if (r.mktgArtifact > mMax) mMax = r.mktgArtifact;
    });
    var radOf = function (r) {
      var t = mMax === mMin ? 0.5 : (r.mktgArtifact - mMin) / (mMax - mMin);
      return Math.sqrt((300 + t * 460) / Math.PI);
    };
    var pxX = function (r) {
      return (Math.log(r.usageIdx / 0.09) / LOGSPAN) * PW;
    };
    var pxY = function (v) {
      return ((34 - v) / 17) * PH;
    };
    for (var it = 0; it < 40; it++) {
      var moved = false;
      for (var ci = 0; ci < rows.length; ci++) {
        for (var cj = ci + 1; cj < rows.length; cj++) {
          var A = rows[ci],
            B = rows[cj];
          var dxp = pxX(A) - pxX(B);
          var dyp = pxY(A.contentVis) - pxY(B.contentVis);
          var need = radOf(A) + radOf(B) + 6;
          var dist = Math.sqrt(dxp * dxp + dyp * dyp);
          if (dist < need) {
            var pushPt = (((need - dist) / 2 + 0.5) / PH) * 17;
            var hi = A.contentVis >= B.contentVis ? A : B;
            var lo = hi === A ? B : A;
            hi.contentVis = Math.min(33.5, hi.contentVis + pushPt);
            lo.contentVis = Math.max(17.5, lo.contentVis - pushPt);
            moved = true;
          }
        }
      }
      if (!moved) break;
    }

    /* Custom scatter marker: circular flag ringed by cluster colour, with a
     * trajectory tail showing the market's April -> May movement. The tail is
     * drawn in pixel space via the axis scales Recharts passes to the shape;
     * if scales or April data are unavailable it degrades to the plain dot. */
    var FlagDot = function (p) {
      var cx = p.cx,
        cy = p.cy,
        size = p.size,
        m = p.payload;
      if (cx == null || cy == null) return null;
      var r = Math.sqrt((size || 400) / Math.PI);
      var tail = null;
      var xs =
        p.xAxis && typeof p.xAxis.scale === "function" ? p.xAxis.scale : null;
      var ys =
        p.yAxis && typeof p.yAxis.scale === "function" ? p.yAxis.scale : null;
      if (xs && ys && m.usageIdxApr != null && m.contentApr != null) {
        var ax = xs(m.usageIdxApr),
          ay = ys(m.contentApr);
        if (isFinite(ax) && isFinite(ay)) {
          var dx = cx - ax,
            dy = cy - ay,
            len = Math.sqrt(dx * dx + dy * dy);
          if (len > r + 2) {
            /* stop the tail at the flag's rim, not its centre */
            var tx = cx - (dx / len) * (r + 1),
              ty = cy - (dy / len) * (r + 1);
            tail = h(
              "g",
              { "aria-hidden": true, pointerEvents: "none" },
              h("line", {
                x1: ax,
                y1: ay,
                x2: tx,
                y2: ty,
                stroke: CLUSTER_COLOR[m.cluster],
                strokeWidth: 2,
                strokeLinecap: "round",
                opacity: 0.35,
              }),
              h("circle", {
                cx: ax,
                cy: ay,
                r: 2.5,
                fill: "#fff",
                stroke: CLUSTER_COLOR[m.cluster],
                strokeWidth: 1.5,
                opacity: 0.55,
              }),
            );
          }
        }
      }
      return h(
        "g",
        null,
        tail,
        h(
          "g",
          {
            transform: "translate(" + (cx - r) + ", " + (cy - r) + ")",
            style: { cursor: "pointer" },
            onClick: function () {
              goToMarket(m.id);
            },
          },
          h("title", null, m.name + ": click for profile"),
          h(CircleFlag, { id: m.id, size: 2 * r }),
          h("circle", {
            cx: r,
            cy: r,
            r: r - 1.4,
            fill: "none",
            stroke: CLUSTER_COLOR[m.cluster],
            strokeWidth: "3",
          }),
        ),
      );
    };

    var kpis = [
      {
        k: "6.4\u00D7",
        l: "Australia's adoption index, the highest in APAC, ahead of Singapore (5.8\u00D7)",
        accent: C.ultra,
      },
      {
        k: "7.1%",
        l: "of all global Claude.ai usage now comes from India: the world's #2 market after the US",
        accent: C.magenta,
      },
      {
        k: "32.1%",
        l: "of Indonesian usage is content creation, the APAC high",
        accent: C.amber,
      },
      {
        k: "+1.1pt",
        l: "global growth in content-creation share, April \u2192 May 2026",
        accent: C.teal,
      },
    ];

    var tooltip = function (p) {
      if (!p.active || !p.payload || !p.payload.length) return null;
      var f = p.payload[0].payload;
      return h(
        "div",
        {
          style: {
            background: C.ink,
            color: "#fff",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 12,
            fontFamily: "'IBM Plex Sans', sans-serif",
            boxShadow: "0 8px 24px rgba(15,29,48,0.25)",
          },
        },
        h(
          "div",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 4,
            },
          },
          f.name,
        ),
        h(
          "div",
          null,
          "Adoption index: ",
          h("b", null, fmt(f.usageIdx, 2), "\u00D7"),
        ),
        f.usageIdxApr != null &&
          h(
            "div",
            { style: { color: "#9FB0C6" } },
            "April \u2192 May: ",
            fmt(f.usageIdxApr, 2),
            " \u2192 ",
            fmt(f.usageIdx, 2),
            "\u00D7",
          ),
        h(
          "div",
          null,
          "Content creation: ",
          h("b", null, fmt(f.contentMay), "%"),
          " of usage",
        ),
        h(
          "div",
          null,
          "Marketing artifacts: ",
          h("b", null, fmt(f.mktgArtifact), "%"),
        ),
        h(
          "div",
          { style: { marginTop: 4, color: "#9FB0C6", fontSize: 11 } },
          "Click to open market profile",
        ),
      );
    };

    return h(
      "div",
      { style: { display: "grid", gap: 16 } },
      /* --- headline + intro --- */
      h(
        "div",
        { style: { padding: "8px 2px 4px" } },
        h(
          "h2",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(26px,4vw,40px)",
              lineHeight: 1.12,
              margin: 0,
              color: C.ink,
              maxWidth: 780,
            },
          },
          "Content creation is the single biggest thing APAC does with Claude: the #1 use in 15 of its 18 published markets.",
        ),
        h(
          "p",
          {
            style: {
              color: C.muted,
              fontSize: 15,
              maxWidth: 680,
              lineHeight: 1.55,
              marginTop: 12,
            },
          },
          "Across the region, 20\u201332% of all Claude.ai conversations are content creation and copywriting: the top use case in 15 of 18 markets and top-two in all of them (software development leads in Cambodia; education leads in Nepal and Mongolia). Adoption intensity and marketing behaviour split the region into distinct clusters.",
        ),
      ),
      /* --- KPI cards --- */
      h(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          },
        },
        kpis.map(function (a) {
          return h(
            Card,
            {
              key: a.l,
              style: {
                borderTop: "3px solid " + a.accent,
                padding: "16px 18px",
              },
            },
            h(
              "div",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 30,
                  fontVariantNumeric: "tabular-nums",
                  color: C.ink,
                },
              },
              a.k,
            ),
            h(
              "div",
              {
                style: {
                  fontSize: 12.5,
                  color: C.muted,
                  lineHeight: 1.45,
                  marginTop: 4,
                },
              },
              a.l,
            ),
          );
        }),
      ),
      /* --- chart card --- */
      h(
        Card,
        null,
        h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 6,
            },
          },
          h(
            "div",
            null,
            h(
              Eyebrow,
              null,
              "Adoption \u00D7 marketing intensity \u00B7 May 2026",
            ),
            h(
              "div",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: 18,
                  color: C.ink,
                  marginTop: 4,
                },
              },
              "Every APAC market, mapped",
            ),
          ),
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: 14,
                alignItems: "center",
                flexWrap: "wrap",
              },
            },
            Object.keys(CLUSTER_COLOR).map(function (name) {
              return h(
                "span",
                {
                  key: name,
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: C.muted,
                  },
                },
                h("span", {
                  style: {
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#fff",
                    border: "3px solid " + CLUSTER_COLOR[name],
                    display: "inline-block",
                    boxSizing: "border-box",
                  },
                }),
                " ",
                name,
              );
            }),
            h(
              "span",
              { style: { fontSize: 11, color: C.muted } },
              "Ring = cluster \u00B7 size = marketing artifact share \u00B7 tail = April position",
            ),
          ),
        ),
        /* ---- the swap: dot-plot on mobile, scatter on desktop ---- */
        isNarrow
          ? h(AdoptionDotPlot, { rows: rows, goToMarket: goToMarket })
          : h(AdoptionScatter, {
              rows: rows,
              tooltip: tooltip,
              FlagDot: FlagDot,
            }),
        /* ---- cluster callouts ---- */
        h(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 12,
              marginTop: 14,
            },
          },
          h(Callout, {
            color: C.ultra,
            title: "Established markets",
            body: "Australia (6.4\u00D7), Singapore, NZ, Korea: high adoption, work-heavy, strong email output. Australia overtook Singapore for the regional lead between April and May. Korea pairs the highest developed-market content share (27.3%) with the lowest marketing-artifact share; its content skews non-commercial.",
          }),
          h(Callout, {
            color: C.amber,
            title: "Rising markets",
            body: "Japan, Taiwan, Mongolia, Malaysia, Thailand, Vietnam, Sri Lanka: near-parity adoption. Thailand and Vietnam show the highest work shares in APAC (53%).",
          }),
          h(Callout, {
            color: C.magenta,
            title: "Emerging markets",
            body: "Philippines, Pakistan, India, Indonesia and others: low per-capita adoption but the region's highest marketing output. PHL produces marketing artifacts at 4.4% of usage, 1.7\u00D7 the global rate.",
          }),
        ),
      ),
    );
  }

  /* --- AdoptionScatter: desktop 2D view ------------------------------------
   * Fix (2): the log axis is now explicitly labelled. Recharts' scale="log"
   *   compresses the tick spacing; without a marker a reader can misread it as
   *   linear. We add a "LOG SCALE" chip to the axis title and keep the mono
   *   ticks so the 0.1 / 0.25 / 0.5 / 1 / 2 / 4 / 8 progression reads clearly.
   * Fix (3): the global-content reference line keeps its "global 22.7%" label
   *   but it's pinned to the far right edge (insideRight) and lifted off the
   *   plane, so it no longer sits inside the India/Indonesia dot cluster.
   * -------------------------------------------------------------------------- */
  function AdoptionScatter(props) {
    var rows = props.rows,
      tooltip = props.tooltip,
      FlagDot = props.FlagDot;
    return h(
      "div",
      null,
      h(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 2,
          },
        },
        h(
          "span",
          {
            style: {
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.muted,
              background: C.faint,
              border: "1px solid " + C.line,
              borderRadius: 5,
              padding: "2px 7px",
            },
          },
          "x-axis: log scale",
        ),
      ),
      h(
        "div",
        { style: { width: "100%", height: 380 } },
        h(
          Recharts.ResponsiveContainer,
          null,
          h(
            Recharts.ScatterChart,
            { margin: { top: 16, right: 92, bottom: 34, left: 10 } },
            h(Recharts.CartesianGrid, { stroke: C.faint }),
            h(Recharts.XAxis, {
              type: "number",
              dataKey: "usageIdx",
              scale: "log",
              domain: [0.09, 8],
              ticks: [0.1, 0.25, 0.5, 1, 2, 4, 8],
              tick: {
                fontSize: 11,
                fill: C.muted,
                fontFamily: "'IBM Plex Mono', monospace",
              },
              label: {
                value:
                  "Adoption index \u00B7 usage \u00F7 working-age pop. share \u00B7 log scale \u25C7",
                position: "insideBottom",
                offset: -24,
                fontSize: 11,
                fill: C.muted,
              },
            }),
            h(Recharts.YAxis, {
              type: "number",
              dataKey: "contentVis",
              domain: [17, 34],
              tick: {
                fontSize: 11,
                fill: C.muted,
                fontFamily: "'IBM Plex Mono', monospace",
              },
              label: {
                value: "Content creation, % of usage",
                angle: -90,
                position: "insideLeft",
                offset: 4,
                fontSize: 11,
                fill: C.muted,
              },
            }),
            h(Recharts.ZAxis, {
              type: "number",
              dataKey: "mktgArtifact",
              range: [300, 760],
            }),
            h(Recharts.ReferenceLine, {
              x: 1,
              stroke: C.muted,
              strokeDasharray: "4 4",
              label: {
                value: "parity (1\u00D7)",
                fontSize: 10,
                fill: C.muted,
                position: "insideTopLeft",
              },
            }),
            h(Recharts.ReferenceLine, {
              y: GLOBAL.contentMay,
              stroke: C.muted,
              strokeDasharray: "4 4",
              label: {
                value: "global avg 22.7%",
                fontSize: 10,
                fill: C.muted,
                position: "right",
              },
            }),
            h(Recharts.Tooltip, {
              content: h(tooltip, null),
              cursor: { strokeDasharray: "3 3" },
            }),
            h(Recharts.Scatter, { data: rows, shape: h(FlagDot, null) }),
          ),
        ),
      ),
    );
  }

  /* --- AdoptionDotPlot: mobile view (fix 4) --------------------------------
   * One row per market, sorted by adoption. Flag + name + value are always
   * legible; the bar is on a log scale mirroring the desktop x-axis, with a
   * parity (1x) marker. Tapping a row opens that market's profile, matching
   * the scatter's click behaviour. This replaces the flag pile-up that made
   * the scatter unreadable at ~375px.
   * -------------------------------------------------------------------------- */
  function AdoptionDotPlot(props) {
    var goToMarket = props.goToMarket;
    var sorted = props.rows.slice().sort(function (a, b) {
      return b.usageIdx - a.usageIdx;
    });
    var lo = 0.09,
      hi = 8;
    var logPct = function (x) {
      var v = Math.max(lo, Math.min(hi, x));
      return (
        ((Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * 100
      );
    };
    return h(
      "div",
      null,
      /* scale header: parity marker + log note */
      h(
        "div",
        { style: { position: "relative", height: 16, margin: "2px 0 6px" } },
        h(
          "span",
          {
            style: {
              position: "absolute",
              left: logPct(1) + "%",
              transform: "translateX(-50%)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9.5,
              color: C.muted,
            },
          },
          "1\u00D7 parity",
        ),
        h(
          "span",
          {
            style: {
              position: "absolute",
              right: 0,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9.5,
              color: C.muted,
            },
          },
          "log scale",
        ),
      ),
      h(
        "div",
        { style: { display: "grid", gap: 6 } },
        sorted.map(function (m) {
          return h(
            "button",
            {
              key: m.id,
              onClick: function () {
                goToMarket(m.id);
              },
              "aria-label":
                m.name +
                ": adoption index " +
                fmt(m.usageIdx, 2) +
                "x, content " +
                fmt(m.contentMay) +
                "%",
              style: {
                display: "grid",
                gridTemplateColumns: "20px 92px 1fr 44px",
                alignItems: "center",
                gap: 8,
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                borderRadius: 8,
                padding: "6px 4px",
                cursor: "pointer",
                minHeight: 40,
              },
            },
            h(CircleFlag, { id: m.id, size: 18 }),
            h(
              "span",
              {
                style: {
                  fontSize: 12.5,
                  color: C.ink,
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              },
              m.name,
            ),
            h(
              "span",
              { style: { position: "relative", display: "block", height: 12 } },
              /* parity gridline */
              h("span", {
                "aria-hidden": true,
                style: {
                  position: "absolute",
                  left: logPct(1) + "%",
                  top: -2,
                  bottom: -2,
                  width: 1,
                  background: C.line,
                },
              }),
              /* track */
              h("span", {
                "aria-hidden": true,
                style: {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  height: 4,
                  transform: "translateY(-50%)",
                  borderRadius: 2,
                  background: C.faint,
                },
              }),
              /* April -> May movement stroke */
              m.usageIdxApr != null &&
                h("span", {
                  "aria-hidden": true,
                  style: {
                    position: "absolute",
                    left:
                      Math.min(logPct(m.usageIdxApr), logPct(m.usageIdx)) + "%",
                    width:
                      Math.abs(logPct(m.usageIdx) - logPct(m.usageIdxApr)) +
                      "%",
                    top: "50%",
                    height: 4,
                    transform: "translateY(-50%)",
                    borderRadius: 2,
                    background: CLUSTER_COLOR[m.cluster],
                    opacity: 0.3,
                  },
                }),
              /* ghost dot at April position */
              m.usageIdxApr != null &&
                h("span", {
                  "aria-hidden": true,
                  title: "April: " + fmt(m.usageIdxApr, 2) + "\u00D7",
                  style: {
                    position: "absolute",
                    left: logPct(m.usageIdxApr) + "%",
                    top: "50%",
                    width: 7,
                    height: 7,
                    transform: "translate(-50%,-50%)",
                    borderRadius: "50%",
                    background: "#fff",
                    border: "2px solid " + CLUSTER_COLOR[m.cluster],
                    boxSizing: "border-box",
                    opacity: 0.5,
                  },
                }),
              /* dot at adoption position, cluster-coloured */
              h("span", {
                "aria-hidden": true,
                style: {
                  position: "absolute",
                  left: logPct(m.usageIdx) + "%",
                  top: "50%",
                  width: 11,
                  height: 11,
                  transform: "translate(-50%,-50%)",
                  borderRadius: "50%",
                  background: "#fff",
                  border: "3px solid " + CLUSTER_COLOR[m.cluster],
                  boxSizing: "border-box",
                },
              }),
            ),
            h(
              "span",
              {
                style: {
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  color: C.muted,
                  textAlign: "right",
                },
              },
              fmt(m.usageIdx, 1),
              "\u00D7",
            ),
          );
        }),
      ),
      h(
        "div",
        {
          style: {
            fontSize: 11,
            color: C.muted,
            marginTop: 10,
            lineHeight: 1.5,
          },
        },
        "Tap any market for its full profile. Solid dot = May adoption, faded dot = April, on a log scale. Rotate to landscape or open on a wider screen for the adoption \u00D7 content scatter.",
      ),
    );
  }

  /* =========================================================================
   * AutomationSection: the automation gradient by marketing role
   * Fix (1): the right-hand column header read "Autom." (a hard-coded
   *   abbreviation squeezed into a 56px column). Widened the column to 76px
   *   and spelled it "Automation" so the header is no longer truncated.
   * ======================================================================== */
  var GRID_COLS = "minmax(120px,190px) 1fr 76px";

  function AutomationSection() {
    var pair = React.useState("Search / SEM");
    var selName = pair[0],
      setSel = pair[1];
    var sel = DATA.occupations.find(function (o) {
      return o.name === selName;
    });
    var AXIS_MIN = 26,
      AXIS_MAX = 58;
    var pos = function (v) {
      return ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * 100;
    };
    var speedup = sel ? (sel.humanHrs * 60) / sel.aiMin : 0;
    var mix = sel
      ? [
          { k: "Task iteration", v: sel.iteration, c: C.ultra },
          { k: "Directive", v: sel.directive, c: C.magenta },
          { k: "Feedback loop", v: sel.feedback, c: C.amber },
          { k: "Learning", v: sel.learning, c: C.teal },
          { k: "Validation", v: sel.validation, c: "#8B97A8" },
        ]
      : [];

    return h(
      "div",
      { style: { display: "grid", gap: 16 } },
      /* headline + intro */
      h(
        "div",
        { style: { padding: "8px 2px 0" } },
        h(
          "h2",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(24px,3.4vw,34px)",
              margin: 0,
              color: C.ink,
              maxWidth: 760,
              lineHeight: 1.15,
            },
          },
          "The automation gradient: performance marketing delegates, creative marketing collaborates.",
        ),
        h(
          "p",
          {
            style: {
              color: C.muted,
              fontSize: 14.5,
              maxWidth: 700,
              lineHeight: 1.55,
              marginTop: 10,
            },
          },
          "Each marketing occupation sits somewhere between ",
          h("b", { style: { color: C.teal } }, "augmentation"),
          " (iterating with AI) and ",
          h("b", { style: { color: C.magenta } }, "automation"),
          " (handing work off). Search marketers hand off a majority of tasks; writers and designers keep AI in the loop.",
        ),
      ),
      /* gradient chart card */
      h(
        Card,
        { style: { paddingBottom: 24 } },
        h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 14,
            },
          },
          h(
            Eyebrow,
            null,
            "Marketing roles by automation share \u00B7 Global data \u00B7 May 2026",
          ),
          h(
            "span",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12.5,
                fontWeight: 600,
                color: C.ultra,
                background: C.ultraSoft,
                border: "1px solid " + C.ultra + "33",
                borderRadius: 999,
                padding: "6px 13px",
              },
            },
            h(
              "svg",
              {
                width: "13",
                height: "13",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.4",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                "aria-hidden": true,
              },
              h("path", {
                d: "M9 11.5V4.5a1.5 1.5 0 0 1 3 0v6m0-2.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4c0 4-2.5 6.5-6 6.5s-5-1.5-7-5l-1.7-3.2a1.4 1.4 0 0 1 2.3-1.5L7 12.5V6",
              }),
            ),
            "Select any role for its full breakdown",
          ),
        ),
        /* directional legend */
        h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: 12,
            },
          },
          h(
            "span",
            { style: { color: C.teal } },
            "\u25C2 Keeps AI in the loop",
          ),
          h("span", { style: { color: C.magenta } }, "Hands work off \u25B8"),
        ),
        /* axis header row: "Automation" column now full-width, no truncation */
        h(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: GRID_COLS,
              gap: 12,
              alignItems: "center",
              marginBottom: 4,
            },
          },
          h(
            "span",
            {
              style: {
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.muted,
              },
            },
            "Role",
          ),
          h(
            "div",
            { style: { position: "relative" } },
            h("div", {
              style: {
                height: 8,
                borderRadius: 5,
                background:
                  "linear-gradient(90deg, " +
                  C.teal +
                  ", " +
                  C.amber +
                  ", " +
                  C.magenta +
                  ")",
              },
            }),
            [30, 40, 50].map(function (l) {
              return h(
                "span",
                {
                  key: l,
                  style: {
                    position: "absolute",
                    top: 11,
                    left: pos(l) + "%",
                    transform: "translateX(-50%)",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: C.muted,
                  },
                },
                l,
                "%",
              );
            }),
          ),
          h(
            "span",
            {
              style: {
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.muted,
                textAlign: "right",
              },
            },
            "Automation",
          ),
        ),
        /* role rows */
        h(
          "div",
          { style: { position: "relative", marginTop: 16 } },
          h(
            "div",
            { style: { display: "grid", gap: 4, position: "relative" } },
            DATA.occupations
              .slice()
              .sort(function (a, b) {
                return b.automation - a.automation;
              })
              .map(function (o) {
                var on = o.name === selName;
                var dot = 12 + Math.sqrt(o.pct) * 12;
                return h(
                  "button",
                  {
                    key: o.name,
                    onClick: function () {
                      setSel(o.name);
                    },
                    "aria-pressed": on,
                    className: "role-row",
                    "aria-label":
                      o.full +
                      ": " +
                      o.automation +
                      "% automation, " +
                      o.pct +
                      "% of global usage",
                    style: {
                      display: "grid",
                      gridTemplateColumns: GRID_COLS,
                      gap: 12,
                      alignItems: "center",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      border: "none",
                      borderRadius: 10,
                      padding: "7px 4px",
                      background: on ? C.ultraSoft : undefined,
                      transition: "background .15s ease",
                    },
                  },
                  h(
                    "span",
                    {
                      style: {
                        fontSize: 13,
                        fontWeight: on ? 700 : 500,
                        color: on ? C.ink : C.muted,
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    },
                    o.name,
                  ),
                  h(
                    "span",
                    {
                      style: {
                        position: "relative",
                        display: "block",
                        height: Math.max(20, dot),
                      },
                    },
                    h("span", {
                      "aria-hidden": true,
                      style: {
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        right: 0,
                        height: 3,
                        transform: "translateY(-50%)",
                        borderRadius: 2,
                        background:
                          "linear-gradient(90deg, " +
                          C.teal +
                          ", " +
                          C.amber +
                          ", " +
                          C.magenta +
                          ")",
                        opacity: on ? 0.5 : 0.16,
                        transition: "opacity .15s ease",
                      },
                    }),
                    h("span", {
                      "aria-hidden": true,
                      style: {
                        position: "absolute",
                        top: "50%",
                        left: pos(o.automation) + "%",
                        transform: "translate(-50%,-50%)",
                        width: dot,
                        height: dot,
                        borderRadius: "50%",
                        background: on ? C.ink : "#fff",
                        border: "3px solid " + C.ink,
                        boxShadow: on
                          ? "0 0 0 4px " + C.ultraSoft
                          : "0 1px 4px rgba(15,29,48,0.2)",
                        transition: "all .15s ease",
                      },
                    }),
                  ),
                  h(
                    "span",
                    {
                      style: {
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 12.5,
                        color: on ? C.ink : C.muted,
                        textAlign: "right",
                        fontWeight: on ? 600 : 400,
                      },
                    },
                    fmt(o.automation, 0),
                    "%",
                  ),
                );
              }),
          ),
        ),
        h(
          "div",
          {
            style: {
              fontSize: 11.5,
              color: C.muted,
              marginTop: 12,
              lineHeight: 1.5,
            },
          },
          'Reading this chart: the further right a role sits, the more of its Claude conversations are outright hand-offs ("write this for me") rather than working sessions ("let\'s refine this together"). Bigger dots = the role accounts for more of Claude\'s total global usage.',
        ),
      ),
      /* selected-role detail cards */
      sel &&
        h(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 12,
            },
          },
          h(
            Card,
            null,
            h(Eyebrow, null, "Selected role"),
            h(
              "div",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 21,
                  color: C.ink,
                  margin: "6px 0 2px",
                },
              },
              sel.full,
            ),
            h(
              "div",
              { style: { fontSize: 12.5, color: C.muted } },
              fmt(sel.pct, 2),
              "% of all global usage \u00B7 AI autonomy ",
              fmt(sel.autonomy, 1),
              "/5",
            ),
            h(
              "div",
              { style: { marginTop: 16 } },
              h(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: C.muted,
                    marginBottom: 5,
                  },
                },
                h(
                  "span",
                  null,
                  "Augmentation ",
                  fmt(100 - sel.automation),
                  "%",
                ),
                h("span", null, "Automation ", fmt(sel.automation), "%"),
              ),
              h(
                "div",
                {
                  style: {
                    height: 12,
                    borderRadius: 7,
                    background: C.tealSoft,
                    overflow: "hidden",
                    display: "flex",
                  },
                },
                h("div", {
                  style: {
                    width: 100 - sel.automation + "%",
                    background: C.teal,
                  },
                }),
                h("div", {
                  style: { width: sel.automation + "%", background: C.magenta },
                }),
              ),
            ),
          ),
          h(
            Card,
            null,
            h(Eyebrow, null, "Estimated time on tasks"),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  margin: "8px 0 2px",
                },
              },
              h(
                "span",
                {
                  style: {
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 34,
                    fontVariantNumeric: "tabular-nums",
                    color: C.ink,
                  },
                },
                speedup.toFixed(0),
                "\u00D7",
              ),
              h(
                "span",
                { style: { fontSize: 12.5, color: C.muted } },
                "faster with AI (model estimate)",
              ),
            ),
            h(TimeBar, {
              label: "Human alone",
              mins: sel.humanHrs * 60,
              max: 600,
              color: C.muted,
              text: fmt(sel.humanHrs) + " hrs",
            }),
            h(TimeBar, {
              label: "With AI",
              mins: sel.aiMin,
              max: 600,
              color: C.ultra,
              text: fmt(sel.aiMin, 0) + " min",
            }),
            h(
              "div",
              { style: { fontSize: 11, color: C.muted, marginTop: 8 } },
              "Indicative only: durations are model-estimated per task, not measured.",
            ),
          ),
          h(
            Card,
            null,
            h(Eyebrow, null, "How they work with AI"),
            h(
              "div",
              {
                style: {
                  height: 14,
                  borderRadius: 8,
                  overflow: "hidden",
                  display: "flex",
                  margin: "12px 0 12px",
                },
              },
              mix.map(function (l) {
                return (
                  l.v > 0 &&
                  h("div", {
                    key: l.k,
                    title: l.k + " " + l.v + "%",
                    style: { width: l.v + "%", background: l.c },
                  })
                );
              }),
            ),
            h(
              "div",
              { style: { display: "grid", gap: 5 } },
              mix.map(function (l) {
                return h(
                  "div",
                  {
                    key: l.k,
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12.5,
                    },
                  },
                  h(
                    "span",
                    {
                      style: {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        color: C.ink,
                      },
                    },
                    h("span", {
                      style: {
                        width: 9,
                        height: 9,
                        borderRadius: 3,
                        background: l.c,
                        display: "inline-block",
                      },
                    }),
                    l.k,
                  ),
                  h(
                    "span",
                    {
                      style: {
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: C.muted,
                      },
                    },
                    fmt(l.v),
                    "%",
                  ),
                );
              }),
            ),
          ),
        ),
    );
  }

  /* =========================================================================
   * OutputSection: what marketers actually make with Claude
   * (No feedback items targeted this section; reconstructed faithfully.)
   * ======================================================================== */
  function OutputSection(props) {
    var goToMarket = props.goToMarket;
    var topics = DATA.topics.slice().sort(function (a, b) {
      return b.may - a.may;
    });
    var topicMax = topics[0].may;
    var byArtifact = MARKETS.slice().sort(function (a, b) {
      return b.mktgArtifact - a.mktgArtifact;
    });
    var artifactMax = byArtifact[0].mktgArtifact;

    return h(
      "div",
      { style: { display: "grid", gap: 16 } },
      h(
        "div",
        { style: { padding: "8px 2px 0" } },
        h(
          "h2",
          {
            style: {
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(24px,3.4vw,34px)",
              margin: 0,
              color: C.ink,
              lineHeight: 1.15,
            },
          },
          "What marketers actually make with Claude",
        ),
        h(
          "p",
          {
            style: {
              color: C.muted,
              fontSize: 14.5,
              maxWidth: 700,
              lineHeight: 1.55,
              marginTop: 10,
            },
          },
          "Twenty-four explicitly marketing-tagged request topics add up to ~5% of everything Claude is asked to do worldwide. Social post copywriting alone is 1.5% of all global usage.",
        ),
      ),
      h(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: 12,
          },
        },
        /* topics ranking */
        h(
          Card,
          null,
          h(
            Eyebrow,
            null,
            "Marketing request topics \u00B7 % of all global usage \u00B7 May 2026",
          ),
          h(
            "div",
            { style: { display: "grid", gap: 9, marginTop: 14 } },
            topics.map(function (a) {
              return h(
                "div",
                { key: a.name },
                h(
                  "div",
                  {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12.5,
                      marginBottom: 3,
                    },
                  },
                  h("span", { style: { color: C.ink } }, a.name),
                  h(
                    "span",
                    {
                      style: {
                        display: "inline-flex",
                        gap: 8,
                        alignItems: "center",
                      },
                    },
                    h(
                      "span",
                      {
                        style: {
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: C.ink,
                        },
                      },
                      fmt(a.may, 2),
                      "%",
                    ),
                    h(DeltaPill, {
                      v: a.apr != null ? +(a.may - a.apr).toFixed(2) : null,
                    }),
                  ),
                ),
                h(
                  "div",
                  {
                    style: { height: 8, borderRadius: 5, background: C.faint },
                  },
                  h("div", {
                    style: {
                      width: (a.may / topicMax) * 100 + "%",
                      height: "100%",
                      borderRadius: 5,
                      background:
                        "linear-gradient(90deg, " +
                        C.ultra +
                        ", " +
                        C.magenta +
                        ")",
                    },
                  }),
                ),
              );
            }),
          ),
        ),
        /* marketing-artifact ranking by market */
        h(
          Card,
          null,
          h(
            Eyebrow,
            null,
            "Marketing / social-content artifacts \u00B7 % of each market's usage",
          ),
          h(
            "div",
            {
              style: {
                fontSize: 12.5,
                color: C.muted,
                marginTop: 6,
                lineHeight: 1.5,
              },
            },
            "The share of conversations whose main output was marketing or social content. Global benchmark: ",
            fmt(GLOBAL.mktgArtifact),
            "%.",
          ),
          h(
            "div",
            { style: { display: "grid", gap: 8, marginTop: 14 } },
            byArtifact.map(function (a) {
              var cl = clusterOf(a);
              return h(
                "button",
                {
                  key: a.id,
                  onClick: function () {
                    goToMarket(a.id);
                  },
                  style: {
                    display: "grid",
                    gridTemplateColumns: "138px 1fr 48px",
                    alignItems: "center",
                    gap: 10,
                    background: "transparent",
                    border: "none",
                    padding: "2px 0",
                    cursor: "pointer",
                    textAlign: "left",
                  },
                },
                h(
                  "span",
                  {
                    style: {
                      fontSize: 12.5,
                      color: C.ink,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  },
                  h(CircleFlag, { id: a.id, size: 15 }),
                  a.name,
                ),
                h(
                  "span",
                  {
                    style: {
                      position: "relative",
                      display: "block",
                      height: 8,
                    },
                  },
                  h("span", {
                    style: {
                      position: "absolute",
                      inset: 0,
                      borderRadius: 5,
                      background: C.faint,
                    },
                  }),
                  h("span", {
                    style: {
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: (a.mktgArtifact / artifactMax) * 100 + "%",
                      borderRadius: 5,
                      background: CLUSTER_COLOR[cl],
                    },
                  }),
                  h("span", {
                    title: "Global " + GLOBAL.mktgArtifact + "%",
                    style: {
                      position: "absolute",
                      top: -2,
                      bottom: -2,
                      left: (GLOBAL.mktgArtifact / artifactMax) * 100 + "%",
                      width: 2,
                      background: C.ink,
                      opacity: 0.5,
                    },
                  }),
                ),
                h(
                  "span",
                  {
                    style: {
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 12,
                      color: C.muted,
                      textAlign: "right",
                    },
                  },
                  fmt(a.mktgArtifact),
                  "%",
                ),
              );
            }),
          ),
          h(
            "div",
            { style: { fontSize: 11, color: C.muted, marginTop: 10 } },
            "Tick mark = global benchmark. Tap a market for its full profile.",
          ),
        ),
      ),
    );
  }

  /* =========================================================================
   * MarketProfileSection: per-market drilldown vs global benchmark
   * ======================================================================== */
  function MarketProfileSection(props) {
    var selId = props.selected,
      setSelected = props.setSelected;
    var m =
      MARKETS.find(function (d) {
        return d.id === selId;
      }) || MARKETS[0];
    var cl = clusterOf(m);
    /* Comparison mode: overlay a second market on every profile bar. */
    var cmpPair = React.useState(props.defaultCompare || null);
    var cmpId = cmpPair[0] === m.id ? null : cmpPair[0],
      setCmp = cmpPair[1];
    var cm = cmpId
      ? MARKETS.find(function (d) {
          return d.id === cmpId;
        })
      : null;
    var ccl = cm ? clusterOf(cm) : null;
    var metrics = [
      {
        k: "Content creation & copywriting",
        v: m.contentMay,
        c: cm ? cm.contentMay : null,
        g: GLOBAL.contentMay,
        max: 34,
        apr: m.contentApr,
      },
      {
        k: "Promotional writing",
        v: m.promoWriting,
        c: cm ? cm.promoWriting : null,
        g: GLOBAL.promoWriting,
        max: 8,
      },
      {
        k: "Marketing / social artifacts",
        v: m.mktgArtifact,
        c: cm ? cm.mktgArtifact : null,
        g: GLOBAL.mktgArtifact,
        max: 5,
      },
      {
        k: "Email / message artifacts",
        v: m.emailArtifact,
        c: cm ? cm.emailArtifact : null,
        g: GLOBAL.emailArtifact,
        max: 7,
      },
      {
        k: "Sales & revenue operations",
        v: m.salesOps,
        c: cm ? cm.salesOps : null,
        g: GLOBAL.salesOps,
        max: 1.6,
      },
      {
        k: "Marketing occupations (7 roles)",
        v: m.mktgOccSum,
        c: cm ? cm.mktgOccSum : null,
        g: GLOBAL.mktgOccSum,
        max: 3.6,
      },
      {
        k: "Work usage",
        v: m.work,
        c: cm ? cm.work : null,
        g: GLOBAL.work,
        max: 60,
      },
      {
        k: "Coursework usage",
        v: m.coursework,
        c: cm ? cm.coursework : null,
        g: GLOBAL.coursework,
        max: 50,
      },
      {
        k: "Automation-style collaboration",
        v: m.automation,
        c: cm ? cm.automation : null,
        g: GLOBAL.automation,
        max: 60,
      },
    ];

    return h(
      "div",
      { style: { display: "grid", gap: 16 } },
      /* header + market picker */
      h(
        "div",
        {
          style: {
            padding: "8px 2px 0",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "flex-end",
            justifyContent: "space-between",
          },
        },
        h(
          "div",
          null,
          h(
            Eyebrow,
            null,
            "Market profile \u00B7 May 2026 vs global benchmark",
          ),
          h(
            "h2",
            {
              style: {
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(24px,3.4vw,34px)",
                margin: "6px 0 0",
                color: C.ink,
              },
            },
            h(
              "span",
              {
                style: {
                  display: "inline-flex",
                  verticalAlign: "-3px",
                  marginRight: 10,
                },
              },
              h(CircleFlag, { id: m.id, size: 28 }),
            ),
            m.name,
            h(
              "span",
              {
                style: {
                  fontSize: 13,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 500,
                  color: CLUSTER_COLOR[cl],
                  background: CLUSTER_SOFT[cl],
                  borderRadius: 8,
                  padding: "4px 10px",
                  marginLeft: 12,
                  verticalAlign: "middle",
                },
              },
              cl,
            ),
          ),
        ),
        h(
          "div",
          { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
          MARKETS.map(function (a) {
            return h(
              "button",
              {
                key: a.id,
                onClick: function () {
                  setSelected(a.id);
                },
                style: {
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  padding: "5px 9px",
                  borderRadius: 8,
                  cursor: "pointer",
                  border: "1px solid " + (a.id === m.id ? C.ink : C.line),
                  background: a.id === m.id ? C.ink : "#fff",
                  color: a.id === m.id ? "#fff" : C.muted,
                  transition: "all .15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                },
              },
              h(CircleFlag, { id: a.id, size: 13 }),
              " ",
              a.id,
            );
          }),
        ),
      ),
      /* top stat row */
      h(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
            gap: 12,
          },
        },
        h(MiniStat, {
          label: "Adoption index",
          value: fmt(m.usageIdx, 2) + "\u00D7",
          note: "usage \u00F7 working-age pop. share",
        }),
        h(MiniStat, {
          label: "Share of global usage",
          value: fmt(m.usagePct, 2) + "%",
          note: "all Claude.ai conversations",
        }),
        h(MiniStat, {
          label: "Content creation",
          value: fmt(m.contentMay) + "%",
          note: h(DeltaPill, {
            v:
              m.contentApr != null
                ? +(m.contentMay - m.contentApr).toFixed(2)
                : null,
          }),
        }),
        h(MiniStat, {
          label: "Marketing artifacts",
          value: fmt(m.mktgArtifact) + "%",
          note: "global " + fmt(GLOBAL.mktgArtifact) + "%",
        }),
      ),
      /* profile bars vs global */
      h(
        Card,
        null,
        h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            },
          },
          h(
            Eyebrow,
            null,
            cm
              ? "Marketing profile: head to head"
              : "Marketing profile vs global",
          ),
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 5,
                flexWrap: "wrap",
              },
            },
            h(
              "span",
              {
                style: {
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: C.muted,
                  marginRight: 3,
                },
              },
              "Compare with",
            ),
            h(
              "button",
              {
                onClick: function () {
                  setCmp(null);
                },
                "aria-pressed": !cm,
                style: {
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  padding: "4px 8px",
                  borderRadius: 7,
                  cursor: "pointer",
                  border: "1px solid " + (!cm ? C.ink : C.line),
                  background: !cm ? C.ink : "#fff",
                  color: !cm ? "#fff" : C.muted,
                },
              },
              "OFF",
            ),
            MARKETS.filter(function (a) {
              return a.id !== m.id;
            }).map(function (a) {
              var on = cmpId === a.id;
              return h(
                "button",
                {
                  key: a.id,
                  title: a.name,
                  "aria-label": "Compare with " + a.name,
                  "aria-pressed": on,
                  onClick: function () {
                    setCmp(on ? null : a.id);
                  },
                  style: {
                    padding: 3,
                    borderRadius: "50%",
                    cursor: "pointer",
                    border:
                      "2px solid " +
                      (on ? CLUSTER_COLOR[clusterOf(a)] : "transparent"),
                    background: "transparent",
                    lineHeight: 0,
                    opacity: on ? 1 : 0.65,
                  },
                },
                h(CircleFlag, { id: a.id, size: 16 }),
              );
            }),
          ),
        ),
        h(
          "div",
          { style: { display: "grid", gap: 13, marginTop: 14 } },
          metrics.map(function (a) {
            return h(
              "div",
              {
                key: a.k,
                style: {
                  display: "grid",
                  gridTemplateColumns: "minmax(150px, 220px) 1fr 90px",
                  gap: 12,
                  alignItems: "center",
                },
              },
              h("span", { style: { fontSize: 12.5, color: C.ink } }, a.k),
              h(
                "div",
                {
                  style: {
                    position: "relative",
                    height: cm ? 18 : 10,
                    borderRadius: 6,
                    background: C.faint,
                  },
                },
                a.v != null &&
                  h("div", {
                    style: {
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: cm ? 8 : "100%",
                      width: Math.min(100, (a.v / a.max) * 100) + "%",
                      borderRadius: 6,
                      background: CLUSTER_COLOR[cl],
                      opacity: 0.9,
                    },
                  }),
                cm &&
                  a.c != null &&
                  h("div", {
                    style: {
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      height: 8,
                      width: Math.min(100, (a.c / a.max) * 100) + "%",
                      borderRadius: 6,
                      background: "transparent",
                      border: "2px solid " + CLUSTER_COLOR[ccl],
                      boxSizing: "border-box",
                      opacity: 0.85,
                    },
                  }),
                a.g != null &&
                  h("div", {
                    title: "Global " + a.g + "%",
                    style: {
                      position: "absolute",
                      top: -3,
                      bottom: -3,
                      left: Math.min(100, (a.g / a.max) * 100) + "%",
                      width: 2,
                      background: C.ink,
                      opacity: 0.55,
                    },
                  }),
              ),
              h(
                "span",
                {
                  style: {
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    color: C.muted,
                    textAlign: "right",
                  },
                },
                a.v == null ? "not published" : fmt(a.v) + "%",
                cm &&
                  h(
                    "span",
                    {
                      style: {
                        display: "block",
                        color: CLUSTER_COLOR[ccl],
                        opacity: 0.9,
                      },
                    },
                    a.c == null ? "n/p" : fmt(a.c) + "%",
                  ),
              ),
            );
          }),
        ),
        h(
          "div",
          { style: { fontSize: 11, color: C.muted, marginTop: 12 } },
          cm
            ? "Filled bar = " +
                m.name +
                ", outlined bar = " +
                cm.name +
                ", tick mark = global value."
            : 'Tick mark = global value. "Not published" means the cell fell below the release\'s privacy thresholds.',
        ),
      ),
      /* Australia only: state-level breakdown (subregion data) */
      m.id === "AUS" &&
        h(
          Card,
          null,
          h(Eyebrow, null, "Australia: state breakdown \u00B7 May 2026"),
          h(
            "div",
            { style: { fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.5 } },
            "Usage = each state's share of Australia's national usage. Content and promotional writing = share of that state's own conversations.",
          ),
          h(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "minmax(104px, 150px) 1fr 52px 52px 52px",
                gap: 10,
                alignItems: "center",
                marginTop: 14,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.muted,
              },
            },
            h("span", null, "State"),
            h("span", null, ""),
            h("span", { style: { textAlign: "right" } }, "Content"),
            h("span", { style: { textAlign: "right" } }, "Promo"),
            h("span", { style: { textAlign: "right" } }, "Usage"),
          ),
          h(
            "div",
            { style: { display: "grid", gap: 9, marginTop: 8 } },
            DATA.auStates
              .slice()
              .sort(function (x, y) {
                return y.usage - x.usage;
              })
              .map(function (s) {
                var barMax = 26;
                return h(
                  "div",
                  {
                    key: s.id,
                    style: {
                      display: "grid",
                      gridTemplateColumns: "minmax(104px, 150px) 1fr 52px 52px 52px",
                      gap: 10,
                      alignItems: "center",
                    },
                  },
                  h("span", { style: { fontSize: 12.5, color: C.ink } }, s.name),
                  h(
                    "span",
                    { style: { position: "relative", display: "block", height: 8 } },
                    h("span", {
                      "aria-hidden": true,
                      style: { position: "absolute", inset: 0, borderRadius: 5, background: C.faint },
                    }),
                    h("span", {
                      "aria-hidden": true,
                      style: {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: Math.min(100, (s.content / barMax) * 100) + "%",
                        borderRadius: 5,
                        background: CLUSTER_COLOR.Established,
                      },
                    }),
                    h("span", {
                      title: "National content: " + fmt(m.contentMay) + "%",
                      style: {
                        position: "absolute",
                        top: -2,
                        bottom: -2,
                        left: Math.min(100, (m.contentMay / barMax) * 100) + "%",
                        width: 2,
                        background: C.ink,
                        opacity: 0.5,
                      },
                    }),
                  ),
                  h(
                    "span",
                    { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.muted, textAlign: "right" } },
                    fmt(s.content),
                    "%",
                  ),
                  h(
                    "span",
                    { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.muted, textAlign: "right" } },
                    fmt(s.promo),
                    "%",
                  ),
                  h(
                    "span",
                    { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.ink, textAlign: "right" } },
                    fmt(s.usage),
                    "%",
                  ),
                );
              }),
          ),
          h(
            "div",
            { style: { fontSize: 11, color: C.muted, marginTop: 12 } },
            "Bar = content-creation share; tick = the national 23.5% benchmark.",
          ),
        ),
    );
  }

  /* =========================================================================
   * App: sticky header, tab nav, section router, footer
   * ======================================================================== */
  function App() {
    var tabPair = React.useState("overview");
    var tab = tabPair[0],
      setTab = tabPair[1];
    var marketPair = React.useState("AUS");
    var market = marketPair[0],
      setMarket = marketPair[1];
    var goToMarket = function (id) {
      setMarket(id);
      setTab("markets");
    };
    var tabs = [
      { id: "overview", label: "Overview" },
      { id: "roles", label: "Automation gradient" },
      { id: "output", label: "What gets made" },
      { id: "markets", label: "Market profiles" },
    ];

    return h(
      "div",
      {
        style: {
          minHeight: "100vh",
          background: C.paper,
          fontFamily: "'IBM Plex Sans', sans-serif",
          color: C.ink,
        },
      },
      h(
        "style",
        null,
        "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');" +
          "* { box-sizing: border-box; }" +
          "button:focus-visible { outline: 2px solid " +
          C.ultra +
          "; outline-offset: 3px; border-radius: 6px; }" +
          ".role-row { background: transparent; }" +
          ".role-row:hover { background: " +
          C.faint +
          "; }" +
          "@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }",
      ),
      /* header */
      h(
        "header",
        {
          style: {
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "rgba(242,244,248,0.92)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid " + C.line,
          },
        },
        h("div", {
          style: {
            height: 3,
            background:
              "linear-gradient(90deg, " +
              C.teal +
              ", " +
              C.amber +
              ", " +
              C.magenta +
              ", " +
              C.ultra +
              ")",
          },
        }),
        h(
          "div",
          {
            style: {
              maxWidth: 1140,
              margin: "0 auto",
              padding: "14px 20px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
            },
          },
          h(
            "div",
            null,
            h(
              Eyebrow,
              { color: C.ultra },
              "Anthropic Economic Index \u00B7 Apr\u2013May 2026 release",
            ),
            h(
              "div",
              {
                style: {
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 19,
                  letterSpacing: "-0.01em",
                },
              },
              "Marketing \u00D7 AI ",
              h(
                "span",
                { style: { color: C.muted, fontWeight: 500 } },
                "/ the APAC view",
              ),
            ),
          ),
          h(
            "nav",
            {
              style: { display: "flex", gap: 6, flexWrap: "wrap" },
              "aria-label": "Dashboard sections",
            },
            tabs.map(function (s) {
              return h(
                "button",
                {
                  key: s.id,
                  onClick: function () {
                    setTab(s.id);
                  },
                  style: {
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "7px 13px",
                    borderRadius: 999,
                    cursor: "pointer",
                    border: "1px solid " + (tab === s.id ? C.ink : C.line),
                    background: tab === s.id ? C.ink : "#fff",
                    color: tab === s.id ? "#fff" : C.muted,
                    transition: "all .15s ease",
                  },
                },
                s.label,
              );
            }),
          ),
        ),
      ),
      /* main / router */
      h(
        "main",
        {
          style: {
            maxWidth: 1140,
            margin: "0 auto",
            padding: "22px 20px 40px",
          },
        },
        tab === "overview" && h(OverviewSection, { goToMarket: goToMarket }),
        tab === "roles" && h(AutomationSection, null),
        tab === "output" && h(OutputSection, { goToMarket: goToMarket }),
        tab === "markets" &&
          h(MarketProfileSection, { selected: market, setSelected: setMarket }),
      ),
      /* footer */
      h(
        "footer",
        { style: { borderTop: "1px solid " + C.line, background: "#fff" } },
        h(
          "div",
          {
            style: {
              maxWidth: 1140,
              margin: "0 auto",
              padding: "20px",
              fontSize: 12,
              color: C.muted,
              lineHeight: 1.6,
            },
          },
          h("b", { style: { color: C.ink } }, "Read this carefully:"),
          " data covers Claude.ai chat & Cowork (Free/Pro/Max) only, not enterprise API usage or other AI tools. Occupation and topic labels are inferred from conversation content, not verified job titles. Time-saved figures are model estimates. Coverage: 18 APAC markets published (no China or Hong Kong data); some cells for Cambodia, Mongolia, Nepal and Sri Lanka fall below publication thresholds. Two months of data (April\u2013May 2026), so month-on-month movements are directional. Source: Anthropic Economic Index, 2026-06-26 release (CC-BY).",
        ),
      ),
    );
  }

  /* --- Mount --------------------------------------------------------------- */
  ReactDOM.createRoot(document.getElementById("root")).render(h(App, null));
})();
