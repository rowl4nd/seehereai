interface WaveDividerProps {
  fillColor?: string;
  variant?: 1 | 2 | 3;
  flip?: boolean;
  className?: string;
}

const paths: Record<number, string> = {
  1: "M0,64 C200,20 400,100 600,50 C800,0 1000,80 1200,40 L1200,120 L0,120 Z",
  2: "M0,80 C150,40 350,100 500,60 C650,20 850,90 1000,50 C1100,30 1200,70 1200,70 L1200,120 L0,120 Z",
  3: "M0,50 C100,80 300,20 500,70 C700,120 900,30 1200,60 L1200,120 L0,120 Z",
};

const WaveDivider = ({
  fillColor = "hsl(var(--background))",
  variant = 1,
  flip = false,
  className = "",
}: WaveDividerProps) => (
  <div
    className={`w-full leading-[0] overflow-hidden ${className}`}
    style={{ marginTop: "-1px", marginBottom: "-1px" }}
  >
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="w-full h-[60px] md:h-[80px] block"
      style={flip ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d={paths[variant]} fill={fillColor} />
    </svg>
  </div>
);

export default WaveDivider;
