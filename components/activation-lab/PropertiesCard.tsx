interface Props {
  data: {
    range: string;
    gradient: string;
    use: string;
  };
}

export default function PropertiesCard({
  data,
}: Props) {
  return (
    <div className="glass-card p-6">
     
      <div className="space-y-3">

        <p>
          <span className="font-bold">
            Range:
          </span>{" "}
          {data.range}
        </p>

        <p>
          <span className="font-bold">
            Gradient:
          </span>{" "}
          {data.gradient}
        </p>

        <p>
          <span className="font-bold">
            Use Cases:
          </span>{" "}
          {data.use}
        </p>

      </div>
    </div>
  );
}