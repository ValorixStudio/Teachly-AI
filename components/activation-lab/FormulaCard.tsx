interface Props {
  title: string;
  formula: string;
}

export default function FormulaCard({
  formula,
}: Props) {
  return (
    <div className="glass-card p-6">
    

      <p className="mt-4 text-3xl font-mono">
        {formula}
      </p>
    </div>
  );
}