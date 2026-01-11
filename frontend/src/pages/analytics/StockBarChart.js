import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   { name: "Product A", stock: 120 },
//   { name: "Product B", stock: 80 },
//   { name: "Product C", stock: 40 },
// ];

export default function StockBarChart({ data, bars }) {
  console.log("datadata", data);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {
          bars && bars.map((bar, index) => (
            <Bar key={index} dataKey={bar.key} fill={bar.color} />
          ))
        }
        {/* <Bar dataKey="stockQty" fill="#1976d2" />
        <Bar dataKey="reorderLevel" fill="red" /> */}
      </BarChart>
    </ResponsiveContainer>
  );
}
