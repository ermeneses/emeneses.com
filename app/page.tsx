/* eslint-disable @next/next/no-img-element */
export default function Page() {
  return (
    <div className="w-full h-svh flex flex-col justify-center items-center gap-4 flex-wrap">
      <div className="w-32 h-32 overflow-hidden rounded-xl relative">
        <img src="/yo.png" alt="yo" className="w-32 absolute -top-5" />
      </div>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Eduardo Meneses Denis
      </h4>
    </div>
  );
}
