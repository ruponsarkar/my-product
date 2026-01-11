import { PieChart, Pie, Tooltip, Cell } from "recharts";

// const data = [
//   { name: "Electronics", value: 400 },
//   { name: "Clothing", value: 300 },
//   { name: "Food", value: 200 },
// ];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function CategoryPieChart({data}) {
  return (
    <PieChart width={350} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
