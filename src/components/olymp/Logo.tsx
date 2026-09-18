import { cn } from "@/lib/utils";

/**
 * OlympEx official logo — vectorised from the client asset
 * (OlympEx_Logo_Aligned_HighRes.pdf, embedded 4000×2460 raster).
 *
 * Composition: a rainbow arc (cyan→blue→violet→purple) spanning 9 to 3
 * o'clock over three pyramid peaks — the left peak's blue leg and the
 * right peak's apex ride on the arc (both inside D_ARC), the left peak's
 * green swoosh leg is D_GREEN, the right purple peak is D_RIGHT and the
 * dominant hollow centre pyramid is D_CENTER. The wordmark "OLYMPEX" uses
 * bespoke geometric capitals — the O is a hollow diamond — carrying the
 * same green→purple gradient (D_LETTERS).
 *
 * Colours switch for dark mode via the --ox-* custom properties
 * defined in globals.css (each gradient stop reads a CSS variable).
 */

const D_ARC =
  "M614 1397 L614 1543 L621 1548 L671 1548 L679 1543 L678 1461 L681 1412 L693 1315 L709 1235 L720 1192 L724 1186 L724 1178 L735 1149 L740 1128 L743 1124 L746 1109 L758 1076 L761 1073 L762 1065 L789 1008 L793 994 L838 907 L855 881 L857 874 L900 808 L956 734 L1022 660 L1085 600 L1138 555 L1174 527 L1241 481 L1336 426 L1435 380 L1496 357 L1539 345 L1555 338 L1647 315 L1657 315 L1709 304 L1721 304 L1772 296 L1886 289 L1987 292 L2109 306 L2222 330 L2319 361 L2418 402 L2474 430 L2520 459 L2527 461 L2552 479 L2559 481 L2631 532 L2713 600 L2787 672 L2854 750 L2918 839 L2960 909 L3008 1004 L3008 1008 L3031 1058 L3072 1180 L3076 1202 L3080 1210 L3080 1217 L3088 1242 L3099 1297 L3104 1337 L3107 1346 L3114 1412 L3117 1472 L3117 1545 L3122 1549 L3179 1549 L3184 1543 L3186 1425 L3175 1306 L3165 1257 L3163 1236 L3144 1165 L3140 1142 L3125 1100 L3117 1070 L3101 1032 L3099 1022 L3075 966 L3057 931 L3056 925 L2988 806 L2932 726 L2895 680 L2841 619 L2743 525 L2734 520 L2687 480 L2643 448 L2563 396 L2528 378 L2517 370 L2491 358 L2487 354 L2471 346 L2466 346 L2431 327 L2416 323 L2377 304 L2370 304 L2359 298 L2311 281 L2256 266 L2249 262 L2189 247 L2084 228 L1947 216 L1846 216 L1809 220 L1796 219 L1713 228 L1679 235 L1666 235 L1619 247 L1608 247 L1487 281 L1427 304 L1422 304 L1407 312 L1377 323 L1317 351 L1241 392 L1134 462 L1056 523 L998 576 L944 630 L879 707 L812 801 L752 905 L723 965 L698 1024 L687 1057 L683 1063 L664 1127 L660 1134 L659 1143 L656 1147 L655 1159 L640 1212 L634 1254 L627 1284Z";

const D_GREEN =
  "M1489 928 L1480 926 L1472 933 L1149 1346 L1026 1513 L1024 1520 L1031 1520 L1118 1477 L1130 1466 L1280 1267 L1490 1002 L1498 1007 L1501 1016 L1509 1188 L1512 1191 L1517 1187 L1541 1151 L1556 1121 L1557 1040 L1561 1003Z";

const D_RIGHT =
  "M2290 908 L2212 1005 L2211 1011 L2227 1069 L2233 1070 L2237 1067 L2269 1021 L2300 985 L2315 1019 L2380 1233 L2517 1325 L2768 1512 L2772 1512 L2772 1504 L2642 1326 L2410 1017 L2390 994 L2360 980 L2321 939 L2299 910Z";

const D_CENTER =
  "M1316 1504 L1317 1508 L1321 1508 L1364 1477 L1455 1401 L1589 1194 L1874 774 L1888 929 L1896 976 L1910 1001 L1978 1083 L1992 1105 L1952 1173 L1788 1473 L1778 1499 L1790 1504 L1878 1504 L2336 1523 L2453 1524 L2456 1521 L2455 1515 L2207 1113 L2153 1033 L1904 638 L1895 631 L1879 648 L1699 917 L1654 989 L1467 1268ZM2282 1464 L2281 1467 L2154 1467 L1871 1477 L1855 1475 L1955 1393 L2069 1309 L2188 1393Z";

const D_LETTERS = [
  "M796 1661 L781 1672 L615 1899 L608 1918 L623 1943 L783 2165 L794 2173 L857 2174 L864 2172 L919 2100 L1047 1923 L1048 1914 L1036 1893 L871 1668 L859 1660ZM827 1756 L840 1770 L943 1915 L939 1926 L829 2083 L824 2080 L712 1917 L769 1833Z",
  "M1101 1675 L1093 1680 L1091 1690 L1099 1705 L1104 1726 L1104 2057 L1110 2095 L1123 2121 L1136 2134 L1148 2140 L1181 2148 L1223 2148 L1229 2139 L1238 2073 L1233 2069 L1204 2066 L1196 2057 L1190 2031 L1190 1736 L1204 1678 L1194 1672 L1119 1672Z",
  "M1504 1760 L1495 1768 L1467 1847 L1416 1965 L1364 1846 L1345 1797 L1337 1767 L1332 1760 L1261 1782 L1242 1791 L1236 1799 L1237 1803 L1259 1822 L1371 2060 L1317 2175 L1294 2203 L1294 2210 L1301 2216 L1381 2247 L1390 2242 L1393 2217 L1409 2172 L1559 1840 L1572 1819 L1589 1801 L1589 1794 L1581 1788Z",
  "M1701 1766 L1631 1976 L1595 2095 L1579 2108 L1572 2118 L1574 2126 L1579 2131 L1653 2151 L1673 2151 L1676 2111 L1736 1914 L1822 2129 L1827 2135 L1860 2137 L1871 2131 L1949 1928 L1957 1914 L2018 2116 L2018 2149 L2027 2153 L2098 2135 L2115 2126 L2117 2113 L2100 2093 L1995 1764 L1989 1761 L1942 1761 L1935 1765 L1848 1982 L1761 1765 L1751 1760 L1709 1761Z",
  "M2178 1710 L2140 1737 L2152 1768 L2152 2185 L2140 2220 L2152 2230 L2236 2230 L2242 2228 L2248 2220 L2236 2186 L2236 2069 L2442 1925 L2450 1912 L2451 1895 L2441 1878 L2386 1839 L2231 1739ZM2237 1834 L2339 1903 L2238 1975 L2235 1836Z",
  "M2764 1644 L2759 1644 L2558 1814 L2475 1886 L2468 1899 L2468 1919 L2471 1927 L2583 2025 L2757 2184 L2763 2183 L2820 2114 L2822 2106 L2792 2087 L2761 2062 L2632 1947 L2794 1951 L2799 1945 L2799 1866 L2795 1859 L2639 1864 L2672 1832 L2790 1737 L2819 1719 L2817 1711Z",
  "M2902 1803 L2902 1812 L2954 1887 L2994 1952 L2899 2097 L2899 2103 L2971 2128 L2979 2128 L2996 2087 L3040 2011 L3101 2129 L3180 2105 L3181 2097 L3087 1951 L3089 1943 L3133 1876 L3180 1810 L3180 1805 L3171 1799 L3104 1776 L3043 1889 L3040 1890 L2980 1774 L2974 1774Z",
];

/* Gradient stops — offsets in viewBox units, colours via CSS variables. */
const ARC_STOPS: Array<[number, string]> = [
  [0.0071, "var(--ox-a1)"],
  [0.0303, "var(--ox-a2)"],
  [0.0811, "var(--ox-a3)"],
  [0.1575, "var(--ox-a4)"],
  [0.2539, "var(--ox-a5)"],
  [0.3650, "var(--ox-a6)"],
  [0.4846, "var(--ox-a7)"],
  [0.6047, "var(--ox-a8)"],
  [0.7193, "var(--ox-a9)"],
  [0.8205, "var(--ox-a10)"],
  [0.9028, "var(--ox-a11)"],
  [0.9614, "var(--ox-a12)"],
  [0.9929, "var(--ox-a13)"],
];

const WM_STOPS: Array<[number, string]> = [
  [0.0175, "var(--ox-w1)"],
  [0.0685, "var(--ox-w2)"],
  [0.1195, "var(--ox-w3)"],
  [0.1705, "var(--ox-w4)"],
  [0.2215, "var(--ox-w5)"],
  [0.2725, "var(--ox-w6)"],
  [0.3235, "var(--ox-w7)"],
  [0.3745, "var(--ox-w8)"],
  [0.4255, "var(--ox-w9)"],
  [0.4765, "var(--ox-w10)"],
  [0.5275, "var(--ox-w11)"],
  [0.5785, "var(--ox-w12)"],
  [0.6295, "var(--ox-w13)"],
  [0.6805, "var(--ox-w14)"],
  [0.7315, "var(--ox-w15)"],
  [0.7825, "var(--ox-w16)"],
  [0.8335, "var(--ox-w17)"],
  [0.8845, "var(--ox-w18)"],
  [0.9355, "var(--ox-w19)"],
  [0.9865, "var(--ox-w20)"],
];

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="604 206 2594 1354"
      role="img"
      aria-label="Olymp Ex mark"
      className={cn("h-10 w-auto", className)}
    >
      <defs>
        <linearGradient id="ox-arcg" gradientUnits="userSpaceOnUse" x1="620" y1="0" x2="3160" y2="0">
          {ARC_STOPS.map(([offset, color], i) => (
            <stop key={i} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id="ox-grg" gradientUnits="userSpaceOnUse" x1="0" y1="988" x2="0" y2="1442">
          <stop offset="0" stopColor="var(--ox-g1)" />
          <stop offset="1" stopColor="var(--ox-g2)" />
        </linearGradient>
        <linearGradient id="ox-rpg" gradientUnits="userSpaceOnUse" x1="0" y1="604" x2="0" y2="1370">
          <stop offset="0" stopColor="var(--ox-r1)" />
          <stop offset="0.35" stopColor="var(--ox-r2)" />
          <stop offset="1" stopColor="var(--ox-r3)" />
        </linearGradient>
        <linearGradient id="ox-cpg" gradientUnits="userSpaceOnUse" x1="0" y1="812" x2="0" y2="1482">
          <stop offset="0" stopColor="var(--ox-c1)" />
          <stop offset="0.55" stopColor="var(--ox-c2)" />
          <stop offset="1" stopColor="var(--ox-c3)" />
        </linearGradient>
      </defs>
      {/* rainbow arc — also carries the left peak's blue leg and the right peak's apex */}
      <path fill="url(#ox-arcg)" d={D_ARC} />
      {/* left peak green swoosh leg */}
      <path fill="url(#ox-grg)" d={D_GREEN} />
      {/* right peak (purple) */}
      <path fill="url(#ox-rpg)" d={D_RIGHT} />
      {/* centre peak (dominant, hollow) */}
      <path fill="url(#ox-cpg)" fillRule="evenodd" d={D_CENTER} />
    </svg>
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="598 1634 2594 624"
      role="img"
      aria-label="OLYMPEX"
      className={cn("h-5 w-auto", className)}
    >
      <defs>
        <linearGradient id="ox-wmg" gradientUnits="userSpaceOnUse" x1="640" y1="0" x2="3150" y2="0">
          {WM_STOPS.map(([offset, color], i) => (
            <stop key={i} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      {D_LETTERS.map((d, i) => (
        <path key={i} fill="url(#ox-wmg)" fillRule="evenodd" d={d} />
      ))}
    </svg>
  );
}

/**
 * Brand lock-up. Default: horizontal (header-friendly). `stacked` renders
 * the official aligned composition from the source asset — mark centred
 * above the wordmark at matching widths.
 */
export function Logo({
  className,
  stacked = false,
}: {
  className?: string;
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <span className={cn("inline-flex flex-col items-center gap-2", className)}>
        <LogoMark className="w-[220px] max-w-full h-auto shrink-0" />
        <LogoWordmark className="w-[224px] max-w-full h-auto" />
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-10 w-auto shrink-0" />
      <LogoWordmark className="h-[22px] w-auto" />
    </span>
  );
}
