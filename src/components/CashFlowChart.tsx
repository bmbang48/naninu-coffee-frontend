import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { formatCurrency } from "./FormatCurrency";

const CashFlowChart = ({ data }: any) => {

  const chartData = data?.map((item:any) => ({
    date: item.date,
    cash_in: Number(item.cash_in),
    cash_out: Number(item.cash_out),
    profit: Number(item.cash_in) - Number(item.cash_out)
  }));


  return (
    <div className="card p-3 mt-3">
      <h5>Cashflow Chart</h5>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value:any)=> formatCurrency(value)}/>
          <Legend />

          <Line type="monotone" dataKey="cash_in" stroke="#16a34a" />
          <Line type="monotone" dataKey="cash_out" stroke="#dc2626" />
          <Line type="monotone" dataKey="profit" stroke="#2563eb" />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowChart;