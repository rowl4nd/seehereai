const FernLeaves = () => {
  // Botanical fern leaf SVG path
  const fernPath =
    "M10 0 C10 0 8 12 6 18 C4 24 0 28 0 28 C0 28 6 26 8 22 C9 19 10 14 10 14 C10 14 10 20 8 26 C6 32 2 36 2 36 C2 36 8 34 10 30 C11 27 12 22 12 22 C12 22 13 28 12 34 C11 40 8 44 8 44 C8 44 13 42 14 38 C15 34 14 28 14 28 C14 28 16 34 16 40 C16 46 14 50 14 50 C14 50 18 48 18 42 C18 36 16 30 16 30 C16 30 19 36 20 42 C21 48 20 52 20 52 C20 52 23 48 22 42 C21 36 18 30 18 30 C18 30 22 34 24 40 C26 46 26 50 26 50 C26 50 27 46 26 40 C25 34 20 26 20 26 L10 0Z";

  // Monstera-style leaf path
  const monsteraPath =
    "M25 0 C25 0 20 10 15 18 C10 26 2 30 2 30 C2 30 10 30 16 26 C18 24 20 20 20 20 C20 20 14 28 8 34 C2 40 0 44 0 44 C0 44 8 42 14 36 C18 32 22 26 22 26 C22 26 18 36 16 42 C14 48 14 52 14 52 C14 52 18 48 20 42 C22 36 24 30 24 30 C24 30 24 38 26 44 C28 50 30 52 30 52 C30 52 30 48 28 42 C26 36 26 30 26 30 C26 30 30 36 34 40 C38 44 40 46 40 46 C40 46 38 42 36 38 C34 34 28 26 28 26 C28 26 34 30 38 32 C42 34 46 34 46 34 C46 34 42 32 38 30 C34 28 28 24 28 24 L25 0Z";

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
          viewBox="0 0 50 55"
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
