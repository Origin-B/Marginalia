export default function Overlay({
  active,
  setActive,
}: {
  active: boolean;
  setActive: (n: boolean) => void;
}) {
  return (
    <div
      className={`${active ? "block" : "hidden"} bg-foreground/10 fixed inset-0`}
      onClick={() => setActive(false)}
    />
  );
}
