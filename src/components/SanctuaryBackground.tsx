const SanctuaryBackground = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#f8f6f3] overflow-hidden">
      {/* Monstera leaf silhouette - top left */}
      <div className="absolute -top-20 -left-20 animate-sanctuary-float">
        <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          className="opacity-[0.04] blur-[12px]"
        >
          <path
            d="M300 50C250 80 200 130 180 200C160 270 170 320 150 370C130 420 80 460 60 500C100 480 140 440 170 400C200 360 210 320 230 290C220 340 200 390 190 440C230 410 260 370 270 320C265 370 250 430 260 480C290 440 300 390 300 340C300 390 310 440 340 480C350 430 335 370 330 320C340 370 370 410 410 440C400 390 380 340 370 290C390 320 400 360 430 400C460 440 500 480 540 500C520 460 470 420 450 370C430 320 440 270 420 200C400 130 350 80 300 50Z"
            fill="#3d3a35"
          />
        </svg>
      </div>

      {/* Vesica Piscis - bottom right */}
      <div className="absolute -bottom-40 -right-40 animate-sanctuary-breathe">
        <div className="relative w-[500px] h-[500px]">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#af9cd3] blur-[120px] opacity-[0.07]" />
          <div className="absolute top-[100px] left-[100px] w-[400px] h-[400px] rounded-full bg-[#af9cd3] blur-[120px] opacity-[0.07]" />
        </div>
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
};

export default SanctuaryBackground;
