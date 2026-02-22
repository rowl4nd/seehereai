const FernLeaves = () => {
  // Detailed botanical fern frond with individual pinnae
  const fernPath =
    "M50 0 C50 2 49 8 48 14 C47 16 44 18 40 20 C36 22 30 23 26 22 C22 21 20 19 20 19 C20 19 22 22 26 24 C30 26 36 27 40 28 C44 29 47 30 48 32 C48 34 47 38 46 42 C45 44 42 46 38 48 C34 50 28 51 24 50 C20 49 18 47 18 47 C18 47 20 50 24 52 C28 54 34 55 38 56 C42 57 45 58 46 60 C46 62 45 66 44 70 C43 72 40 74 36 76 C32 78 26 79 22 78 C18 77 16 75 16 75 C16 75 18 78 22 80 C26 82 32 83 36 84 C40 85 43 86 44 88 C44 90 43 94 42 98 C41 100 38 102 34 103 C30 104 24 104 20 103 C16 102 14 100 14 100 C14 100 16 103 20 105 C24 107 30 108 34 109 C38 110 41 111 42 114 C42 116 40 120 38 124 C36 128 32 130 28 131 C24 132 20 131 18 130 C16 129 15 127 15 127 C15 127 16 130 18 132 C20 134 24 135 28 136 C32 137 36 138 38 142 C39 146 38 150 36 154 C34 158 30 160 26 160 C22 160 20 158 20 158 C20 158 22 161 26 162 C30 163 34 162 37 164 C40 166 42 170 42 176 C42 180 40 184 38 186 C36 188 34 188 32 188 L50 0Z";

  // Detailed monstera leaf with fenestrations and natural curves
  const monsteraPath =
    "M50 0 C48 4 44 12 40 20 C36 28 30 36 24 42 C18 48 12 52 8 54 C4 56 2 56 1 55 C0 54 0 52 2 50 C4 48 8 46 10 44 C12 42 12 40 10 40 C8 40 4 42 2 44 C0 46 0 48 0 50 C0 52 0 56 2 58 C4 60 8 62 12 62 C16 62 20 60 24 56 C26 54 28 50 28 50 C28 50 26 56 22 62 C18 68 12 72 8 74 C4 76 2 76 1 75 C0 74 0 72 2 70 C4 68 8 66 10 64 C12 62 12 60 10 60 C8 60 4 62 2 66 C0 70 0 74 2 76 C4 78 8 80 14 80 C20 80 26 76 30 70 C32 66 34 62 34 62 C34 62 34 68 36 74 C38 80 40 84 44 86 C48 88 52 88 54 86 C56 84 56 80 54 78 C52 76 48 74 46 74 C44 74 42 76 42 78 C42 80 44 82 46 84 C48 86 50 86 50 86 C50 86 46 88 42 88 C38 88 34 86 32 82 C30 78 30 72 30 66 C30 60 32 54 34 50 C36 46 40 42 44 38 C48 34 54 28 58 22 C62 16 66 10 68 6 C70 2 70 0 70 0 C70 0 66 4 62 10 C58 16 54 24 50 30 C46 36 42 40 38 42 C34 44 30 44 28 42 C26 40 26 36 28 34 C30 32 34 30 36 30 C38 30 40 32 40 34 C40 36 38 38 36 38 C34 38 32 36 32 34 C32 32 34 28 36 26 C38 24 42 22 44 20 C46 18 48 14 50 8 C52 4 52 2 50 0Z";

  const leaves = [
    { path: fernPath, top: "-2%", left: "-2%", size: 280, rotate: -25, opacity: 0.05 },
    { path: monsteraPath, bottom: "-4%", right: "-2%", size: 320, rotate: 140, opacity: 0.04 },
    { path: fernPath, top: "5%", right: "-3%", size: 200, rotate: -60, opacity: 0.06 },
    { path: monsteraPath, bottom: "0%", left: "-1%", size: 240, rotate: 20, opacity: 0.05 },
    { path: fernPath, top: "40%", left: "-4%", size: 160, rotate: 10, opacity: 0.035 },
    { path: monsteraPath, top: "30%", right: "2%", size: 140, rotate: -45, opacity: 0.03 },
  ];

  return (
    <>
      {leaves.map((leaf, i) => (
        <svg
          key={i}
          viewBox="0 0 70 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute"
          style={{
            width: leaf.size,
            height: leaf.size,
            top: leaf.top,
            left: leaf.left,
            right: leaf.right,
            bottom: leaf.bottom,
            opacity: leaf.opacity,
            transform: `rotate(${leaf.rotate}deg)`,
          }}
        >
          <path d={leaf.path} fill="#2d5a3f" />
        </svg>
      ))}
    </>
  );
};

export default FernLeaves;
